import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

type Database = NeonHttpDatabase<typeof schema>;

let cachedDb: Database | null = null;

function getDatabaseUrl() {
	return process.env.DATABASE_URL ?? process.env.WAITLIST_DB_URL;
}

export function getDb() {
	if (cachedDb) {
		return cachedDb;
	}

	const databaseUrl = getDatabaseUrl();
	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not configured.");
	}

	cachedDb = drizzle(neon(databaseUrl), { schema });
	return cachedDb;
}
