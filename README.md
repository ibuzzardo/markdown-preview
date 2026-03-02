# VPS Command Center

A self-hosted web dashboard for monitoring and managing a Linux VPS. Shows real-time system metrics, PM2 processes, deployed projects, and provides management controls.

## Features

- **Real-time System Metrics**: CPU, memory, disk, network usage updated every 3 seconds
- **PM2 Process Manager**: View, start, stop, and restart PM2 processes
- **Project Scanner**: List deployed projects with git info and disk usage
- **API Key Authentication**: Secure access with configurable API key
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Professional dashboard aesthetic

## Requirements

- Node.js 18+
- PM2 (for process management features)
- Git (for project information)
- Linux/Unix system (for system metrics)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vps-command-center
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Build the application:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

The dashboard will be available at `http://localhost:4002`

## Environment Variables

- `PORT` - Server port (default: 4002)
- `API_KEY` - API key for authentication (optional, disables auth if not set)
- `NODE_ENV` - Node environment (development/production)

## Development

Run in development mode:
```bash
npm run dev
```

## Authentication

If `API_KEY` is set in environment variables:
- All pages require authentication
- Login at `/login` with the API key
- Session stored in secure httpOnly cookie

If `API_KEY` is not set:
- Authentication is disabled (development mode)
- All features accessible without login

## Project Structure

- `/` - Dashboard with system metrics
- `/processes` - PM2 process manager
- `/projects` - Deployed projects overview
- `/login` - Authentication page

## API Endpoints

- `GET /api/system` - System metrics
- `GET /api/pm2` - PM2 processes list
- `POST /api/pm2/:id/restart` - Restart process
- `POST /api/pm2/:id/stop` - Stop process
- `POST /api/pm2/:id/start` - Start process
- `GET /api/projects` - Deployed projects
- `POST /api/auth` - Authentication

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure a strong `API_KEY`
3. Use a process manager like PM2:

```bash
pm2 start npm --name "vps-center" -- start
```

## License

MIT License