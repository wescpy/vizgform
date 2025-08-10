import { OAuth2Client } from 'google-auth-library'
import * as fs from 'fs'
import * as path from 'path'

interface GoogleCredentials {
  web: {
    client_id: string
    client_secret: string
    redirect_uris: string[]
  }
}

function loadGoogleCredentials(): GoogleCredentials {
  const credentialsPath = path.join(__dirname, '../../../client_secret.json')
  
  try {
    const credentialsFile = fs.readFileSync(credentialsPath, 'utf8')
    return JSON.parse(credentialsFile)
  } catch (error) {
    throw new Error(`Failed to load client_secret.json from ${credentialsPath}. Please ensure the file exists and contains valid Google OAuth credentials.`)
  }
}

const credentials = loadGoogleCredentials()
const CLIENT_ID = credentials.web.client_id
const CLIENT_SECRET = credentials.web.client_secret
const REDIRECT_URI = credentials.web.redirect_uris[0]

export function createOAuth2Client() {
  return new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
}

export function getGoogleClientId(): string {
  return CLIENT_ID
}

export async function verifyAccessToken(accessToken: string): Promise<OAuth2Client> {
  if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
    throw new Error('No access token provided')
  }

  const oauth2Client = createOAuth2Client()
  oauth2Client.setCredentials({ access_token: accessToken })
  
  try {
    const tokenInfo = await oauth2Client.getTokenInfo(accessToken)
    return oauth2Client
  } catch (error) {
    console.error('Token verification failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Invalid access token: ${errorMessage}`)
  }
}