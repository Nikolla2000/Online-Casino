<div align="center">

# 🎰 Elite Casino

**A production-grade full-stack casino platform built to demonstrate senior-level engineering from system design to real-time infrastructure.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![WebSockets](https://img.shields.io/badge/Real--time-WebSockets-purple)

[🎮 Live Demo](https://elite-casino.netlify.app/) · [📖 API Docs (Swagger)](https://online-casino.onrender.com/server/docs/)

</div>

---

> Elite Casino is not just a typical tutorial project, but a full-stack web application featuring live casino games, real-time communication, AI-powered assistance, Google OAuth, versioned REST APIs, Redis caching, and a CI/CD pipeline, all built with the architecture decisions and code quality you'd expect from a professional engineering team.

> [!WARNING]
> **This is NOT a real gambling site and I'm strongly against gambling.** This project serves purely as a technical sandbox to demonstrate my technical skills and explore new technologies. A casino platform was chosen as the domain because it naturally demands complex logic, real-time systems, and a wide range of technical challenges, nothing more.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure **JWT-based** authentication with protected routes
- **Google OAuth 2.0** sign-in for frictionless onboarding
- Guest access with limited functionality across the platform

### 📊 Dashboard
- Personal stats - total credits wagered, total wins, total rounds played, favorite game
- Recent activity feed and full game history
- Personal info display

### 🎮 Games
- Two fully interactive casino games - **Slots** and **Roulette**
- Each game features custom logic, dynamic UI and persistent history

### 👥 Social & User Interaction
- **Live users panel** displaying currently online players
- View other users' profiles, send direct messages or block them

### 💬 Real-time Communication
- **Direct private messaging** between online users powered by WebSockets
- Fully live, no page refresh needed, instant delivery

### 🤖 AI Chatbot Assistant
- Integrated live chatbot powered by **Groq AI**
- Provides mostly casino tips, game guidance and general site assistance
- Different experience for guests vs authenticated users
- Has example questions

### 📧 Contact & Notifications
- Contact form with **real email delivery**
- Toast notifications and real-time UI feedback throughout the app

### 🎨 UI & UX
- Fully **responsive** across all screen sizes
- Smooth **animations**, **skeleton loaders** and intuitive navigation


## 🎮 Games

### 🎰 Slot Machine

The slot machine is a fully custom-built game with no libraries and templates. Every part of the logic, from reel generation to win calculation, is written from scratch.

#### How it works

The game board consists of a **3×5 grid** — 3 rows and 5 columns of symbols. Each symbol is one of 12 possible values, visually represented as classic slot imagery (fruits, sevens, card signs and more. Underneath every visual, a number from 1 to 12 maps to a specific symbol and its associated payout tier.

When the player hits the **Spin**  button , a single POST request is sent to the backend carrying only the `betAmount`. Everything else happens server-side. The entire game outcome is determined server-side, making it impossible to manipulate from the browser.

#### Server side logic

All game logic lives inside a dedicated `SlotsService` class, keeping it fully decoupled from the controller layer. The controller receives the request, extracts the user ID from the JWT middleware and the bet amount from the request body, and hands both off to the service. From that point on, `SlotsService` takes over and runs through a strict sequence of steps:

1. **Validation** - `validateBet()` ensures the bet is a valid number within the allowed range (100–1000 credits). Invalid or out-of-range bets are rejected before anything else runs and will throw an error.
2. **Balance check** - the user's current credits are verified against the bet amount. Insufficient funds throw an early error.
3. **Reel generation** - `generateSlotReels()` produces a new 2D Array of 3×5 grid of random integers from 1 to 12.
4. **Win calculation** - `calculateWin()` evaluates all **9 paylines** across the grid - three straight rows, two diagonals, V and inverted V patterns, and two zigzag lines. Each payline is checked with `checkPayLine()`, which counts consecutive matching symbols left to right from the first position.
5. **Payout** - `getMultiplier()` determines the payout for each winning combination based on both the symbol's tier and the number of consecutive matches (2 through 5). A 5-of-a-kind Diamond pays 100× the bet; a 2-of-a-kind King pays 0.1×. Multiple winning paylines stack, so the total multiplier is the sum of all active lines.
6. **Database update** - the user's balance, total wagered, total won and games played are updated atomically in a single `$inc` operation.
7. **History & transactions** - in production, two additional DB writes happen - a `GameHistory` record is created for the round and separate `Transaction` records are written for the bet and, if applicable, the win. In development this is skipped to keep the database clean.
8. **Cache invalidation** - after every round, some Redis keys for user data are invalidated so the dashboard always reflects fresh data on the next request.

A single comprehensive response object - reels, winning lines, multiplier, net profit, new balance is returned to the client in one response.

---

#### Client experience

While the server side processes the round, the frontend runs a **reel spinning animation**, mimicking a real slot machine. When the response arrives, the animation resolves to display the actual results. If its a winning round, it triggers a **win animation** and a **sound effect**.

Additional player controls:

- **Auto Play** - automatically triggers the next spin as soon as the current round completes, without manual input
- **Max Bet / Double Bet** - quick-set buttons for common bet adjustments
- **Sound toggle** - mute and unmute sound during play


## ⚙️ Under the Hood

### 🖥️ Frontend

- **React 18** - Plain React project (No Next.js in this one) build with Vite. Basic component-based architecture. The project was started on v18 and will be upgraded in a future iteration.

- **React Router** - The default react project library for routing when the project is in plain React and has no Next.js with app router. Enables a seamless SPA experience by mapping UI components to specific URL paths without full page reloads.

- **Redux Toolkit** for global state management. Chosen over alternatives like Context API or Zustand because the app has genuinely complex shared state - authenticated user data, balance, modals, games statem, socket connection status, that needs to be accessible and updatable from many parts of the component tree. Redux Toolkit removes the traditional Redux boilerplate while keeping the structure and predictability that scales well. The access token is stored in Redux state intentionally, not in `localStorage` — to avoid XSS exposure.

- **TanStack React Query** for server state management, Handling fetching, caching, background refetching and synchronization with the server. Rather than manually managing loading/error states with `useEffect` (still done like that in some parts of the project at the beginning), React Query provides a clean and declarative approach that also reduces unnecessary network requests through its built-in caching layer. Used alongside Redux, not instead of it and each handles a different concern.

- **Axios** with a custom interceptor that silently refreshes expired access tokens and retries the original failed request. This keeps the session seamless and avoids forcing the user to log in again mid-session.

- **Socket.io client** for real-time private messaging, kept in sync with the backend Socket.io server. The connection lifecycle is managed carefully to avoid duplicate connections or memory leaks across re-renders.

- **SASS/SCSS** for styling. Chosen primary for its convenient nesting and color constants variables, which make managing a large stylesheet across many components significantly more maintainable than plain CSS.

- **Vitest** for unit testing, with approximately 70% code coverage. Vitest was chosen over Jest for the frontend because it integrates natively with Vite, runs significantly faster, and supports ESM out of the box — no extra configuration needed.

---

### 🛠️ Backend

- **Node.js 22** with **Express 4** - RESTful API following a clean, versioned route structure (`/server/v1/...`). I tried to follow production standard practices and introduced api versioning, because it ensures that future breaking changes can be introduced under `/api/v2/...` without affecting existing clients.

- **MongoDB Atlas** via Mongoose for data persistence, hosted on the free tier cloud cluster. MongoDB was chosen because the data in this application (user profiles, game data, history, chat messages) is naturally document-shaped and varies per record, making a flexible schema a better fit than a rigid relational one.

- **Upstash Redis** for two distinct purposes:
  - **Caching** - mostly dashboard statistics and frequently-read user data are cached in Redis to avoid hitting MongoDB on every request. This is especially relevant for data that is read often but changes infrequently, such as a user profile stats.
  - **Rate limiting** - the rate limiter is Redis-backed rather than in-memory. An in-memory rate limiter resets on every server restart and breaks under horizontal scaling. By storing rate limit counters in Redis, the system is both restart-resistant and distributed-ready, exactly how it would be done in a real production environment.

- **JWT authentication** with a basic dual-token strategy - short-lived access tokens and long-lived refresh tokens. The access token lives in Redux state on the frontend (NOT `localStorage`), and the refresh token is stored in an HTTP-only cookie, making it inaccessible to JavaScript entirely. When the access token expires, an Axios interceptor automatically calls the refresh endpoint, obtains a new token, and retries the original request.

- **Socket.io** for real-time private messaging on the backend. Rather than a single shared chat room, each conversation is scoped between exactly two users — messages are emitted only to the intended recipient's socket. Online presence is also tracked, showing online users on the live users panel on the frontend.

- **Groq AI API** for the AI chatbot assistant. Requests are sent directly to Groq's API from the backend, keeping the API key server-side and out of the client. The chatbot context and available capabilities differ depending on whether the user is authenticated or browsing as a guest. The exact ai model used is openai/gpt-oss-20b.

- **Zod** for request validation on all incoming data. Zod schemas act as the single source of truth for what shape data is expected to be in. Invalid requests are rejected early, before they ever reach business logic or the database.

- **Multer** for handling profile picture uploads, processing multipart form data and storing the file securely before updating the user's record.

- **Nodemailer** for transactional emails, used when a user submits the contact form, triggering a real email delivery.

- **Winston** for structured logging, separating log levels (info, warn, error) and writing logs in a consistent, parseable format. Far more useful than `console.log` when debugging issues in a running application.

- **Swagger / OpenAPI** for full, interactive API documentation — available at `/server/docs/`. Every endpoint is documented with its expected request shape, parameters and possible responses. This makes the API immediately explorable and demonstrates that the project is built with real API consumers in mind.

- **Jest + Supertest** for unit and integration testing on the backend. Supertest allows full HTTP requests to be made against the Express app in a test environment, meaning endpoints are tested end-to-end including middleware, validation and database interaction, not just in isolation.

- **Docker** - separate `Dockerfile` for the frontend and backend, orchestrated with Docker Compose. Running the entire stack locally requires a single command, with no manual environment setup. Tried to follow the standard ways teams onboard new developers in professional environments.

- **CI/CD via GitHub Actions** - every push to the repository triggers an automated pipeline for both frontend and backend. Tests run first, and the deployment only proceeds if the full test suite passes. The frontend is deployed to **Netlify** and the backend to **Render**. Every change ships through a verified, automated process. No manual deployments and no "it works on my machine".
