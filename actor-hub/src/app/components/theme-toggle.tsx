import { Moon, Sun, Monitor, ChevronDown, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/language-context";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 rounded-lg bg-accent w-10 h-10 animate-pulse" />;
  }

  const themes = [
    { value: "light", label: t("lightMode"), icon: Sun },
    { value: "dark", label: t("darkMode"), icon: Moon },
    { value: "system", label: t("systemMode"), icon: Monitor },
  ];

  const currentTheme = themes.find((thm) => thm.value === theme) || themes[0];
  const Icon = currentTheme.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 hover:bg-accent rounded-lg flex items-center gap-2"
        title={t("theme")}
      >
        <Icon className="w-5 h-5" />
        <ChevronDown className="w-4 h-4 hidden md:inline" />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
            {themes.map((themeOption) => {
              const ThemeIcon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors ${
                    theme === themeOption.value ? "bg-accent" : ""
                  }`}
                >
                  <ThemeIcon className="w-5 h-5" />
                  <span className="text-sm flex-1 text-left">{themeOption.label}</span>
                  {theme === themeOption.value && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
