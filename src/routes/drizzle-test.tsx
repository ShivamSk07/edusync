import { createFileRoute } from "@tanstack/react-router";
import { testDrizzleConnection } from "../lib/drizzle-test";

export const Route = createFileRoute("/drizzle-test")({
  loader: async () => {
    return await testDrizzleConnection();
  },
  component: DrizzleTestPage,
});

function DrizzleTestPage() {
  const result = Route.useLoaderData();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>EdSync Drizzle Test</h1>

      <p>{result.message}</p>

      <p>
        Student profiles found: {result.count}
      </p>
    </main>
  );
}