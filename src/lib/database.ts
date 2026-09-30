import { neon } from "@neondatabase/serverless";
import { createServerOnlyFn } from "@tanstack/react-start";

export const getDatabase = createServerOnlyFn(() => {
  const env = process.env as Record<string, string | undefined>;
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  return neon(databaseUrl);
});