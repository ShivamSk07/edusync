import { createFileRoute } from "@tanstack/react-router";
import { testDatabaseConnection } from "../lib/db-test";

export const Route = createFileRoute("/db-test")({
  loader: async () => {
    return await testDatabaseConnection();
  },
  component: DatabaseTestPage,
});

function DatabaseTestPage() {
  const result = Route.useLoaderData();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>EdSync Database Test</h1>

      <p>{result.message}</p>

      {result.success && (
        <p>Neon server time: {String(result.time)}</p>
      )}
    </main>
  );
}