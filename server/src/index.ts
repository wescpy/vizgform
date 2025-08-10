import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRoutes from './routes/api'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Google Sheets Viewer API is running' })
})

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})