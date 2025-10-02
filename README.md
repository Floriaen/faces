# Faces App

Random face generator with colorization.

## Quick Start

### Local Development
```bash
npm run dev
```
This will start both the client (http://localhost:8080) and server (http://localhost:3000).

### Production Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete setup instructions.

**TL;DR:** Push to `master` branch and GitHub Actions automatically deploys to your VPS via Docker.

## Tech Stack
- **Frontend**: React + Webpack + Material-UI
- **Backend**: Node.js + Express + Canvas
- **Deployment**: Docker Compose + GitHub Actions + Nginx

## Architecture

```
User → VPS Nginx (SSL) → Client Container (nginx:80) → Server Container (node:3000)
                             ↓
                        Static React App
                             ↓
                        /api/* → Server
```

- Frontend served by nginx in Docker container on port 8080
- Backend API served by Node.js in Docker container on port 3000
- VPS nginx handles SSL termination and reverse proxy
- CI/CD via GitHub Actions on push to master