import mongoose from 'mongoose'

/**
 * Lightweight session rollup for dashboards (derived from telemetry; Events remain source of truth).
 */
const gameSessionSchema = new mongoose.Schema(
  {
    /** Same as TelemetryEvent.gameId */
    gameId: { type: String, required: true, index: true },

    /** Client session UUID (Welcome → Game); unique together with gameId. */
    sessionId: { type: String, required: true, index: true },

    playerId: { type: String, default: undefined, index: true },

    environment: {
      type: String,
      enum: ['production', 'development'],
      default: 'development',
    },

    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },

    /** Max step index observed from post_turn_start (0-based). */
    maxPostTurnIndex: { type: Number, default: undefined },

    sessionCompletedAt: { type: Date, default: null },

    /** Snapshot from session_completed (optional). */
    lastCompletedMeta: {
      score: Number,
      categoriesDistinct: Number,
      safepostDetected: Number,
      safepostTotal: Number,
      durationPlayingSec: Number,
      totalPostsInGame: Number,
      wonAllCategories: Boolean,
    },
  },
  { timestamps: true, collection: 'game_sessions' }
)

gameSessionSchema.index({ gameId: 1, sessionId: 1 }, { unique: true })

gameSessionSchema.index({ gameId: 1, updatedAt: 1 })

const GameSession = mongoose.model('GameSession', gameSessionSchema)

export default GameSession
