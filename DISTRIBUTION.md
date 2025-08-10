# Distribution Guide

## Quick Distribution (Docker - Recommended)

The easiest way to share this app:

```bash
# 1. Ensure client_secret.json is in the project root
# 2. Build the Docker image
docker build -t sheets-viewer .

# 3. Save image to file
docker save -o sheets-viewer.tar sheets-viewer

# 4. Share the .tar file with colleague
# They can load it with:
docker load -i sheets-viewer.tar
docker run -p 3001:3001 sheets-viewer
```

**Important**: The Docker image will include your OAuth credentials, so only share with trusted colleagues.

## What Your Colleague Needs

### Required Setup:
1. **Docker installed** (easiest option)
2. **Google Cloud Console access** to create OAuth credentials
3. **client_secret.json file** from Google Cloud Console

### Google Cloud Setup (they must do this):
1. Create Google Cloud project
2. Enable Google Drive API + Google Sheets API  
3. Create OAuth 2.0 credentials
4. Add authorized origins: `http://localhost:3000` and `http://localhost:3001`
5. **Download the credentials JSON file** from Google Cloud Console
6. Rename it to `client_secret.json` and place in the project root directory

### No Environment Configuration Needed!
The app automatically reads credentials from the `client_secret.json` file - no `.env` files required.

## Alternative Distribution Methods

### Method 1: GitHub Private Repo
- Most collaborative approach
- Colleague can get updates easily
- Requires GitHub account

### Method 2: ZIP/TAR Archive
```bash
tar -czf sheets-viewer.tar.gz --exclude=node_modules --exclude=.git .
```
- Colleague runs: `npm run install-all && npm run dev`

### Method 3: Cloud Deployment
Deploy to Vercel/Railway/Render and share the URL.

## Security Notes

⚠️ **Never share**:
- Your `client_secret.json` file
- Your OAuth tokens
- Any personal credentials

✅ **Safe to share**:
- Source code (excluding client_secret.json)
- Docker image (without secrets)
- Setup instructions