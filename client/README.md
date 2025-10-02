# Client (Frontend)

React application for the Faces generator.

## Development

From project root:
```bash
npm run dev
```
This starts the webpack dev server at http://localhost:8080

Or from the client directory:
```bash
npm install --legacy-peer-deps
npm start
```

## Commands

- `npm start` - start the webpack dev server (port 8080)
- `npm run build` - create a production ready build in `build/` folder
- `npm run lint` - execute an eslint check
- `npm run lint:fix` - execute an eslint and fix the errors

## Production

The client is built and deployed via Docker. See [../DEPLOYMENT.md](../DEPLOYMENT.md) for details.

In production:
- Built files are served by nginx
- API calls to `/api/*` are proxied to the server container
- Environment automatically set via `process.env.NODE_ENV`