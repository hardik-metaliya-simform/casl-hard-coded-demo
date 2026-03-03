# Initial Setup

This document explains how to perform the initial setup for the project `client/` and `server/` folders, including starting a local Postgres Docker container, applying Prisma migrations, seeding the database, and starting the development servers.

## Prerequisites

- Docker installed and running
- Node.js (v20+ recommended) and npm installed

## 1) Start Postgres in Docker

Run the following to start a local Postgres container (exposes port 5432):

```bash
docker run --name some-postgres-1 -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

Verify Postgres is running:

```bash
docker ps
```

Stop and remove the container when you no longer need it:

```bash
docker stop some-postgres-1 && docker rm some-postgres-1
```

## 2) Configure database URL

The server uses `DATABASE_URL` for Prisma. Create a `.env` file in the `server/` folder with the following value (adjust password/host/schema as needed):

.env included in the repo

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres?schema=public"
```

## 3) Server: install deps, run migrations and seed

From the repository root:

```bash
cd server
npm install

# Apply existing migrations to the database
npx prisma migrate deploy

# Run configured seed script (uses `prisma db seed` if set up)
npx prisma db seed

# Start the development server (common for NestJS projects)
npm run start:dev
```

## 4) Client: install deps and run

Open a new terminal and run:

```bash
cd client
npm install
npm run dev
```

The client is a Vite app and typically runs on `http://localhost:5173`
