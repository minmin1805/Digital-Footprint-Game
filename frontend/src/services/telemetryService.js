/**
 * Digital Footprint Detective telemetry — batches to POST /api/telemetry/events.
 * Failures are swallowed so gameplay continues (server-side idempotency via eventId).
 */
import axios from 'axios'

export const GAME_ID = 'digital-footprint-detective'

function uuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function envLabel() {
  return import.meta.env.PROD ? 'production' : 'development'
}

/**
 * @param {{
 *   eventType: string
 *   sessionId: string | null | undefined
 *   playerId?: string | null
 *   metadata?: Record<string, unknown>
 *   stepNumber?: number
 *   stepId?: string
 * }} opts
 */
export function buildTelemetryEvent(opts) {
  const sessionId =
    opts.sessionId == null ? '' : String(opts.sessionId).trim()
  const eventId = uuid()
  return {
    eventId,
    timestamp: new Date().toISOString(),
    gameId: GAME_ID,
    sessionId,
    playerId: opts.playerId == null ? undefined : String(opts.playerId),
    eventType: opts.eventType,
    stepNumber: opts.stepNumber,
    stepId: opts.stepId,
    metadata: opts.metadata ?? {},
    source: 'web',
    environment: envLabel(),
    clientVersion:
      typeof import.meta.env?.VITE_APP_VERSION === 'string'
        ? import.meta.env.VITE_APP_VERSION
        : 'frontend',
  }
}

/** @param {ReturnType<typeof buildTelemetryEvent>[]} events */
async function sendTelemetryEvents(events) {
  if (!events.length) return
  try {
    await axios.post(
      '/api/telemetry/events',
      { events },
      { timeout: 8000 }
    )
  } catch (_) {
    /* deliberate no-op — analytics must not block UX */
  }
}

/**
 * @param {{
 *   eventType: string
 *   sessionId?: string | null
 *   playerId?: string | null
 *   metadata?: Record<string, unknown>
 *   stepNumber?: number
 *   stepId?: string
 * }} opts
 */
export function emitTelemetryEvent(opts) {
  if (!opts.sessionId) return
  const evt = buildTelemetryEvent({
    ...opts,
    sessionId: opts.sessionId,
  })
  return sendTelemetryEvents([evt])
}
