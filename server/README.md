# Server (Backend)

Node.js + Express API for generating face images using Canvas.

## Development

From project root:
```bash
npm run dev
```
This starts the server at http://localhost:3000

Or from the server directory:
```bash
npm install
npm start
```

## API Endpoints

- `GET /face/:name` - Generate a random face based on the provided name (used as seed)
- `GET /face/health` - Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment (development/production)

## Production

Deployed via Docker. See [../DEPLOYMENT.md](../DEPLOYMENT.md) for details.

The server is containerized with all necessary canvas dependencies pre-installed.

## Local Development Notes

Binary dependencies for canvas library on macOS:
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

On Linux/Docker, these are installed automatically via the Dockerfile.