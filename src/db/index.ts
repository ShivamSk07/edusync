import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { createServerOnlyFn } from "@tanstack/react-start";
import * as schema from "./schema";

export const getDrizzle = createServerOnlyFn(() => {
  const env = process.env as Record<string, string | undefined>;
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const sql = neon(databaseUrl);

  return drizzle({
    client: sql,
    schema,
  });
});