import mongoose from 'mongoose'
import Event from '../models/Event.js'
import GameSession from '../models/GameSession.js'
import Player from '../models/Player.js'
import { GAME_ID, normalizeTelemetryEvent } from '../telemetry/eventSchema.js'

async function upsertGameSession(norm) {
  const base = {
    gameId: norm.gameId,
    sessionId: norm.sessionId,
    environment: norm.environment,
  }

  if (norm.eventType === 'game_session_start') {
    await GameSession.findOneAndUpdate(
      { sessionId: norm.sessionId, gameId: norm.gameId },
      {
        $setOnInsert: { ...base, startedAt: norm.timestamp },
        $set: {
          playerId: norm.playerId ?? undefined,
          environment: norm.environment,
        },
      },
      { upsert: true }
    )
    return
  }

  if (norm.eventType === 'post_turn_start' && typeof norm.stepNumber === 'number') {
    await GameSession.findOneAndUpdate(
      { sessionId: norm.sessionId, gameId: norm.gameId },
      {
        $setOnInsert: { ...base, startedAt: null },
        $set: {
          playerId: norm.playerId ?? undefined,
          environment: norm.environment,
        },
        $max: { maxPostTurnIndex: norm.stepNumber },
      },
      { upsert: true }
    )
    return
  }

  if (norm.eventType === 'session_completed') {
    const m = norm.metadata || {}
    await GameSession.findOneAndUpdate(
      { sessionId: norm.sessionId, gameId: norm.gameId },
      {
        $setOnInsert: base,
        $set: {
          sessionCompletedAt: norm.timestamp,
          endedAt: norm.timestamp,
          playerId: norm.playerId ?? undefined,
          environment: norm.environment,
          lastCompletedMeta: {
            score: typeof m.score === 'number' ? m.score : undefined,
            categoriesDistinct:
              typeof m.categoriesDistinct === 'number' ? m.categoriesDistinct : undefined,
            safepostDetected:
              typeof m.safepostDetected === 'number' ? m.safepostDetected : undefined,
            safepostTotal:
              typeof m.safepostTotal === 'number' ? m.safepostTotal : undefined,
            durationPlayingSec:
              typeof m.durationPlayingSec === 'number' ? m.durationPlayingSec : undefined,
            totalPostsInGame:
              typeof m.totalPostsInGame === 'number' ? m.totalPostsInGame : undefined,
            wonAllCategories:
              typeof m.wonAllCategories === 'boolean' ? m.wonAllCategories : undefined,
          },
        },
      },
      { upsert: true }
    )

    if (norm.playerId && mongoose.Types.ObjectId.isValid(norm.playerId)) {
      const cats = typeof m.categoriesDistinct === 'number' ? m.categoriesDistinct : undefined
      const patch = {
        dfdLastSessionCompletedAt: norm.timestamp,
      }
      if (typeof cats === 'number') patch.dfdLastCategoriesDistinct = cats

      await Player.findByIdAndUpdate(norm.playerId, { $set: patch }).catch(() => {})
    }
    return
  }

  /* Other events (welcome_submitted, etc.) remain Events-only until a rollup-worthy milestone. */
}

async function persistEvent(norm) {
  await Event.findOneAndUpdate(
    { eventId: norm.eventId },
    {
      $set: {
        timestamp: norm.timestamp,
        gameId: norm.gameId,
        sessionId: norm.sessionId,
        playerId: norm.playerId,
        eventType: norm.eventType,
        stepId: norm.stepId,
        stepNumber: norm.stepNumber,
        metadata: norm.metadata ?? {},
        source: norm.source ?? 'web',
        environment: norm.environment ?? 'development',
        clientVersion: norm.clientVersion,
      },
    },
    { upsert: true, new: true }
  )

  await upsertGameSession(norm).catch(() => {})
}

/** POST body: { events: [...] } or single event flattened (wrapped). */
export const ingestTelemetryEvents = async (req, res) => {
  try {
    const rawPayload = req.body
    const batch = Array.isArray(rawPayload.events)
      ? rawPayload.events
      : rawPayload.events === undefined &&
          typeof rawPayload.eventType === 'string'
        ? [rawPayload]
        : null

    if (!batch?.length || batch.length > 200) {
      return res.status(400).json({ error: 'Provide "events" array (1–200 items)' })
    }

    const normalized = []
    for (let i = 0; i < batch.length; i++) {
      try {
        const n = normalizeTelemetryEvent(batch[i])
        // Server-side filter: enforce this repo’s single game unless internal tooling passes another ID later.
        if (n.gameId !== GAME_ID) {
          throw new Error(`unsupported gameId: ${n.gameId}`)
        }
        normalized.push(n)
      } catch (e) {
        return res.status(400).json({
          error: 'Validation failed',
          index: i,
          message: e instanceof Error ? e.message : String(e),
        })
      }
    }

    for (const n of normalized) {
      await persistEvent(n)
    }

    res.status(201).json({ ok: true, accepted: normalized.length })
  } catch (err) {
    console.error('telemetry ingest error:', err)
    res.status(500).json({ error: 'Failed to ingest events' })
  }
}
