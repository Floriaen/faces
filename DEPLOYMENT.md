# Deployment Guide

## Prerequisites

### On your VPS (Ubuntu/Debian):
```bash
# Update package index
sudo apt update

# Install Docker and Docker Compose
sudo apt install -y docker.io docker-compose

# Add your user to docker group
sudo usermod -aG docker $USER

# Enable Docker to start on boot
sudo systemctl enable docker
sudo systemctl start docker

# Log out and log back in for group changes to take effect
```

**Note:** If you get package conflicts because Docker is already installed manually, first remove it:
```bash
sudo apt remove docker docker-engine docker.io containerd runc
sudo apt autoremove
```

### Setup project on VPS:
```bash
# Create directory
sudo mkdir -p /opt/faces
sudo chown $USER:$USER /opt/faces

# Clone repository
cd /opt/faces
git clone <your-repo-url> .
```

### Setup Nginx reverse proxy:
```bash
# Install nginx and certbot
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Create initial nginx config (replace YOUR_DOMAIN with your actual domain)
sudo tee /etc/nginx/sites-available/faces > /dev/null <<'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/faces /etc/nginx/sites-enabled/

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate (make sure DNS points to your VPS first!)
# Replace YOUR_DOMAIN with your actual domain
sudo certbot --nginx -d YOUR_DOMAIN

# Certbot will automatically update the nginx config with SSL settings
```

### Setup passwordless sudo for deployment:
```bash
# Allow deployment user to run necessary commands without password
# This is required for GitHub Actions to update nginx config automatically
echo "$USER ALL=(ALL) NOPASSWD: /usr/bin/cp, /usr/sbin/nginx, /usr/bin/systemctl" | sudo tee /etc/sudoers.d/faces-deploy
sudo chmod 440 /etc/sudoers.d/faces-deploy
```

### GitHub Secrets:
Add these secrets in GitHub Settings → Secrets and variables → Actions:

- `VPS_HOST` - Your VPS IP or domain (e.g., `123.45.67.89`)
- `VPS_USERNAME` - SSH username (e.g., `ubuntu` or your username)
- `VPS_SSH_KEY` - Your private SSH key (the full content of `~/.ssh/id_rsa`)
- `DOMAIN` - Your domain name (e.g., `faces.example.com`) - used in nginx config template

## Local Development

```bash
# Simple development mode (no Docker)
npm run dev

# Or with Docker
docker compose up

# Rebuild after changes
docker compose up --build

# View logs
docker compose logs -f

# Stop services
docker compose down
```

Access at: http://localhost:8080

## Production Deployment

### Automatic (via GitHub Actions) - RECOMMENDED
Push to `master` branch or manually trigger the workflow:
```bash
git push origin master
```

GitHub Actions will automatically:
1. SSH into your VPS
2. Pull latest code
3. Update nginx configuration (from template with your domain)
4. Build Docker images
5. Deploy containers
6. Clean up old images

### Manual Deployment on VPS
```bash
cd /opt/faces
git pull origin master
docker compose down
docker compose up -d --build
```

## Architecture

- **Client Container**: Nginx serving React app on port 8080
  - Built static files served by nginx
  - API requests proxied to server container

- **Server Container**: Node.js Express API on port 3000
  - Generates face images using canvas

- **VPS Nginx**: Reverse proxy on port 80/443
  - Routes your domain → Client container (port 8080)
  - Routes `/api/*` → Server container (port 3000)
  - Handles SSL/TLS termination
  - Config is auto-synced from `nginx-vps.conf` template on each deployment

## Monitoring

### Check service health:
```bash
docker compose ps
docker compose logs -f client
docker compose logs -f server
```

### Check nginx status:
```bash
sudo systemctl status nginx
sudo nginx -t
```

### View nginx logs:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Containers won't start:
```bash
docker compose down
docker compose up --build
docker compose logs
```

### Nginx issues:
```bash
# Check nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Check if port 80/443 are in use
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### SSL certificate issues:
```bash
# Renew certificate manually
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates
```

### Can't connect to containers:
```bash
# Check if containers are running
docker compose ps

# Check Docker network
docker network ls
docker network inspect faces_default
```

## Security Notes

- ✅ Non-root containers
- ✅ Security headers enabled
- ✅ Health checks configured
- ✅ SSL/TLS with Let's Encrypt
- ⚠️ Configure firewall rules:
  ```bash
  sudo ufw allow 22/tcp   # SSH
  sudo ufw allow 80/tcp   # HTTP
  sudo ufw allow 443/tcp  # HTTPS
  sudo ufw enable
  ```

## Updating

To update the application:
1. Push changes to master branch → GitHub Actions deploys automatically
2. Or manually: `cd /opt/faces && git pull && docker compose up -d --build`

## Cleanup

Remove old Docker images to free space:
```bash
docker image prune -af
docker system prune -af
```
