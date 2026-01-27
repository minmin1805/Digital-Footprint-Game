# Digital Footprint Detective — Full Development Plan

**Version:** 1.0  
**Last updated:** Jan 2025  
**Stack:** Vite, React, Tailwind CSS, MongoDB (backend)

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Game flow](#2-game-flow)
3. [Screens & UI](#3-screens--ui)
4. [Technical architecture](#4-technical-architecture)
5. [Data structures](#5-data-structures)
6. [Click detection & coordinates](#6-click-detection--coordinates)
7. [Game logic](#7-game-logic)
8. [API & MongoDB](#8-api--mongodb)
9. [File & folder structure](#9-file--folder-structure)
10. [Build phases — step-by-step](#10-build-phases--step-by-step)
11. [Content checklist](#11-content-checklist)
12. [Decisions & open questions](#12-decisions--open-questions)

---

## 1. Project overview

### What we’re building

- **Name:** Digital Footprint Detective  
- **Type:** Web-based educational game  
- **Audience:** Ages 10–15  
- **Goal:** Teach teens to spot privacy risks in social-style posts (house numbers, school info, birthdates, license plates, etc.) and what’s safe to share.

### Core rules

- **20 posts** in a vertical, Instagram-style feed. **8** contain hidden privacy risks; **12** are safe.
- Player **clicks** on elements they think are risky.
- **Correct click** (danger zone): Pause → Unsafe popup → [Ok, Got it!] → Resume, increment progress (X/8).
- **Incorrect click** (safe area): No penalty. After **more than 3 clicks** on the **same** safe post → Safe popup → [Awesome!!] → Continue.
- **Win:** Find all 8 risks. No losing condition.
- **Progress:** X/8 counter, progress bar, optional star display (e.g. ⭐⭐⭐⭐⚪⚪⚪⚪).

### Tech stack

- **Frontend:** Vite, React, Tailwind CSS  
- **Data:** JSON for posts + educational content  
- **Backend:** Node/Express or Vercel serverless (TBD)  
- **Database:** MongoDB (player/session records, metrics)  
- **Assets:** Images in `src/assets/Images Folder/` (Safe + Unsafe)

---

## 2. Game flow

```
┌─────────────────────┐
│   WELCOME SCREEN    │
│  Logo + Name + Play │
└─────────┬───────────┘
          │ [Play] → POST /api/players (create in MongoDB)
          ▼
┌─────────────────────┐
│  INSTRUCTION PAGE   │
│  How to play, etc.  │
│  [Start Game]       │
└─────────┬───────────┘
          │ [Start Game]
          ▼
┌─────────────────────┐
│   MAIN GAME         │
│   Feed + 3s         │
│   countdown (dimmed)│
└─────────┬───────────┘
          │ At 0: dim off, scroll starts
          ▼
┌─────────────────────┐
│   GAMEPLAY          │
│   Scroll, click,    │
│   popups, X/8       │
└─────────┬───────────┘
          │ Find 8/8
          ▼
┌─────────────────────┐
│  COMPLETION POPUP   │
│  Summary +          │
│  [Checklist][Again] │
└─────────────────────┘
          │ PATCH /api/players/:id (score, time, etc.)
```

### Step-by-step user journey

1. **Welcome:** User sees logo, enters name, clicks [Play].  
   - App calls backend → create player/session in MongoDB.  
   - Navigate to Instruction page.

2. **Instructions:** User reads what the game is and how to play. Clicks [Start Game].  
   - Navigate to Main game view.

3. **Main game — countdown:** Feed is visible but **dimmed** (dark overlay). Big **3…2…1…0** countdown in center.  
   - At **0:** Remove overlay and countdown, **start** vertical scroll.

4. **Gameplay:**  
   - User scrolls through feed, clicks on posts.  
   - **Correct** (danger zone): Pause scroll → Unsafe popup → [Ok, Got it!] → Resume, increment X/8.  
   - **Incorrect** (safe post): No popup for first 3 clicks on that post. On **4th+** click on same safe post → Safe popup → [Awesome!!] → Continue.  
   - **RULES** button: (TBD — e.g. pause + show rules modal.)

5. **Completion:** When X = 8, pause → Completion popup with summary, [Download Safety Checklist], [Play Again].  
   - App calls backend → update player record (score, categories found, playing time).

6. **Play Again:** (TBD: back to Welcome vs Instructions vs restart game only.)

---

## 3. Screens & UI

### 3.1 Welcome screen

- **Layout:** Centered. Game logo (you provide) at top.  
- **Name input:** Single text field. Player enters name.  
- **Play button:** Submits name, triggers API create, then navigates to Instructions.  
- **Validation:** (TBD: required? min/max length? Guest allowed?)  
- **Design:** Simple, minimal. Design “as we go.”

### 3.2 Instruction page

- **Content:** What the game is; how to play (scroll, click, spot risks, X/8, safe vs unsafe).  
- **CTA:** [Start Game] → navigate to Main game.  
- **Design:** No mockup yet; design as we build.

### 3.3 Main game screen (from mockup)

- **Top:** Yellow banner — “Digital footprint Detective”, “Found X/8 unsafe posts”, progress bar, star.  
- **Below banner:** Horizontal “stories” row (e.g. jess, t_om, kindInd, mary_trg, vivet, jakesin_).  
- **Left sidebar:** Nav icons + labels (Home, Reels, Messages, Search, Explore, Create, Profile). Decorative unless specified.  
- **Center:** Vertical feed of post cards. Each card:  
  - Header: avatar + username (e.g. minmin)  
  - Image  
  - Actions: like, comment, share, bookmark  
  - Likes/comments count  
  - Caption (and optional tags)  
- **Right:** “Messages” strip (decorative) + “Pause and review game’s rule” / RULES button.  
- **Bottom:** “Next post will load from here” (scroll hint).  
- **Countdown:** Overlay + 3–2–1–0 centered; feed dimmed until 0.

### 3.4 Unsafe alert popup (from mockup)

- **Header:** Dark red/brown, warning icon, “Unsafe alert”.  
- **Body:**  
  - “POST X – [Title]”  
  - “Category: …”  
  - “What you found: …”  
  - “Why this is dangerous:” (bullets)  
  - “What to do instead:” (bullets)  
  - “Quick tip:” (single line)  
- **Button:** “Ok, Got it!” — close popup, resume game, increment X/8.

### 3.5 Safe post popup (from mockup)

- **Header:** Green, padlock icon, “Safe post!”.  
- **Body:**  
  - “POST X – [Title]”  
  - “Why it’s okay:” (bullets)  
  - “Keep sharing”–style line.  
- **Button:** “Awesome!!” — close popup, continue.  
- **Note:** Use correct copy per post (e.g. POST 13 = sunset/nature, not book cover text).

### 3.6 Completion popup (from mockup)

- **Header:** “CONGRATULATIONS, DIGITAL DETECTIVE”.  
- **Summary:** “You found 8/8 privacy risks…”  
- **What You Learned:** Bullets with checkmarks.  
- **Remember:** Checklist (background, text, location tags, “Could someone find me?”).  
- **Closing:** “You’re now a Digital Footprint Detective! Use these skills…”  
- **Buttons:** [Download Safety Checklist!], [Play Again!].

---

## 4. Technical architecture

### 4.1 Frontend

- **Router:** React Router (add dependency). Routes:  
  - `/` — Welcome  
  - `/instructions` — Instruction page  
  - `/game` — Main game (countdown + feed + popups)
- **State:** React Context (`GameContext`) for:  
  - `playerName`, `sessionId`, `score`, `foundItems`, `currentPopup`, `isPaused`, `gameComplete`, `scrollPosition`, `posts`, etc.  
  - Handlers: `handleCorrectClick`, `handleIncorrectClick`, `handleSafePopupContinue`, `handleUnsafePopupContinue`, `handleCompletionClose`, etc.
- **Components:**  
  - `WelcomeScreen`, `InstructionScreen`, `GameScreen`  
  - `FeedContainer`, `Post`, `PostImage`, `DangerZoneOverlay` (or equivalent)  
  - `ProgressBar`, `CountdownOverlay`  
  - `UnsafePopup`, `SafePopup`, `CompletionPopup`  
  - `Layout` (sidebar, stories, etc.) if shared across game screen.

### 4.2 Data flow

- **Posts + education:** Load from `posts.json` (or similar). Pass into `GameContext` / feed.  
- **Clicks:** Image click → transform to original-image coords → check danger zones → dispatch correct/incorrect.  
- **Metrics:** On [Play] → create session (API). On completion → update session (API).

### 4.3 Backend (high level)

- **Create player/session:** `POST /api/players` or `POST /api/sessions`.  
  - Body: `{ name }` (and optionally `sessionId` if generated client-side).  
  - Response: `{ id, sessionId, ... }`. Store `id` or `sessionId` in context for later update.  
- **Update on completion:** `PATCH /api/players/:id` or `PATCH /api/sessions/:id`.  
  - Body: `{ score, categoriesFound, playingTimeSeconds, completedAt }`.  
- **MongoDB:** One collection (e.g. `players` or `sessions`). Schema below.

---

## 5. Data structures

### 5.1 Post (single feed item)

```json
{
  "id": "post1",
  "index": 1,
  "type": "danger",
  "category": "location",
  "image": "/src/assets/Images Folder/Unsafe/image1.png",
  "username": "minmin",
  "avatar": null,
  "caption": "…",
  "tags": ["#Birthday", "#March15"],
  "likes": 5,
  "comments": 3,
  "dangerZones": [
    {
      "id": "post1-zone1",
      "category": "location",
      "type": "house_number",
      "originalWidth": 800,
      "originalHeight": 600,
      "x": 253,
      "y": 76,
      "width": 308,
      "height": 81,
      "explanation": {
        "title": "House Number \"2847\"",
        "whatFound": "House number visible on door",
        "whyDangerous": "House number tells strangers where you live…",
        "whatToDoInstead": ["Check photo backgrounds…", "Crop out…"],
        "quickTip": "If your house number shows, retake the photo from a different angle!"
      }
    }
  ],
  "safeExplanation": null
}
```

- **Safe post:** `type: "safe"`, `dangerZones: []`, `safeExplanation: { ... }` with “Why it’s okay” and “Keep sharing” copy.

### 5.2 Posts order and mapping

- **Order:** Fixed sequence of 20 posts. Map `index` 1–20 to your content (1–8 danger, 9–20 safe).  
- **Images:**  
  - Unsafe: `image1.png` … `image8.png` (match POST 1–8).  
  - Safe: `art.png`, `dog.png`, `food.png`, etc. (match POST 9–20).

### 5.3 Game state (Context)

```js
{
  playerName: string,
  sessionId: string | null,
  playerId: string | null,      // MongoDB _id for PATCH
  score: number,                 // 0..8
  foundItems: Array<{ postId, zoneId, category }>,
  currentPopup: null | { type: 'unsafe' | 'safe' | 'completion', data: … },
  isPaused: boolean,
  gameComplete: boolean,
  scrollPosition: number,
  countdownActive: boolean,
  countdownValue: number,
  posts: Post[],
  safePostClickCounts: Record<string, number>,  // postId -> clicks
  gameStartTime: number | null,  // for playingTimeSeconds
}
```

### 5.4 MongoDB document (player/session)

```js
{
  _id: ObjectId,
  sessionId: string,           // UUID
  playerName: string,          // first name / nickname only
  score: number,
  totalPossible: 8,
  categoriesFound: string[],
  wrongClicksCount: number,    // optional
  playingTimeSeconds: number,
  completedAt: Date,
  createdAt: Date
}
```

- **Create** on [Play] with `score: 0`, `categoriesFound: []`, etc.  
- **Update** on completion with final `score`, `categoriesFound`, `playingTimeSeconds`, `completedAt`.

---

## 6. Click detection & coordinates

### 6.1 Stored data (from pixel picker)

- **Original image size:** `originalWidth`, `originalHeight` (of the image file used in picker).  
- **Zone:** `x`, `y`, `width`, `height` in **original** pixel coords (e.g. from P1–P4).  
- **Units:** pixels, relative to original image.

### 6.2 Runtime flow

1. **Render:** Image displayed at **displayed** size (via CSS/canvas).  
2. **Click:** User clicks on image. Get `(clientX, clientY)` and image `getBoundingClientRect()`.  
3. **Relative click:**  
   - `clickX = clientX - rect.left`  
   - `clickY = clientY - rect.top`  
4. **Convert to original space:**  
   - `origX = (clickX / rect.width) * originalWidth`  
   - `origY = (clickY / rect.height) * originalHeight`  
5. **Hit test:** Check if `(origX, origY)` lies inside any `dangerZones` rect:  
   - `origX >= x && origX <= x + width && origY >= y && origY <= y + height`  
6. **Result:**  
   - **Hit:** Correct click → unsafe flow.  
   - **Miss:** Incorrect. If post is safe and `safePostClickCounts[postId] > 3` → safe popup.

### 6.3 Edge cases

- **Aspect ratio:** If image is cropped or letterboxed, use only the **visible** image region for `rect` and coords.  
- **Multiple zones per post:** Iterate all zones; first hit wins.  
- **Caption/tags:** If clickable, define separate zones (e.g. caption line) or treat entire post area differently as needed.

---

## 7. Game logic

### 7.1 Correct click (danger zone)

1. Pause scroll (`isPaused = true`).  
2. Add to `foundItems`; set `score += 1`.  
3. Open `currentPopup = { type: 'unsafe', data: { post, zone } }`.  
4. On [Ok, Got it!]: close popup, `isPaused = false`, resume scroll.  
5. If `score === 8` → set `gameComplete`, show Completion popup instead of resuming.

### 7.2 Incorrect click (safe post)

1. Increment `safePostClickCounts[postId]`.  
2. If `safePostClickCounts[postId] <= 3`: do nothing (no popup).  
3. If `> 3`: Pause scroll, open `currentPopup = { type: 'safe', data: { post } }`.  
4. On [Awesome!!]: close popup, resume.  
5. Optional: Reset that post’s click count or cap so we don’t show again (TBD).

### 7.3 Incorrect click (danger post, but wrong area)

- No penalty. Optional: same as safe post (e.g. after 4 clicks show “This part is safe”)?  
- **Default:** Do nothing; only safe posts use the “4+ clicks → safe popup” rule.

### 7.4 Scroll behavior

- **Direction:** Vertical.  
- **Control:** `requestAnimationFrame` or similar; update `scrollPosition` each frame when not `isPaused` and not `countdownActive`.  
- **End:** Stop at end of feed (no loop).  
- **Pause:** During countdown, during any popup, and when `gameComplete`.

### 7.5 Countdown

- **Duration:** 3 seconds (3 → 2 → 1 → 0).  
- **UI:** Full-screen overlay on feed, dimmed; big number in center.  
- **When 0:** Remove overlay, set `countdownActive = false`, start scroll.

---

## 8. API & MongoDB

### 8.1 Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/players` or `/api/sessions` | Create player/session on [Play]. Body: `{ name }`. Return `{ id, sessionId }`. |
| `PATCH` | `/api/players/:id` or `/api/sessions/:id` | Update on completion. Body: `{ score, categoriesFound, playingTimeSeconds, completedAt }`. |

- **Base URL:** TBD (e.g. same origin if API lives with frontend, or separate backend URL).

### 8.2 MongoDB

- **Collection:** e.g. `players` or `sessions`.  
- **Create:** On [Play]. Store `sessionId`, `playerName`, `createdAt`, and default `score`, `categoriesFound`, etc.  
- **Update:** On completion. Set `score`, `categoriesFound`, `playingTimeSeconds`, `completedAt`.  
- **Privacy:** Store only what’s agreed (name, score, categories, time). No PII beyond first name/nickname.

### 8.3 Error handling

- **Create fails:** Show error message; do not navigate to Instructions.  
- **Update fails:** Still show Completion popup; optionally retry or log. User experience should not break.

---

## 9. File & folder structure

```
Game Master Files/
├── public/
│   └── (static assets, e.g. logo)
├── src/
│   ├── assets/
│   │   └── Images Folder/
│   │       ├── Safe/          (art, band, basketball, …)
│   │       └── Unsafe/        (image1…image8)
│   ├── components/
│   │   ├── welcome/
│   │   │   └── WelcomeScreen.jsx
│   │   ├── instructions/
│   │   │   └── InstructionScreen.jsx
│   │   ├── game/
│   │   │   ├── GameScreen.jsx
│   │   │   ├── FeedContainer.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── PostImage.jsx
│   │   │   ├── DangerZoneOverlay.jsx (or inline in Post)
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── CountdownOverlay.jsx
│   │   │   └── Layout.jsx (optional; sidebar, stories)
│   │   ├── popups/
│   │   │   ├── UnsafePopup.jsx
│   │   │   ├── SafePopup.jsx
│   │   │   └── CompletionPopup.jsx
│   │   └── ui/
│   │       └── (buttons, inputs if reused)
│   ├── context/
│   │   └── GameContext.jsx
│   ├── data/
│   │   └── posts.json
│   ├── hooks/
│   │   ├── useScroll.js
│   │   ├── useCountdown.js
│   │   └── useClickDetection.js (optional)
│   ├── lib/
│   │   └── api.js (fetch create/update)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── DEVELOPMENT_PLAN.md (this file)
└── package.json
```

- **Backend:** Either `/api` inside same repo (e.g. Vercel serverless) or separate `backend/` (Express + MongoDB). TBD.

---

## 10. Build phases — step-by-step

### Phase 0: Setup & routing

1. Install React Router: `npm install react-router-dom`.  
2. Add `BrowserRouter` in `main.jsx`; define routes in `App.jsx`:  
   - `/` → `WelcomeScreen`  
   - `/instructions` → `InstructionScreen`  
   - `/game` → `GameScreen`  
3. Create stub components for each screen (heading only).  
4. Confirm navigation works (e.g. Welcome → Instructions → Game via buttons).

### Phase 1: Welcome & instructions

5. **WelcomeScreen:**  
   - Add logo (use placeholder if needed).  
   - Name input (controlled), [Play] button.  
   - On submit: validate name (if required), then call `POST /api/players` (or mock).  
   - Store `playerId` / `sessionId` in context, then `navigate('/instructions')`.  
6. **GameContext:**  
   - Create `GameProvider`. Add state: `playerName`, `playerId`, `sessionId`.  
   - Add `setPlayer`, `createPlayer` (API call) and wrap app with `GameProvider`.  
7. **InstructionScreen:**  
   - Add copy: what the game is, how to play.  
   - [Start Game] → `navigate('/game')`.

### Phase 2: Game layout & feed (no scroll yet)

8. **GameScreen:**  
   - Render `Layout` (banner, stories, sidebars) + `FeedContainer`.  
9. **Layout:**  
   - Top banner: title, “Found 0/8”, progress bar (static).  
   - Stories row, left nav, right Messages + RULES.  
   - Use Tailwind; match mockup roughly.  
10. **FeedContainer:**  
    - Render list of `Post` components.  
    - Each `Post` receives one item from `posts.json`.  
11. **Post:**  
    - Header (avatar, username), image, actions, likes/comments, caption.  
    - Use real images from `Images Folder`.  
12. **Data:**  
    - Create `posts.json` with all 20 posts.  
    - For now, `dangerZones` can be empty or placeholder; add real coords later.  
    - Map POST 1–8 to `Unsafe/image1–8`, POST 9–20 to Safe images.

### Phase 3: Countdown & scroll

13. **CountdownOverlay:**  
    - Full-screen dim overlay + 3–2–1–0.  
    - Use `useCountdown(3)` or similar; on complete, set `countdownActive = false`.  
14. **GameScreen:**  
    - Show overlay + countdown when `countdownActive`; hide when done.  
    - Start scroll only when countdown finished.  
15. **Scroll:**  
    - `useScroll` or logic in `FeedContainer`: `requestAnimationFrame`, update `scrollPosition`, apply `transform: translateY(-scrollPosition)` to feed.  
    - Stop at end of feed.  
    - Pause when `isPaused` or `countdownActive`.

### Phase 4: Click detection & danger zones

16. **Coordinates:**  
    - For each danger post, add `originalWidth`, `originalHeight`, and `dangerZones` with `x,y,width,height` (from pixel picker).  
    - Store in `posts.json`.  
17. **Post / PostImage:**  
    - Attach click handler to image (or wrapper).  
    - On click: get `getBoundingClientRect()`, compute `clickX/Y` relative to image, convert to original space, hit-test `dangerZones`.  
18. **Correct click:**  
    - Call `handleCorrectClick(post, zone)` from context.  
    - Context: pause, update `score` and `foundItems`, set `currentPopup = { type: 'unsafe', data }`.  
19. **UnsafePopup:**  
    - Render when `currentPopup.type === 'unsafe'`.  
    - Show category, what found, why dangerous, what to do, quick tip.  
    - [Ok, Got it!] → `handleUnsafePopupContinue` (close popup, resume).  
    - If `score === 8`, show Completion popup instead.

### Phase 5: Safe posts & safe popup

20. **Safe post clicks:**  
    - Track `safePostClickCounts[postId]` in context.  
    - On click on safe post (or non-zone area): increment.  
    - If `> 3`, set `currentPopup = { type: 'safe', data: { post } }`, pause.  
21. **SafePopup:**  
    - Render when `currentPopup.type === 'safe'`.  
    - Use `post.safeExplanation` for “Why it’s okay” and “Keep sharing”.  
    - [Awesome!!] → close, resume.

### Phase 6: Completion & metrics

22. **CompletionPopup:**  
    - Shown when `score === 8`.  
    - Summary, “What You Learned”, “Remember” checklist.  
    - [Download Safety Checklist] → link to PDF or placeholder.  
    - [Play Again] → navigate to `/` or `/instructions` (TBD).  
23. **Metrics:**  
    - On game complete: compute `playingTimeSeconds` (from `gameStartTime`), `categoriesFound` from `foundItems`.  
    - Call `PATCH /api/players/:id` with these fields.  
24. **Backend:**  
    - Implement `POST` and `PATCH` (Express or Vercel).  
    - Connect to MongoDB; create on Play, update on completion.

### Phase 7: Polish & QA

25. **RULES button:**  
    - Implement per decision (e.g. pause + rules modal).  
26. **Responsive:**  
    - Ensure layout works on small screens (flex, overflow, font sizes).  
27. **QA:**  
    - Test full flow: Welcome → Instructions → Game → 8 correct → Completion → Play Again.  
    - Test safe-post 4+ clicks → Safe popup.  
    - Test coordinate scaling (resize window; zones still accurate).  
28. **Content:**  
    - Replace any placeholders with final copy and correct post-specific text (e.g. POST 13).

---

## 11. Content checklist

### Danger posts (1–8)

- [ ] POST 1: House number — image1, zones, explanation  
- [ ] POST 2: Street sign — image2, zones, explanation  
- [ ] POST 3: School logo hoodie — image3, zones, explanation  
- [ ] POST 4: Certificate — image4, zones, explanation  
- [ ] POST 5: Full birthdate caption — image5, zones, explanation  
- [ ] POST 6: Class schedule — image6, zones, explanation  
- [ ] POST 7: Soccer schedule caption — image7, zones, explanation  
- [ ] POST 8: License plate — image8, zones, explanation  

### Safe posts (9–20)

- [ ] POST 9: Abstract art — art.png, safeExplanation  
- [ ] POST 10: Pet — dog.png  
- [ ] POST 11: Food — food.png  
- [ ] POST 12: Selfie — selfie.png  
- [ ] POST 13: Sunset/nature — nature.png  
- [ ] POST 14: Gaming setup — pc.png  
- [ ] POST 15: Reading — reading.png  
- [ ] POST 16: Basketball — basketball.png  
- [ ] POST 17: Band — band.png  
- [ ] POST 18: Craft — craft.png  
- [ ] POST 19: Friends — friends.png  
- [ ] POST 20: Trophy — trophies.png  

### Completion & instructions

- [ ] Completion popup: summary, “What You Learned”, “Remember” (use agreed final copy).  
- [ ] Instruction page: short “What is this game?” + “How to play” bullets.  
- [ ] Download Safety Checklist: PDF or placeholder link.

---

## 12. Decisions & open questions

- **Play Again:** Go to Welcome vs Instructions vs restart game only?  
- **RULES button:** Pause + rules modal vs navigate to Instructions vs other?  
- **Download Safety Checklist:** Real PDF vs placeholder?  
- **Name validation:** Required? Min/max length? Guest play?  
- **Backend host:** Vercel serverless vs Express + separate deploy?  
- **Incorrect on danger post:** Any special behavior (e.g. “This part is safe” after N clicks)?  

---

*Use this document as the single source of truth during development. Update it when we lock decisions or change structure.*
