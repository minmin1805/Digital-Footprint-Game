import express from 'express'
import { ingestTelemetryEvents } from '../controllers/telemetryController.js'

const router = express.Router()

router.post('/events', ingestTelemetryEvents)

export default router
