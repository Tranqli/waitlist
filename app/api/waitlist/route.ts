import { waitlistEntries } from "@/db/schema";
import { getDb } from "@/db/client";

interface WaitlistRequest {
  email?: unknown;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: WaitlistRequest;

  try {
    payload = (await request.json()) as WaitlistRequest;
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (typeof payload.email !== "string" || !emailPattern.test(payload.email)) {
    return Response.json(
      { message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const email = payload.email.trim().toLowerCase();

  try {
    await getDb()
      .insert(waitlistEntries)
      .values({
        email,
        source: "tranqli-waitlist",
      })
      .onConflictDoNothing({ target: waitlistEntries.email });
  } catch (error) {
    console.error("waitlist insert failed", error);

    return Response.json(
      { message: "We could not save your email. Please try again." },
      { status: 502 },
    );
  }

  return Response.json(
    { message: "You're on the list. We'll be in touch soon." },
    { status: 201 },
  );
}
