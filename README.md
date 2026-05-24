# tranqli

tranqli is a waitlist website for a calm workplace mental-health companion. The site collects emails, stores them in Neon Postgres, and presents a responsive light/dark landing experience.

## Stack

- Next.js App Router
- React 19
- Tailwind CSS v4
- Drizzle ORM
- Neon Postgres
- Xior for client HTTP requests
- Phosphor Icons

## Setup

Install dependencies:

```bash
bun install
```

Create a local env file:

```bash
cp .env.example .env
```

Set the Neon connection string:

```env
DATABASE_URL="your neon connection string"
```

Apply database migrations:

```bash
bun run db:migrate
```

Start the app:

```bash
bun run dev
```

Open `http://localhost:3000`.

## Database

Waitlist submissions are stored in the `waitlist_entries` table with:

- `id`
- `email`
- `source`
- `created_at`

Generate a new migration after schema changes:

```bash
bun run db:generate
```

Inspect the database locally:

```bash
bun run db:studio
```

## Scripts

```bash
bun run dev        # start local dev server
bun run build      # production build
bun run start      # start production server
bun run lint       # lint code
bun run db:migrate # apply Drizzle migrations
bun run db:studio  # open Drizzle Studio
```
