import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import appRoutes from './routes/index.js'
import { PORT } from './utils/constant.js'

import './config/index.js'

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))

// ? Routes
app.use('/api/v1', appRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
