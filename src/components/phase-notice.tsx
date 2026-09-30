import { Link } from "@tanstack/react-router";
import { Hammer } from "lucide-react";

export function PhaseNotice({ feature, detail }: { feature: string; detail: string }) {
  return (
    <div className="surface-card mx-auto max-w-xl p-8 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
        <Hammer className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{feature} is being built next</h2>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
