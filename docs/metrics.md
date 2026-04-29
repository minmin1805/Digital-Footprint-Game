# Digital Footprint Detective — metric dictionary & resume policy

**Game ID (telemetry):** `digital-footprint-detective`

This document locks **definitions**, **sources**, **caveats**, and **resume claim policy** so analytics are auditable and reproducible.

---

## Core gameplay loop (for analysts)

1. Player enters **name** on Welcome → backend creates **Player** with `sessionId`.
2. Player reads **Instructions** → navigates to **Game**.
3. **Countdown** (3s) → animated **feed scroll** places each **post** in view; **15s timer** per post.
4. **Unsafe posts** — Tap the **correct image/caption hotspot** covering a modeled risk → **Unsafe** modal with education.
5. **Safe posts** — Tap **like (heart)** to mark safe; taps on the image imply “looks unsafe” (tooltip; 3 taps force safe modal without counting as proper “detected”).
6. **Wrong taps** — Non-risk image areas show a tooltip; **like on unsafe** shakes + buzzer.
7. **Timer expiry** — If unresolved, autoplay shows Unsafe or Safe modal feedback.
8. **Win condition** — At least **one find** per **five risk categories**. Then **completion popup** → optional checklist PDF download → exit saves PATCH to Player.

---

## Adoption & funnel KPIs

### starts (welcome / registration telemetry)

**Operational definition:** Distinct **`sessionId`** with **`welcome_submitted`** (emitted once after `POST /api/players` succeeds). This avoids counting abandoned DB-only rows until the flow is exercised.

**Filter:** Same `environment` slice as reporting (`all` \| `production` \| `development`).

**Note:** Adoption can also cross-check **Player documents** (`POST /players` count) separately; treat as a secondary measure if DB creation is audited.

---

### funnel_reached_instructions

**Definition:** Distinct `sessionId` with **`instructions_viewed`** (Mount of instructions page; client-side once per visit).

**Purpose:** Adoption — made it past name entry.

---

### funnel_reached_game

**Definition:** Distinct `sessionId` with **`game_session_start`** — emitted when the **3s countdown** finishes and the feed timer can begin.

---

### completes (`session_completed`)

**Definition:** Distinct `sessionId` with **`session_completed`** (`metadata.completionStage = final_exit` optional).

Denominator varies by KPI.

---

### completion_rate

**Formula:**  
`distinct session_completed / distinct funnel_reached_game` — same cohort & date window.

**Caveat:** If **`game_session_start`** is blocked by ad blocker, numerator/denominator both drop → rate may drift.

---

## Engagement KPIs

### avg_session_duration_sec

**Definition:** Mean of **`session_completed.metadata.durationPlayingSec`** (or `game_session_start` timestamp → **`session_completed` timestamp**) for completed sessions only.

---

### avg_posts_reached (`max_steps`)

**Computed from events:** Among completed sessions, mean of **(max `post_turn_start.metadata.postIndex`)+1**, or analogous max post ordinal from **`post_turn_start`**.

**Interpretation:** How far players get into the fixed feed (**20 posts** in the current JSON pack).

---

## Game-specific learning & performance KPIs (DFD-mechanism specific)

### 1) category_discovery_rate (“found all five categories once”)

**Definition:** Share of **`session_completed`** where **`metadata.categoriesDistinct >= 5`**.

Alternatively: **`session_completed.metadata.won`** boolean if we add.

**Numerator:** completed sessions reaching 5 categories.  
**Denominator:** completed sessions (or **`session_completed`** only).

Resume claim: **“\<X%\> of completions identified at least one risk in each of 5 curriculum categories”.**

---

### 2) safe_post_like_accuracy

**Definition:** Among completed sessions, **`safepostDetected / safepostTotal`** aggregated **mean**, or pooled ratio.

Safepost is counted **only via correct heart taps** (`session_completed.metadata` mirrors Player PATCH).

**Caveat:** Does not credit brute-force (3 taps) paths as “detected”.

---

### 3) unsafe_zone_hit_rate (`learning_signal`)

**Formula:** **`unsafe_zone_correct` events / (`unsafe_zone_correct` + `timer_expired` on unsafe + wrong-heart noise?)**  

**Tighter operational definition:**

- Per session unsafe posts resolved by **correct hotspot before timer ends**: infer from **`unsafe_zone_correct`** count vs count of **`post_turn_start`** where `postType=danger`.

Simpler for v1 scripting:

```
avg(unsafe_zone_correct per session among sessions with any danger_post events)
```
Document as **“A/B learning signal”**.

