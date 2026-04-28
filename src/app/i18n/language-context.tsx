import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Language = "fr" | "en" | "ar" | "es" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  fr: {
    dashboard: "Tableau de bord",
    callCenter: "Centre d'Appels",
    smsBulk: "SMS Bulk",
    whatsappBusiness: "WhatsApp Business",
    emailMarketing: "Email Marketing",
    settings: "Paramètres",
    logout: "Déconnexion",
  },
  en: {
    dashboard: "Dashboard",
    callCenter: "Call Center",
    smsBulk: "SMS Bulk",
    whatsappBusiness: "WhatsApp Business",
    emailMarketing: "Email Marketing",
    settings: "Settings",
    logout: "Logout",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("biar-language");
      return (saved as Language) || "fr";
    }
    return "fr";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("biar-language", language);
    }
    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.fr?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
