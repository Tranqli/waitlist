import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const waitlistEntries = pgTable("waitlist_entries", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: text("email").notNull().unique(),
	source: text("source").notNull().default("tranqli-waitlist"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