---

### 4) brute_force_safe_rate (“mis-teaching friction”)

**Definition:** Share of **`safe_feedback_from_image_spam`** (or **`safe_post_modal_open`** with **`metadata.fromBruteForce = true`**).

Track via **`safe_feedback_opened`** `{ fromBruteForce: boolean }` (modal shown after heart vs after 3 mistaken image taps).

**Resume:** **“Tracked distinction between pedagogically correct hearts vs exploratory taps that force the modal.”**

---

### 5) engagement_with_instruction_modal

Distinct sessions with **`rules_modal_open`** (player opened **pause / review rules** from `MessageBar` during play).

---

### Drop-off by step

**Operational steps** (indexed **0=nothing** …):

| step | Event(s) |
|------|-----------|
| 0 | `welcome_submitted` |
| 1 | `instructions_viewed` |
| 2 | `game_session_start` |
| per post | `post_turn_start` (metadata `postIndex`) |
| FIN | `session_completed` |

**Drop-off funnel query:** cohort size at step `n` − cohort at `n+1`.

---

## Resume claim policy

1. **Only publish metrics** grounded in **`docs/metrics.md`** formulae verified by **`scripts/metrics/generateDigitalFootprintMetrics.js`** outputs.
2. Use **confidence caveats**: sample sizes \<30 → label “pilot”; avoid precise decimals.
3. **Never** cite raw names or captions from learner content — Player name is pseudonym-ish; omit from public charts.
4. **Retention suggestion:** Rotate or aggregate **`events`** >12 months depending on institutional policy — **not enforced in code.**

---

## Event-to-KPI mapping (implementation truth)

Primary store: **`events`** collection (append + idempotent **`eventId` upserts** via `POST /api/telemetry/events`).

Summary store optional: **`game_sessions`** (updated on **`game_session_start`**, **`post_turn_start`**, **`session_completed`**) for rollups.

---

## Implemented event types (allowlisted)

| `eventType` | When emitted |
|-------------|----------------|
| `welcome_submitted` | After successful player create on Welcome |
| `instructions_viewed` | Instructions page mount (once) |
| `game_session_start` | Countdown finishes on Game page |
| `post_turn_start` | Each post index becomes active (after play starts) |
| `unsafe_zone_correct` | Correct hotspot on an unsafe post |
| `incorrect_zone_click` | Wrong image/caption zone on unsafe post |
| `wrong_heart_on_unsafe` | Heart tap on unsafe post |
| `safe_like_correct` | Heart tap on safe post (correct action) |
| `safe_image_click` | Image tap on safe post (metadata `clickCount`) |
| `safe_feedback_opened` | Safe feedback modal shown (`fromBruteForce`) |
| `timer_expired` | 15s timer ends (`postType` danger/safe) |
| `unsafe_feedback_continue` | Player continues from unsafe feedback |
| `safe_feedback_continue` | Player continues from safe feedback |
| `rules_modal_open` | Pause / rules modal from MessageBar |
| `session_completed` | Win / end popup shown (metadata mirrors KPI fields) |

---

## Monthly reporting (reproducible)

From the repository root (requires `MONGO_URI` in `.env`):

```bash
npm run metrics:dfd -- --gameId=digital-footprint-detective --from=2026-04-01 --to=2026-05-01 --env=all
```

Output: `reports/YYYY-MM/digital-footprint-detective-metrics.json` (month folder from `--from`).

**Flags:** `--env=all|production|development` filters client-reported `environment` on each event.

---

## Resume bullet templates (fill from JSON)

1. Shipped end-to-end analytics for a privacy-literacy game: tracked **{{completion_rate}}** session completion (game start → end screen) over **{{n_sessions}}** starts in **{{month}}** ({{env_scope}}).
2. Measured learning signal on unsafe posts: **{{unsafe_zone_hit_rate}}** of timer-expired unsafe turns were preceded by a correct hotspot find (aggregated from `unsafe_zone_correct` vs `timer_expired` danger).
3. Quantified “safe post” detection: mean **{{safe_detect_ratio}}** of safe posts correctly marked via heart among completed sessions (excludes brute-force modal path per design).
4. Instrumented engagement with instructor content: **{{rules_modal_sessions}}** distinct sessions opened the in-game rules modal while playing.
5. Reported funnel retention: **{{retention_instructions}}** of registered sessions opened instructions; **{{retention_game}}** started the timed feed; documented in `docs/metrics.md` for auditability.
