import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

export interface SheetData {
  range: string
  majorDimension: string
  values: string[][]
}

export interface SheetMetadata {
  sheets: Array<{
    properties: {
      title: string
      sheetId: number
    }
  }>
}

export async function getSheetData(auth: OAuth2Client, fileId: string, range: string = 'A1:Z1000'): Promise<SheetData> {
  const sheets = google.sheets({ version: 'v4', auth })
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: fileId,
      range: range
    })
    
    return response.data as SheetData
  } catch (error) {
    console.error('Error getting sheet data:', error)
    throw new Error('Failed to get sheet data')
  }
}

export async function getSheetMetadata(auth: OAuth2Client, fileId: string): Promise<SheetMetadata> {
  const sheets = google.sheets({ version: 'v4', auth })
  
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: fileId,
      fields: 'sheets.properties'
    })
    
    return response.data as SheetMetadata
  } catch (error) {
    console.error('Error getting sheet metadata:', error)
    throw new Error('Failed to get sheet metadata')
  }
}