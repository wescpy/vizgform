import { Router, Request } from 'express'
import { verifyAccessToken, getGoogleClientId } from '../services/google-auth'
import { listSpreadsheets } from '../services/google-drive'
import { getSheetData, getSheetMetadata } from '../services/google-sheets'

const router = Router()

interface AuthenticatedRequest extends Request {
  body: {
    accessToken: string
    range?: string
  }
}

router.get('/config', (req, res) => {
  try {
    const clientId = getGoogleClientId()
    res.json({ clientId })
  } catch (error: any) {
    console.error('Error getting client config:', error)
    res.status(500).json({ error: error.message || 'Failed to get client configuration' })
  }
})

router.post('/spreadsheets', async (req: AuthenticatedRequest, res) => {
  try {
    const { accessToken } = req.body
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' })
    }
    
    const auth = await verifyAccessToken(accessToken)
    const spreadsheets = await listSpreadsheets(auth)
    
    res.json({ spreadsheets })
  } catch (error: any) {
    console.error('Error listing spreadsheets:', error)
    const statusCode = error.message?.includes('Invalid access token') || error.message?.includes('No access token') ? 401 : 500
    res.status(statusCode).json({ error: error.message || 'Failed to list spreadsheets' })
  }
})

router.post('/sheets/:fileId/data', async (req: AuthenticatedRequest, res) => {
  try {
    const { fileId } = req.params
    const { accessToken, range } = req.body
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' })
    }
    
    const auth = await verifyAccessToken(accessToken)
    const data = await getSheetData(auth, fileId, range)
    
    res.json({ data })
  } catch (error: any) {
    console.error('Error getting sheet data:', error)
    const statusCode = error.message?.includes('Invalid access token') || error.message?.includes('No access token') ? 401 : 500
    res.status(statusCode).json({ error: error.message || 'Failed to get sheet data' })
  }
})

router.post('/sheets/:fileId/metadata', async (req: AuthenticatedRequest, res) => {
  try {
    const { fileId } = req.params
    const { accessToken } = req.body
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' })
    }
    
    const auth = await verifyAccessToken(accessToken)
    const metadata = await getSheetMetadata(auth, fileId)
    
    res.json({ metadata })
  } catch (error: any) {
    console.error('Error getting sheet metadata:', error)
    const statusCode = error.message?.includes('Invalid access token') || error.message?.includes('No access token') ? 401 : 500
    res.status(statusCode).json({ error: error.message || 'Failed to get sheet metadata' })
  }
})


export default router