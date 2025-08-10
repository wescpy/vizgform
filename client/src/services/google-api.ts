import axios from 'axios'
import { authState } from './auth'

export interface DriveFile {
  id: string
  name: string
  modifiedTime: string
  webViewLink: string
}

export interface SheetData {
  range: string
  majorDimension: string
  values: string[][]
}

const API_BASE_URL = '/api'

// Cache for spreadsheets with timestamp
let spreadsheetsCache: { data: DriveFile[]; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function listSpreadsheets(useCache = true): Promise<DriveFile[]> {
  try {
    if (!authState.accessToken) {
      throw new Error('No access token available')
    }

    // Check cache first (if not forced refresh)
    if (useCache && spreadsheetsCache) {
      const isExpired = Date.now() - spreadsheetsCache.timestamp > CACHE_DURATION
      if (!isExpired) {
        console.log('Returning cached spreadsheets')
        return spreadsheetsCache.data
      }
    }

    console.log('Fetching fresh spreadsheets from API')
    const response = await axios.post(`${API_BASE_URL}/spreadsheets`, {
      accessToken: authState.accessToken
    })
    
    const spreadsheets = response.data.spreadsheets || []
    
    // Update cache
    spreadsheetsCache = {
      data: spreadsheets,
      timestamp: Date.now()
    }
    
    return spreadsheets
  } catch (error: any) {
    console.error('Error listing spreadsheets:', error)
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed - please sign in again')
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function getSheetData(fileId: string, range: string = 'A1:Z1000'): Promise<SheetData> {
  try {
    if (!authState.accessToken) {
      throw new Error('No access token available')
    }

    const response = await axios.post(`${API_BASE_URL}/sheets/${fileId}/data`, {
      accessToken: authState.accessToken,
      range: range
    })
    
    return response.data.data
  } catch (error: any) {
    console.error('Error getting sheet data:', error)
    if (error.response?.status === 401) {
      throw new Error('Authentication failed - please sign in again')
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function getSheetMetadata(fileId: string) {
  try {
    if (!authState.accessToken) {
      throw new Error('No access token available')
    }

    const response = await axios.post(`${API_BASE_URL}/sheets/${fileId}/metadata`, {
      accessToken: authState.accessToken
    })
    
    return response.data.metadata
  } catch (error: any) {
    console.error('Error getting sheet metadata:', error)
    if (error.response?.status === 401) {
      throw new Error('Authentication failed - please sign in again')
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}