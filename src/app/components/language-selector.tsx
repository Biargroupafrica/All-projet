import { useLanguage } from "../i18n/language-context";
import type { Language } from "../i18n/translations";

const languages: { code: Language; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" },
  { code: "ru", label: "Русский" },
  { code: "sw", label: "Kiswahili" },
  { code: "pt", label: "Português" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
  { code: "nl", label: "Nederlands" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm outline-none focus:ring-2 focus:ring-ring cursor-pointer"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
