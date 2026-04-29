import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },

    timestamp: { type: Date, required: true, index: true },
    gameId: { type: String, required: true, index: true },

    sessionId: { type: String, required: true, index: true },

    playerId: { type: String, index: true, default: undefined },

    eventType: { type: String, required: true, index: true },

    stepId: { type: String, default: undefined },
    stepNumber: { type: Number, default: undefined },

    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

    source: { type: String, default: 'web' },

    /** Client-reported deployment slice (distinct from NODE_ENV server-side). */
    environment: {
      type: String,
      enum: ['production', 'development'],
      default: 'development',
      index: true,
    },

    clientVersion: { type: String, default: undefined },
  },
  {
    timestamps: false,
    collection: 'events',
  }
)

// Game + funnel / drop-off timelines
eventSchema.index({ gameId: 1, eventType: 1, timestamp: 1 })

// Session timelines (replay, drop-off)
eventSchema.index({ sessionId: 1, timestamp: 1 })

// Step analytics (indexed turn + optional post/type)
eventSchema.index({ gameId: 1, sessionId: 1, stepNumber: 1, timestamp: 1 })

const Event = mongoose.model('Event', eventSchema)

export default Event
