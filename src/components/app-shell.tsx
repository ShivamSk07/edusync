import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
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
  Code2,
  Sparkles,
  ArrowLeft,
  LogOut,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { useConnectivity } from "@/hooks/use-connectivity";
import { resetAll, useStudent } from "@/lib/student-store";
import { useI18n } from "@/lib/i18n";
import { LanguageModal } from "@/components/language-modal";
import { toast } from "sonner";

function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
    >
      {resolved === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
    </button>
  );
}

function ConnectivityPill() {
  const { status, hydrated } = useConnectivity();
  const { t } = useI18n();
  if (!hydrated) return null;
  const online = status === "online";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold shadow-xs transition-all",
        online
          ? "border border-success/30 bg-success/15 text-success"
          : "border border-warning/30 bg-warning/20 text-warning-foreground",
      )}
    >
      {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">
        {online ? t("shell.online", "Portal Online") : t("shell.offline_ready", "Offline Ready")}
      </span>
      <span className="sm:hidden">{online ? "Live" : "Offline"}</span>
    </span>
  );
}

function LanguagePill() {
  const { currentLangObj, openLanguageModal, t } = useI18n();
  return (
    <button
      type="button"
      onClick={openLanguageModal}
      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-xs font-bold text-foreground hover:border-primary/50 hover:bg-muted transition"
      title={t("shell.lang_select", "Select Language")}
    >
      <Globe2 className="h-3.5 w-3.5 text-primary" />
      <span className="truncate max-w-[80px] sm:max-w-none">{currentLangObj?.nativeName ?? "English"}</span>
    </button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();

  const NAV = [
    { to: "/dashboard", label: t("nav.dashboard", "Academic Dashboard"), icon: LayoutDashboard },
    { to: "/study", label: t("nav.study", "Curriculum & Syllabus"), icon: BookOpen },
    { to: "/ai-study-buddy", label: t("nav.ai", "Academic AI Tutor"), icon: Bot, highlight: true },
    { to: "/resources", label: t("nav.resources", "Offline Resource Vault"), icon: Library },
    { to: "/opportunities", label: t("nav.opportunities", "Scholarships & Exams"), icon: Briefcase },
    { to: "/career", label: t("nav.career", "Career Roadmaps"), icon: Compass },
    { to: "/mentorship", label: t("nav.mentorship", "Faculty Mentorship"), icon: UserRound },
    { to: "/progress", label: t("nav.progress", "Learning Analytics"), icon: TrendingUp },
    { to: "/profile", label: t("nav.profile", "Student Profile & Settings"), icon: User },
  ] as const;

  return (
    <nav className="flex flex-col gap-1.5">
      {NAV.map(({ to, label, icon: Icon, ...item }) => {
        const active = pathname === to;
        const highlight = "highlight" in item && item.highlight;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
              active
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", active ? "text-primary-foreground" : "")} />
              <span className="truncate">{label}</span>
            </div>
            {highlight && !active && (
              <span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                <Sparkles className="h-2.5 w-2.5" /> AI
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function OfficialWordmark() {
  return (
    <Link to="/dashboard" className="flex min-w-0 items-center gap-3 group">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-primary to-teal-500 font-display text-sm font-extrabold text-primary-foreground shadow-sm shadow-primary/30">
        ES
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-display text-lg font-bold tracking-tight text-foreground">
            EdSync
          </span>
          <span className="rounded bg-primary/15 px-1.5 py-0.2 text-[9px] font-extrabold text-primary">
            GOVT
          </span>
        </div>
        <span className="truncate text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
          National Academic Portal
        </span>
      </div>
    </Link>
  );
}

export function AppShell({
  title,
  description,
  children,
  requireAuth = true,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  requireAuth?: boolean;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { hydrated, profile } = useStudent();
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Auth Guard: If requireAuth is true and user has no profile, redirect to onboarding/auth
  useEffect(() => {
    if (requireAuth && hydrated && !profile && pathname !== "/auth" && pathname !== "/" && pathname !== "/onboarding") {
      toast.info("Please complete your student profile first.");
      void navigate({ to: "/onboarding" });
    }
  }, [requireAuth, hydrated, profile, pathname, navigate]);

  function handleLogout() {
    resetAll();
    toast.success("Signed out successfully.");
    void navigate({ to: "/" });
  }

  function handleGoBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      void navigate({ to: "/dashboard" });
    }
  }

  const isHomeOrDashboard = pathname === "/dashboard" || pathname === "/";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <LanguageModal />

      <div className="mx-auto flex w-full max-w-[1440px]">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/95 p-4 backdrop-blur-md lg:flex">
          <OfficialWordmark />

          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[10px] font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t("shell.govt_accreditation", "Accredited to Official Curriculum")}</span>
          </div>

          <div className="mt-5 flex-1 overflow-y-auto pr-1">
            <NavLinks />
          </div>

          {/* Student Pass Card & Sign Out */}
          <div className="mt-auto space-y-3 pt-4 border-t border-sidebar-border">
            {profile && (
              <div className="rounded-2xl border border-border bg-card p-3.5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground font-bold text-xs">
                      {profile.name[0]?.toUpperCase() || "S"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-foreground">{profile.name}</p>
                      <p className="truncate text-[10px] font-medium text-muted-foreground">
                        Class {profile.classLevel} · {profile.board.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    title={t("shell.sign_out", "Sign Out")}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Institutional Attribution */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-foreground text-[11px]">EdSync Platform</span>
              </div>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                v2.0
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="min-w-0 flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* Dedicated Back Navigation Button */}
              {!isHomeOrDashboard && (
                <button
                  type="button"
                  onClick={handleGoBack}
                  aria-label="Go back"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground hover:border-primary/40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("shell.back", "Back")}</span>
                </button>
              )}

              <div className="min-w-0">
                <h1 className="truncate font-display text-base font-bold sm:text-lg text-foreground">{title}</h1>
                {description && (
                  <p className="hidden truncate text-xs text-muted-foreground sm:block">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <LanguagePill />
              <ConnectivityPill />
              <ThemeToggle />

              {profile && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/30 transition"
                  title={t("shell.sign_out", "Sign Out")}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{t("shell.sign_out", "Sign Out")}</span>
                </button>
              )}
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

          <footer className="border-t border-border bg-card/40 px-6 py-4 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} EdSync National Academic Portal.</span>
            <span className="font-semibold text-foreground">
              Official Indian Curriculum Repository (CBSE / ICSE / State Boards).
            </span>
          </footer>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-76 flex-col bg-sidebar p-5 shadow-2xl border-r border-sidebar-border">
            <div className="flex items-center justify-between gap-2">
              <OfficialWordmark />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setMenuOpen(false)} />
            </div>

            <div className="mt-auto pt-4 border-t border-sidebar-border space-y-3">
              {profile && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 py-2.5 text-xs font-bold text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("shell.sign_out", "Sign Out")}</span>
                </button>
              )}
              <p className="text-center text-xs text-muted-foreground">National Academic Curriculum Portal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
