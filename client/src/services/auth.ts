const SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly'

let CLIENT_ID: string | null = null

declare global {
  interface Window {
    google: any
  }
}

let isGisLoaded = false
let tokenClient: any

export interface AuthState {
  isSignedIn: boolean
  accessToken: string | null
}

// Initialize auth state from localStorage if available
function initializeAuthState(): AuthState {
  try {
    const stored = localStorage.getItem('authState')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate that required fields exist
      if (parsed.accessToken && typeof parsed.isSignedIn === 'boolean') {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load auth state from localStorage:', error)
  }
  
  return {
    isSignedIn: false,
    accessToken: null
  }
}

export const authState: AuthState = initializeAuthState()

// Save auth state to localStorage whenever it changes
function saveAuthState() {
  try {
    localStorage.setItem('authState', JSON.stringify(authState))
  } catch (error) {
    console.warn('Failed to save auth state to localStorage:', error)
  }
}

async function fetchClientId(): Promise<string> {
  try {
    const response = await fetch('/api/config')
    if (!response.ok) {
      throw new Error(`Failed to fetch client configuration: ${response.statusText}`)
    }
    const config = await response.json()
    return config.clientId
  } catch (error) {
    throw new Error(`Failed to load Google client configuration: ${error}`)
  }
}

export async function loadGoogleAPIs(): Promise<void> {
  // First fetch the client ID from the server
  if (!CLIENT_ID) {
    CLIENT_ID = await fetchClientId()
  }

  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      isGisLoaded = true
      initializeGapi().then(resolve)
    }
    document.head.appendChild(script)
  })
}

async function initializeGapi() {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse: any) => {
      authState.accessToken = tokenResponse.access_token
      authState.isSignedIn = true
      saveAuthState()
    }
  })
}

export function signIn(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!tokenClient || !CLIENT_ID) {
      reject(new Error('Google APIs not loaded or client ID not available'))
      return
    }

    const originalCallback = tokenClient.callback
    tokenClient.callback = (tokenResponse: any) => {
      if (tokenResponse.error) {
        reject(new Error(tokenResponse.error))
        return
      }
      originalCallback(tokenResponse)
      resolve()
    }

    tokenClient.requestAccessToken({ prompt: 'consent' })
  })
}

export function signOut() {
  if (authState.accessToken) {
    window.google.accounts.oauth2.revoke(authState.accessToken)
  }
  authState.isSignedIn = false
  authState.accessToken = null
  saveAuthState()
}