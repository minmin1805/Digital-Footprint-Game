#!/usr/bin/env node
/**
 * Monthly metrics for Digital Footprint Detective (telemetry `events` collection).
 * Uses the same KPI definitions as docs/metrics.md.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import mongoose from 'mongoose'
import dotenv from 'dotenv'

import Event from '../../backend/models/Event.js'
import { GAME_ID } from '../../backend/telemetry/eventSchema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(__dirname, '../..')

dotenv.config({ path: path.join(PROJECT_ROOT, '.env') })

function parseArgs(argv) {
  const out = { gameId: GAME_ID, from: null, to: null, env: 'all' }
  for (const a of argv) {
    if (a.startsWith('--gameId=')) out.gameId = a.slice('--gameId='.length).trim()
    else if (a.startsWith('--from='))
      out.from = new Date(a.slice('--from='.length).trim())
    else if (a.startsWith('--to='))
      out.to = new Date(a.slice('--to='.length).trim())
    else if (a.startsWith('--env=')) {
      const v = a.slice('--env='.length).trim().toLowerCase()
      if (v !== 'all' && v !== 'production' && v !== 'development') {
        throw new Error('--env must be all|production|development')
      }
      out.env = v
    }
  }
  if (!(out.from instanceof Date) || Number.isNaN(out.from.getTime())) {
    throw new Error('--from=YYYY-MM-DD (ISO date) required')
  }
  if (!(out.to instanceof Date) || Number.isNaN(out.to.getTime())) {
    throw new Error('--to=YYYY-MM-DD required (exclusive upper bound)')
  }
  return out
}

function distinct(set) {
  return set.size
}

function mean(nums) {
  if (!nums.length) return null
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function yyyyMm(d) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

async function main() {
  const { gameId, from, to, env } = parseArgs(process.argv.slice(2))

  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI not set (see .env)')

  await mongoose.connect(uri)

  const envQuery =
    env === 'all' ? {} : env === 'production' ? { environment: 'production' } : { environment: 'development' }

  /** @type {import('mongoose').FilterQuery<any>} */
  const base = {
    gameId,
    timestamp: { $gte: from, $lt: to },
    ...envQuery,
  }

  const docs = await Event.find(base).select('sessionId eventType timestamp metadata').lean()

  /** @type {Set<string>} */
  const sessionsAny = new Set()
  /** @type {Record<string, Set<string>>} */
  const byType = {}
  const pushType = (t, sid) => {
    sessionsAny.add(sid)
    if (!byType[t]) byType[t] = new Set()
    byType[t].add(sid)
  }

  /** @type {Map<string, { maxPostIndex?: number }>} */
  const perSessionMeta = new Map()

  for (const e of docs) {
    const sid = e.sessionId
    if (!sid) continue
    pushType(e.eventType, sid)
    if (e.eventType === 'post_turn_start') {
      const ix = e.metadata?.postIndex ?? e.stepNumber
      if (typeof ix === 'number' && Number.isFinite(ix)) {
        let row = perSessionMeta.get(sid)
        if (!row) {
          row = {}
          perSessionMeta.set(sid, row)
        }
        row.maxPostIndex = Math.max(row.maxPostIndex ?? -1, ix)
      }
    }
  }

  const welcomeSubmitted = new Set(byType.welcome_submitted ?? [])
  const instructionsViewed = new Set(byType.instructions_viewed ?? [])
  const gameStarts = new Set(byType.game_session_start ?? [])
  const completions = new Set(byType.session_completed ?? [])

  const completedMeta = docs.filter((d) => d.eventType === 'session_completed')
  const durationSamples = []
  const safeAccuracySamples = []

  let safeOpened = 0
  let bruteOpen = 0
  let unsafeZoneHits = 0
  let unsafeTimerSignals = 0
  const distinctSessionsOpenedRulesModal = distinct(new Set(byType.rules_modal_open ?? []))

  for (const d of docs) {
    if (d.eventType === 'timer_expired' && d.metadata?.postType === 'danger') unsafeTimerSignals += 1
    if (d.eventType === 'unsafe_zone_correct') unsafeZoneHits += 1
    if (d.eventType === 'safe_feedback_opened') {
      safeOpened += 1
      if (d.metadata?.fromBruteForce === true) bruteOpen += 1
    }
  }

  for (const d of completedMeta) {
    const m = d.metadata || {}
    if (typeof m.durationPlayingSec === 'number') durationSamples.push(m.durationPlayingSec)
    if (
      typeof m.safepostDetected === 'number' &&
      typeof m.safepostTotal === 'number' &&
      m.safepostTotal > 0
    ) {
      safeAccuracySamples.push(m.safepostDetected / m.safepostTotal)
    }
  }

  const fiveCategoryCompleters = completedMeta.filter(
    (d) => (d.metadata?.categoriesDistinct ?? 0) >= 5 || d.metadata?.wonAllCategories === true
  ).length

  /** @type {number[]} */
  const maxPostsArr = []
  for (const sid of completions) {
    const mx = perSessionMeta.get(sid)?.maxPostIndex
    if (typeof mx === 'number') maxPostsArr.push(mx + 1)
  }

  const completionRateDenominator = distinct(gameStarts)
  const completionRateNumerator = distinct(completions)
  const completionRate =
    completionRateDenominator > 0
      ? completionRateNumerator / completionRateDenominator
      : null

  const bruteShareAmongSafeOpens = safeOpened ? bruteOpen / safeOpened : null

  const unsafeResolvedSignalDen =
    unsafeZoneHits + unsafeTimerSignals === 0 ? null : unsafeZoneHits + unsafeTimerSignals
  const unsafeZoneHitLearningSignal =
    unsafeResolvedSignalDen !== null ? unsafeZoneHits / unsafeResolvedSignalDen : null

  const intersectCount = (a, b) => [...a].filter((x) => b.has(x)).length

  const nWelcome = distinct(welcomeSubmitted)
  const nInstr = intersectCount(instructionsViewed, welcomeSubmitted)
  const nGameFromInstr = intersectCount(gameStarts, instructionsViewed)
  const nCompleteFromGame = intersectCount(completions, gameStarts)

  const funnelDropoffSteps = [
    {
      step: 'welcome_submitted',
      distinct_sessions: nWelcome,
    },
    {
      step: 'instructions_viewed',
      intersection_with_welcome_sessions: nInstr,
      retention_vs_welcome: nWelcome ? nInstr / nWelcome : null,
    },
    {
      step: 'game_session_start',
      intersection_with_instructions_sessions: nGameFromInstr,
      retention_vs_instructions_sessions: distinct(instructionsViewed)
        ? nGameFromInstr / distinct(instructionsViewed)
        : null,
    },
    {
      step: 'session_completed',
      intersection_with_game_session_start_sessions: nCompleteFromGame,
      retention_vs_game_sessions: distinct(gameStarts)
        ? nCompleteFromGame / distinct(gameStarts)
        : null,
    },
  ]

  const report = {
    generatedAtUtc: new Date().toISOString(),
    inputs: {
      gameId,
      fromExclusive: false,
      from: from.toISOString(),
      toExclusive: true,
      to: to.toISOString(),
      environmentScope: env,
      eventCountObserved: docs.length,
      distinctSessionsAnyEvent: distinct(sessionsAny),
    },
    kpis: {
      starts_welcome_submitted: distinct(welcomeSubmitted),
      funnel_instructions_viewed: distinct(instructionsViewed),
      funnel_game_session_start: distinct(gameStarts),
      completes_session_completed: distinct(completions),
      completion_rate_session_over_game_start:
        completionRate !== null ? Number(completionRate.toFixed(6)) : null,

      avg_session_duration_sec_completed_only_mean: durationSamples.length
        ? Number(mean(durationSamples).toFixed(3))
        : null,
      avg_max_post_turn_index_plus_one_among_completed_mean: maxPostsArr.length
        ? Number(mean(maxPostsArr).toFixed(3))
        : null,

      category_discovery_completion_share:
        completions.size > 0
          ? Number((fiveCategoryCompleters / completedMeta.length).toFixed(6))
          : null,

      avg_safe_detect_ratio_completed_sessions_mean: safeAccuracySamples.length
        ? Number(mean(safeAccuracySamples).toFixed(6))
        : null,

      unsafe_zone_hit_learning_signal_avg:
        unsafeZoneHitLearningSignal !== null
          ? Number(unsafeZoneHitLearningSignal.toFixed(6))
          : null,

      brute_force_safe_feedback_share_of_safe_opens:
        bruteShareAmongSafeOpens !== null
          ? Number(bruteShareAmongSafeOpens.toFixed(6))
          : null,

      rules_modal_opens_distinct_sessions: distinctSessionsOpenedRulesModal,
    },

    funnel_dropoff: funnelDropoffSteps,

    methodologyNotes:
      'category_discovery_completion_share numerator counts session_completed docs with categoriesDistinct≥5 among all session_completed in window; completion_rate denominates distinct game_session_start events.',
    privacy:
      'No free-text payloads are stored by design; reviewer should rotate events periodically per policy.',
  }

  const monthKey = yyyyMm(from)
  const reportsDir = path.join(PROJECT_ROOT, 'reports', monthKey)
  fs.mkdirSync(reportsDir, { recursive: true })
  const outPath = path.join(reportsDir, `${gameId}-metrics.json`)
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8')
  console.log(`Wrote ${outPath}`)

  console.log('\n--- Summary ---')
  console.log(JSON.stringify(report.kpis, null, 2))

  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
