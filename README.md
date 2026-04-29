# [Spectrix - API Monitoring Tool](https://spectrix.d3labs.tech/)

Lightweight API monitoring with real-time incident alerts (Slack, Discord, Webhooks).
> 🚀 Live Demo: https://spectrix.d3labs.tech/

## Overview

Spectrix monitors your API endpoints and notifies you when something breaks - without heavyweight observability tooling.

It tracks:
- uptime
- response time
- failures
- incidents

and sends alerts via:
- Slack
- Discord
- Webhooks

## Screenshots

Landing page and dashboard screens from the current UI.

### Landing Page (Hero)

![Landing page hero](https://github.com/user-attachments/assets/b0e5483c-0c02-4406-911f-fd97ffda8e1c)

### Landing Page (Full)

<img alt="Landing page full" src="https://github.com/user-attachments/assets/982f01b2-49f6-415c-9a41-173c0c544efa" />

### Service Page

![Service page](https://github.com/user-attachments/assets/41188d08-f9af-4a97-af7d-5b2002732988)

### Dashboard (Overview)

![Dashboard overview](https://github.com/user-attachments/assets/8758c23a-997b-4de8-9814-1ca62cbcaa4d)

### APIs

![APIs page](https://github.com/user-attachments/assets/e02def42-1bed-406f-8fb3-c7d08254e538)

### Incidents

![Incidents page](https://github.com/user-attachments/assets/67ee03d2-25b9-4b74-9cd2-18e3f7579c5e)

### Alert Channels

![Alert channels](https://github.com/user-attachments/assets/2f5d915c-bb5a-49fb-a867-eb823c999908)

### Logs

![Logs page](https://github.com/user-attachments/assets/079ca3c6-4388-4c36-879a-c7a052dcf67b)

## Features

- API endpoint monitoring (GET/POST/etc.)
- Timeout + retry support per endpoint
- Incident detection (based on repeated failures)
- Real-time alerts (Slack / Discord / generic webhook)
- Encrypted webhook URL storage (AES-256-CBC with per-version keys)
- Logs include status code, latency, and error type (DNS/timeout/network)
- Dashboard UI to manage services, endpoints, incidents, and alert channels
- Multi-service support (group endpoints under a service base URL)

## Why I Built This

I built Spectrix because I needed a simple way to monitor my APIs without using heavy observability tools.

I wanted:
- scheduled endpoint checks
- failure detection
- instant alerts

This project also helped me explore worker-based systems, retry logic, and alert integrations like Slack and Discord.

## Architecture

- Worker: polls endpoints that are due (`nextCheckAt`) on an interval
- Logs: stores every check result (success/failure, response time, error type)
- Incidents: created/resolved based on endpoint health over time
- Alerts: triggered on incident create/resolve and sent to configured channels

## Tech Stack

- Backend: Node.js + Express (TypeScript)
- Database: MongoDB + Mongoose
- Frontend: Next.js (App Router)
- HTTP checks + alerts: Axios
- Validation: Zod

## Setup

### 1) Clone repo

```bash
git clone https://github.com/your-username/spectrix.git
cd spectrix
```

### 2) Backend install

```bash
cd backend
npm install
```

### 3) Backend environment variables

Copy the example file and fill in the required values:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Then edit `backend/.env` (Mongo URI, JWT secrets, CORS `CLIENT`, encryption key values, etc.).

### 4) Start backend

```bash
npm run dev
```

Backend runs on `http://localhost:4000` and exposes the API at `http://localhost:4000/api/v1`.

### 5) Frontend install

```bash
cd ../frontend
npm install
```

### 6) Frontend environment variables

Copy the example file:

```bash
# macOS / Linux
cp .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local
```

Update `NEXT_PUBLIC_API_BASE_URL` if your backend runs on a different host/port.

### 7) Start frontend

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

- Backend: see `backend/.env.example`
- Frontend: see `frontend/.env.example`

## Alert Channels

You can connect:
- Slack webhook
- Discord webhook
- Custom webhook

Webhook URLs are encrypted before storing in MongoDB.

A test alert is sent during channel creation to verify configuration.

## How It Works

1. Add a service (base URL)
2. Add one or more endpoints under that service
3. Worker checks endpoints periodically (based on each endpoint’s interval)
4. Failures are logged
5. After repeated failures → incident created
6. Alert sent to your configured channels
7. When the endpoint recovers → recovery alert sent

## Deployment

- Backend: deploy `backend/` to Render / Railway / Fly.io / VPS
- Frontend: deploy `frontend/` to Vercel / Netlify

Notes:
- Set `CLIENT` to your deployed frontend URL so CORS allows requests.
- Enable monitoring in production with `RUN_WORKERS=true`.

## Limitations

- Worker runs inside the API process (single instance)
- No alert rules/conditions yet (planned)
- No horizontal scaling for the worker (future)

## Roadmap

- Alert rules (custom conditions)
- Email notifications
- Status levels (healthy / degraded / down)
- Charts and analytics
- Queue-based worker (Redis)

## Contributing

PRs are welcome. Feel free to open issues for bugs or feature requests.
