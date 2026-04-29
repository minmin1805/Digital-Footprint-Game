/** Digital Footprint Detective — allowed telemetry event types and metadata keys (allowlist-only). */

export const GAME_ID = 'digital-footprint-detective'

/** @type {Record<string, string[]>} */
export const METADATA_KEYS_BY_EVENT = {
  welcome_submitted: [],

  instructions_viewed: [],

  game_session_start: [],

  post_turn_start: ['postIndex', 'postId', 'postType'],

  unsafe_zone_correct: ['postId', 'category'],

  incorrect_zone_click: ['postId'],

  wrong_heart_on_unsafe: ['postId'],

  safe_like_correct: ['postId'],

  safe_image_click: ['postId', 'clickCount'],

  safe_feedback_opened: ['postId', 'fromBruteForce'],

  timer_expired: ['postId', 'postType'],

  unsafe_feedback_continue: ['postId'],

  safe_feedback_continue: ['postId', 'fromBruteForce'],

  rules_modal_open: [],

  session_completed: [
    'score',
    'categoriesDistinct',
    'safepostDetected',
    'safepostTotal',
    'durationPlayingSec',
    'totalPostsInGame',
    'wonAllCategories',
  ],
}

export const ALLOWED_EVENT_TYPES = Object.keys(METADATA_KEYS_BY_EVENT)

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function stripMetadata(eventType, raw) {
  if (raw === undefined || raw === null) return {}
  if (typeof raw !== 'object' || Array.isArray(raw)) throw new Error('metadata must be a plain object')
  const keys = METADATA_KEYS_BY_EVENT[eventType]
  if (!keys) throw new Error(`unknown eventType: ${eventType}`)
  /** @type {Record<string, unknown>} */
  const out = {}
  for (const k of keys) {
    if (!(k in raw)) continue
    const v = raw[k]
    if (v === undefined) continue
    if (typeof v === 'object' && v !== null) continue
    out[k] = v
  }
  return out
}

/**
 * Validates and normalizes one event payload (throws on invalid input).
 * @param {object} raw
 */
export function normalizeTelemetryEvent(raw) {
  const eventId =
    typeof raw.eventId === 'string' ? raw.eventId.trim() : ''
  if (!UUID_RE.test(eventId)) throw new Error('eventId must be a UUID')

  let ts
  if (raw.timestamp == null) {
    ts = new Date()
  } else if (typeof raw.timestamp === 'string') {
    ts = new Date(raw.timestamp)
  } else if (raw.timestamp instanceof Date) {
    ts = raw.timestamp
  } else throw new Error('timestamp invalid')
  if (Number.isNaN(ts.getTime())) throw new Error('timestamp invalid')

  const gameId = typeof raw.gameId === 'string' ? raw.gameId.trim() : ''
  if (!gameId) throw new Error('gameId required')

  const sessionId =
    typeof raw.sessionId === 'string' ? raw.sessionId.trim() : ''
  if (!sessionId || sessionId.length > 128) throw new Error('sessionId invalid')

  const eventType =
    typeof raw.eventType === 'string' ? raw.eventType.trim() : ''
  if (!ALLOWED_EVENT_TYPES.includes(eventType)) {
    throw new Error(`eventType not allowed: ${eventType}`)
  }

  const stepId =
    raw.stepId === undefined || raw.stepId === null
      ? undefined
      : String(raw.stepId).slice(0, 128)
  let stepNumber
  if (raw.stepNumber !== undefined && raw.stepNumber !== null) {
    const n = Number(raw.stepNumber)
    if (!Number.isFinite(n)) throw new Error('stepNumber invalid')
    stepNumber = Math.floor(n)
  }

  const environment =
    raw.environment === 'production' ||
    raw.environment === 'development'
      ? raw.environment
      : 'development'

  const source =
    typeof raw.source === 'string' ? raw.source.slice(0, 64) : 'web'

  const clientVersion =
    typeof raw.clientVersion === 'string'
      ? raw.clientVersion.slice(0, 32)
      : undefined

  /** @type {string | undefined} */
  let playerId
  if (raw.playerId !== undefined && raw.playerId !== null && raw.playerId !== '') {
    const s = String(raw.playerId).trim()
    if (s.length > 512) throw new Error('playerId invalid')
    playerId = s
  }

  const metadata = stripMetadata(eventType, raw.metadata)

  return {
    eventId,
    timestamp: ts,
    gameId,
    sessionId,
    playerId,
    eventType,
    stepId,
    stepNumber,
    metadata,
    source,
    environment,
    clientVersion,
  }
}
