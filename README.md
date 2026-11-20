# PLATINUM X — Digital Flagship & E-Commerce Platform

**LESS NOISE. MORE PRESENCE.**

A full-stack luxury streetwear digital flagship for **PLATINUM X**, built with React, TypeScript, Vite, Tailwind CSS, GSAP + ScrollTrigger, Lenis, Express, and SQLite. Designed for single-process deployment on a standard Pterodactyl Panel Node.js egg.

---

## Architecture Overview

- **Frontend (`src/`)**: React 19, React Router, Tailwind CSS v4, GSAP (`ScrollTrigger`, `quickTo`), Lenis smooth scroll, and a structured `MainLayout` combining collapsible desktop sidebar navigation, mobile drawer navigation, and the primary storefront content area.
- **Backend (`server.ts`, `server/`)**: Express + TypeScript REST API (`/api/products`, `/api/journal`, `/api/cart`, `/api/checkout`, `/api/orders`, `/api/newsletter`, `/api/contact`, `/api/webhooks/payment`, `/api/health`) with `helmet`, `express-rate-limit`, `zod` validation, and `better-sqlite3` persistence.
- **Database**: Single-file SQLite (`SQLITE_PATH`, default `./data/platinum-x.db`) using WAL mode and non-destructive schema initialization.

---

## Local Development

```bash
npm install
npm run dev
```

The development server runs Express + Vite middleware together on `http://0.0.0.0:3000` (or `PORT` / `SERVER_PORT` if set).

---

## Production Build & Start

```bash
npm install
npm run build
npm start
```

- `npm run build` compiles the Vite React bundle into `dist/` and bundles `server.ts` into `server.js`.
- `npm start` runs `NODE_ENV=production node server.js`, serving both `/api/*` endpoints, static files from `dist/` and `public/`, and React Router history fallback through a single Node.js process.

---

## Pterodactyl Panel Deployment Guide

### 1. Server Requirements
- **Egg**: Standard Node.js Egg (Node.js 20+ or Node.js 22 recommended).
- **Port Allocation**: Assign an allocation port in Pterodactyl. Pterodactyl typically injects `SERVER_PORT` (or `PORT`). The server automatically reads `process.env.PORT || process.env.SERVER_PORT || 3000` and binds to `0.0.0.0`.
- **Writable Filesystem**: Ensure the server container directory has write permissions so SQLite can create `./data/platinum-x.db`.

### 2. Startup Command
Set the Pterodactyl startup command to:

```bash
npm start
```

Or if your Node.js egg requires a direct JavaScript entry file after running `npm run build`:

```bash
node server.js
```

### 3. Environment Variables
Copy `.env.example` to `.env` (or configure in Pterodactyl's Variables / Startup environment):

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Set to `production` | `production` |
| `PORT` / `SERVER_PORT` | Allocated container port | `3000` |
| `SQLITE_PATH` | Path to persistent SQLite file | `./data/platinum-x.db` |
| `SESSION_SECRET` | Random secret string | — |
| `PUBLIC_SITE_URL` | Your canonical HTTPS URL | `http://localhost:3000` |
| `CATALOG_MODE` | `enquiry` (studio confirmation) or `priced` | `enquiry` |
| `PAYMENT_PROVIDER` | `development` or `stripe` | `development` |
| `PAYMENT_SECRET_KEY` | Payment provider secret key (if live) | — |
| `PAYMENT_WEBHOOK_SECRET` | Webhook HMAC signing secret | — |

### 4. Reverse Proxy, Domain & HTTPS
Pterodactyl allocates a container IP and port; it does **not** automatically provision a public domain, TLS certificate, or reverse proxy. In front of your Pterodactyl node allocation, configure **Nginx** or **Caddy** (with Let's Encrypt TLS) to proxy traffic from `https://yourdomain.com` to `http://<node-ip>:<allocated-port>`, passing `X-Forwarded-For` and `X-Forwarded-Proto`.

### 5. Persistent Data & Backups
- SQLite stores products, stock counts, carts, orders, newsletter signups, and studio contact inquiries inside `SQLITE_PATH` (`./data/platinum-x.db`, plus `-wal` / `-shm` files while running).
- Restarting the container preserves all data without re-seeding or overwriting existing rows.
- Schedule regular filesystem backups of the `./data/` directory before container migrations or egg reinstalls.
