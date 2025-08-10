# Google Sheets Viewer

A modern web application that provides a user-friendly interface for viewing Google Sheets data. Built with Vue.js frontend and Node.js backend.

## Features

- 🔐 OAuth authentication with Google
- 📊 Browse all Google Sheets in your Drive
- 👁️ View spreadsheet data in a human-readable format
- 🎨 Modern, responsive UI design
- 📱 Mobile-friendly interface

## Setup Instructions

### Prerequisites

1. Node.js (v18 or higher)
2. Google Cloud Project with APIs enabled
3. Google OAuth credentials

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Drive API
   - Google Sheets API
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: Web application
   - Authorized origins: `http://localhost:3000` and `http://localhost:3001`
   - Authorized redirect URIs: `http://localhost:3001/auth/callback`
5. Download the credentials file:
   - Click the download button next to your OAuth 2.0 client
   - This downloads a JSON file (usually named like `client_secret_xyz.json`)

### Installation

1. Install dependencies:
```bash
npm run install-all
```

2. Set up Google credentials:
   - Rename the downloaded credentials file to `client_secret.json`
   - Move it to the root directory of this project (same level as package.json)

**No .env files needed!** The app automatically reads credentials from `client_secret.json`.

### Running the Application

Start both frontend and backend:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Usage

1. Open the application in your browser
2. Click "Sign in with Google" to authenticate
3. Grant permissions to access your Google Drive and Sheets
4. Browse your available spreadsheets
5. Click on any spreadsheet to view its data in a formatted layout

## Architecture

### Frontend (Vue.js)
- **Vue 3** with Composition API and TypeScript
- **Vue Router** for navigation
- **Google APIs** integration for authentication and data access
- Responsive design with modern CSS

### Backend (Node.js)
- **Express.js** server with TypeScript
- **Google APIs Node.js client library** for server-side API calls
- **CORS** enabled for cross-origin requests
- Secure token verification and API proxying

## Security Notes

- Uses OAuth 2.0 for secure authentication
- Server-side API calls with secure token verification
- No API keys required on the frontend
- Client secrets are kept secure on the server
- All API calls use user's own Google account permissions

## Distribution Options

### Option 1: Docker (Recommended)
```bash
# Build image
docker build -t sheets-viewer .

# Run container
docker run -p 3001:3001 sheets-viewer
```

### Option 2: GitHub Repository
1. Create a private GitHub repository
2. Share repository access with colleagues
3. Include complete setup instructions in README

### Option 3: ZIP Archive
```bash
# Create distributable package (excludes node_modules)
tar -czf sheets-viewer.tar.gz --exclude=node_modules --exclude=.git .
```

### Option 4: Cloud Deployment
- **Vercel/Netlify**: Frontend deployment with serverless functions
- **Railway/Render**: Full-stack deployment
- **Self-hosted**: VPS with Docker or PM2

## File Structure

```
├── client/                 # Vue.js frontend
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── services/       # API services
│   │   └── ...
├── server/                 # Node.js backend
│   ├── src/
│   │   └── index.ts        # Server entry point
├── Dockerfile             # Docker configuration
└── package.json           # Root package.json
```