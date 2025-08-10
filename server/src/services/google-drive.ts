import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

export interface DriveFile {
  id: string
  name: string
  modifiedTime: string
  webViewLink: string
}

export async function listSpreadsheets(auth: OAuth2Client): Promise<DriveFile[]> {
  const drive = google.drive({ version: 'v3', auth })
  
  try {
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
      fields: 'files(id,name,modifiedTime,webViewLink)',
      orderBy: 'modifiedTime desc'
    })
    
    return response.data.files as DriveFile[] || []
  } catch (error: any) {
    console.error('Error listing spreadsheets:', error)
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown Google Drive API error'
    throw new Error(`Google Drive API failed: ${errorMessage}`)
  }
}