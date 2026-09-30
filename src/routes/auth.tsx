import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (result.error) {
          if (result.error) {
  setMessage(
    result.error.message ?? "Authentication failed. Please try again.",
  );
}
        } else {
          setMessage("Account created successfully.");
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
         if (result.error) {
  setMessage(
    result.error.message ?? "Authentication failed. Please try again.",
  );
}
        } else {
          setMessage("Signed in successfully.");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title={mode === "signin" ? "Welcome back" : "Create your EdSync account"}
      description="Securely access your personalized learning space"
    >
      <div className="mx-auto max-w-md">
        <div className="surface-card p-6">
          <div className="flex gap-2 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setMessage("");
              }}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                mode === "signin" ? "bg-background shadow-sm" : ""
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setMessage("");
              }}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                mode === "signup" ? "bg-background shadow-sm" : ""
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="At least 8 characters"
              />
            </div>

            {message && (
              <p className="rounded-lg bg-muted px-3 py-2 text-sm">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}