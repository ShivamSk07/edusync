import { Check, Globe2, Sparkles, X } from "lucide-react";
import {
  SUPPORTED_LANGUAGES,
  useI18n,
  type SupportedLanguage,
} from "@/lib/i18n";
import { toast } from "sonner";

export function LanguageModal() {
  const { language, setLanguage, isModalOpen, closeLanguageModal, t } = useI18n();

  if (!isModalOpen) return null;

  function selectLang(code: SupportedLanguage, name: string) {
    setLanguage(code);
    toast.success(`Language set to ${name}!`);
    closeLanguageModal();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeLanguageModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Globe2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                {t("lang_modal.title", "Choose Your Preferred Language")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t(
                  "lang_modal.subtitle",
                  "Select your language for curriculum, dashboard & AI voice assistance."
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLanguageModal}
            className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => selectLang(item.code, item.nativeName)}
                className={`group flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border bg-background hover:border-primary/40 hover:bg-muted/50 text-foreground"
                }`}
              >
                <div>
                  <p className="font-display text-sm font-bold text-foreground group-hover:text-primary">
                    {item.nativeName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{item.name}</p>
                </div>
                {isSelected && (
                  <div className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-center sm:text-left">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {t("lang_modal.change_anytime", "Change anytime from navigation or settings.")}
          </span>
          <button
            type="button"
            onClick={closeLanguageModal}
            className="w-full sm:w-auto rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
          >
            {t("lang_modal.confirm", "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
