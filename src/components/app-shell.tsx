import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Bot,
  Briefcase,
  Compass,
  LayoutDashboard,
  Library,
  Menu,
  Moon,
  Sun,
  TrendingUp,
  User,
  UserRound,
  WifiOff,
  Wifi,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { useConnectivity } from "@/hooks/use-connectivity";
import { useStudent } from "@/lib/student-store";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/study", label: "Study", icon: BookOpen },
  { to: "/ai-study-buddy", label: "AI Study Buddy", icon: Bot },
  { to: "/resources", label: "Resources", icon: Library },
  { to: "/opportunities", label: "Opportunities", icon: Briefcase },
  { to: "/career", label: "Career", icon: Compass },
  { to: "/mentorship", label: "Mentorship", icon: UserRound },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function ConnectivityPill() {
  const { status, hydrated } = useConnectivity();
  if (!hydrated) return null;
  const online = status === "online";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        online ? "bg-success/12 text-success" : "bg-warning/18 text-warning-foreground",
      )}
    >
      {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {online ? "Online" : "Offline"}
    </span>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Wordmark() {
  return (
    <Link to="/dashboard" className="flex min-w-0 items-center gap-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
        ES
      </span>
      <span className="truncate font-display text-lg font-semibold tracking-tight">EdSync</span>
    </Link>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useStudent();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
          <Wordmark />
          <p className="mt-2 text-xs text-muted-foreground">
            Learning shouldn't stop when the internet does.
          </p>
          <div className="mt-6 flex-1">
            <NavLinks />
          </div>
          {profile?.isDemo && (
            <span className="rounded-lg bg-accent/20 px-3 py-2 text-xs font-medium text-accent-foreground">
              Demo mode — sample data
            </span>
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
                {description && (
                  <p className="hidden truncate text-sm text-muted-foreground sm:block">
                    {description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ConnectivityPill />
              <ThemeToggle />
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar p-4">
            <div className="flex items-center justify-between gap-2">
              <Wordmark />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6">
              <NavLinks onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
