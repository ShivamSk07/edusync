import { createServerFn } from "@tanstack/react-start";
import { getDatabase } from "./database";

export const testDatabaseConnection = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const sql = getDatabase();

    const result = await sql`
      SELECT NOW() AS current_time
    `;

    return {
      success: true,
      message: "Neon database connection successful",
      time: result[0]?.['current_time']?? null,
    };
  } catch (error) {
    console.error("Database connection test failed:", error);

    return {
      success: false,
      message: "Neon database connection failed",
    };
  }
});