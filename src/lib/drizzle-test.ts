import { createServerFn } from "@tanstack/react-start";
import { getDrizzle } from "../db";
import { studentProfiles } from "../db/schema";

export const testDrizzleConnection = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const db = getDrizzle();

    const result = await db
      .select()
      .from(studentProfiles)
      .limit(5);

    return {
      success: true,
      message: "Drizzle connection successful",
      count: result.length,
    };
  } catch (error) {
    console.error("Drizzle connection test failed:", error);

    return {
      success: false,
      message: "Drizzle connection failed",
      count: 0,
    };
  }
});