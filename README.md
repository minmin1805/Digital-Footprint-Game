# Digital Footprint Detective

An educational **web game** for teens, built for **Our Rescue**, that teaches how to **spot privacy risks in social media**—photos, captions, and habits—so players can make safer decisions online.

---

## Table of contents

- [About the game](#about-the-game)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Project structure](#project-structure)
- [Run locally](#run-locally)
- [Environment variables](#environment-variables)
- [Production build](#production-build)
- [License & credits](#license--credits)

---

## About the game

**Digital Footprint Detective** simulates a social media feed. Players move through a series of posts and must:

- **Unsafe posts** — Tap the part of the photo or caption that shows a real privacy risk (e.g. house numbers, school info, personal details).
- **Safe posts** — Use the **like (heart) button** to show the post is safe; clicking the image is incorrect (with guidance after a few attempts).
- **Progress** — Find risks across **five categories**: Location, School, Personal ID, Routines, and Family & Home.
- **Timer** — Each post is timed, encouraging quick, thoughtful choices.

The experience includes **instruction screens**, **feedback popups** (safe vs. unsafe), **background music** (toggleable), **sound effects**, and an **end screen** with a **downloadable safety checklist** PDF and optional **saving of results** to the server.

**Audience:** Teens and anyone learning digital safety in a classroom or workshop context.

---

## Key features

| Area | Description |
|------|-------------|
| **UI** | Feed and posts styled like familiar social apps (avatar, image, likes, caption). |
| **Gameplay** | Danger zones on images, caption-based risks, heart / safe flow, three-strike image clicks on safe posts. |
| **Audio** | Global click & button sounds, like sound, buzzer for wrong heart; loopable background music. |
| **Content** | Scenarios and copy driven by `posts.json` and image map. |
| **PDF** | One-click download of a branded safety checklist (`DigitalFootprintDetective.pdf`). |
| **Backend** | Player session and completion stats stored in **MongoDB** (Express + Mongoose). |

---

## Tech stack

### Frontend

| Technology | Role |
|------------|------|
| **React 19** | UI and routing. |
| **Vite 7** | Dev server, HMR, production build. |
| **React Router 7** | Routes: welcome → instructions → game. |
| **Tailwind CSS 4** | Styling (including `@tailwindcss/vite`). |
| **axios** | HTTP client for the player API. |
| **use-sound** + **Howler** | SFX. |
| **react-icons** | Icons (e.g. music toggle). |
| **html2canvas** / **jsPDF** | Available in dependencies (legacy / optional PDF generation paths). |

### Backend

| Technology | Role |
|------------|------|
| **Node.js** | Runtime. |
| **Express 5** | REST API (`/api/players`). |
| **Mongoose 9** | MongoDB ODM. |
| **CORS** | Cross-origin (dev: Vite on another port). |
| **dotenv** | Load `.env` in development and production. |

### Data

- **MongoDB Atlas** (or any URI Mongoose can connect to) for persisting player records.

---

## Requirements

- **Node.js** **18+** (LTS recommended)
- **npm** (comes with Node)
- **MongoDB** — A connection string you can use in `.env` (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

Optional:

- **Git** — Clone the repository
- A modern **browser** (Chrome, Firefox, Safari, Edge)

---

## Project structure

```
.
├── backend/
│   ├── controllers/      # e.g. playerController.js
│   ├── lib/              # db.js (Mongoose connect)
│   ├── models/           # Player schema
│   ├── routes/           # e.g. /api/players
│   └── server.js         # Express app + static frontend in production
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/       # Images, audio, PDF checklist
│   │   ├── components/   # Post, popups, feed, music toggle, etc.
│   │   ├── context/      # Game, sound, music
│   │   ├── data/         # posts.json, post images map
│   │   ├── lib/
│   │   ├── pages/        # Welcome, Instruction, Game
│   │   ├── services/     # playerService (API)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js    # /api → backend proxy in dev
│   └── package.json
├── .env                    # Not committed — create from example below
├── package.json            # Root scripts: dev, start, build
└── README.md
```

---

## Run locally

You need **two terminal windows**: one for the **API** and one for the **Vite** frontend (recommended for local development).

### 1. Clone and install

```bash
cd "Digital footprint"   # or your project folder
npm install
cd frontend
npm install
cd ..
```

### 2. Environment file

In the **project root** (same level as the root `package.json`), create a file named **`.env`**:

```env
PORT=8000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<db-name>?<options>
NODE_ENV=development
```

- Replace with your own MongoDB URI. **Do not commit real passwords** to git.
- The backend reads `MONGO_URI` in `backend/lib/db.js`.

> **Security:** Add `.env` to `.gitignore` if it is not already there, and rotate credentials if they were ever committed.

### 3. Start the backend (API)

From the **repository root**:

```bash
npm run dev
```

- Uses **nodemon** to run `backend/server.js`.
- Default port: **8000** (or the value in `PORT`).
- API base: `http://localhost:8000/api/…`

In production, `npm start` runs without nodemon.

### 4. Start the frontend (Vite)

Open a **second** terminal, from the **repository root**:

```bash
cd frontend
npm run dev
```

- Vite usually serves at `http://localhost:5173` (check the terminal output).
- The Vite config proxies `/api` to `http://localhost:8000`, so the browser calls the same origin path `/api/players` and it reaches the Express server.

### 5. Open the game

In your browser go to the URL Vite prints (e.g. **http://localhost:5173**).

1. Enter a name on the welcome screen.  
2. Read instructions, then start the game.  
3. The app will create a player document when you start (if MongoDB is connected).

**If the API fails to connect to MongoDB**, the server may exit on startup; fix `MONGO_URI` and try again.

---

## Environment variables

| Variable     | Description |
|-------------|-------------|
| `PORT`      | Port for Express (default **8000**). |
| `MONGO_URI` | Full MongoDB connection string. |
| `NODE_ENV`  | `development` or `production` (affects static file serving in `server.js`). |

---

## Production build

Build the React app, then start Node so it serves the built files from `frontend/dist`.

From the **repository root**:

```bash
npm run build
```

Then:

```bash
npm start
```

- Set `NODE_ENV=production` in your host’s environment.  
- Express serves `frontend/dist` and falls back to `index.html` for client-side routing.  
- Use the same `PORT` (e.g. 8000) or the one your host assigns.

For **Atlas / cloud MongoDB**, allow your server’s IP (or `0.0.0.0/0` for testing) in the network access list.

---

## API overview (for developers)

- `POST /api/players` — Create a player (`username` in body). Returns `id`, `sessionId`, `playerName`.  
- `PATCH /api/players/:id` — Update completion: score, categories, time, `safepostDetected`, `safepostTotal`, etc.

See `backend/routes/player.js` and `backend/models/Player.js` for the exact fields.

---

## License & credits

- **Our Rescue** — Mission and brand context.  
- **Game** — Digital Footprint Detective: educational use.

---

*Last updated to match the stack and scripts in this repository. If something fails, confirm Node version, that both `npm install` (root and `frontend/`) completed, and that `MONGO_URI` is valid.*
