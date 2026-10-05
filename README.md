# Smart Budget Tracker

Web app to organize spending, track income/expenses, and view finances with charts.

## Features

- Visual spending analysis by category
- Username/password login (email login also works)
- Optional Google login
- Interactive charts (daily spending + category breakdown)
- Custom categories
- Income/expense tracking with automatic dates
- Budget health (income vs expenses)

## Default Categories

- Housing
- Utilities
- Food & Groceries
- Transportation
- Entertainment

You can add more from the dashboard.

## Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for MySQL)

Google OAuth credentials are optional (only needed for Google login / password-reset emails).

## First-time setup (teammates)

From the project root:

```bash
# 1) Install dependencies + create .env from the example
npm run setup

# 2) Start MySQL (creates tables automatically on first run)
npm run db:up

# 3) Wait ~10–20 seconds for MySQL to become ready, then start the app
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

Sign up with a new username/email/password, then log in.

### Useful commands

| Command | What it does |
|---------|----------------|
| `npm run setup` | `npm install` + copy `.env.example` → `.env` if missing |
| `npm run db:up` | Start MySQL with Docker Compose |
| `npm run db:down` | Stop MySQL |
| `npm start` | Run the app |
| `npm run dev` | Run the app with auto-reload (nodemon) |

### Manual alternative

```bash
cp .env.example .env   # Windows: copy .env.example .env
npm install
docker compose up -d
npm start
```

Default DB settings (already in `.env.example`):

- Host: `127.0.0.1`
- Port: `3306`
- User: `root`
- Password: `rootpassword`
- Database: `smart_budget`

Do **not** commit your real `.env` file.

## After reboot / next day

```bash
npm run db:up
npm start
```

## Project structure

```
Smart-Budget-Tracker/
├── server.js                 # App entry point
├── package.json
├── docker-compose.yml        # Local MySQL
├── schema.sql                # Database tables
├── .env.example              # Env template
├── style.css
├── server/
│   ├── config/db.js          # MySQL connection
│   ├── controller/           # Business logic
│   └── routes/authRoutes.js
└── view/                     # EJS templates
    ├── login.ejs
    ├── mainpage.ejs
    └── resetPassword.ejs
```

## Notes

- Login accepts **username or email**.
- Google login / forgot-password email need valid values in `.env` (`CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, `GOOGLE`).
- If port `3306` is already in use, stop the other MySQL service or change the port mapping in `docker-compose.yml` and `DB_PORT` in `.env`.
