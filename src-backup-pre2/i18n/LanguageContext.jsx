import { createContext, useContext, useState, useEffect } from "react";
import { translations, formatPrice, currencyRates } from "../data/translations";

const SUPPORTED_LANGS = ["ES", "EN", "PT"];
const STORAGE_KEY = "bt-language";

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext(null);

const resolve = (lang, key, fallback) => {
  const dict = translations[lang] || translations.ES;
  if (typeof key === "string" && key in dict) return dict[key];
  if (typeof key === "string" && key in translations.ES) return translations.ES[key];
  return fallback !== undefined ? fallback : key;
};

export function LanguageProvider({ children }) {
  const [activeLanguage, setActiveLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    } catch (_) {
      /* localStorage no disponible */
    }
    return "ES";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeLanguage);
    } catch (_) {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = activeLanguage.toLowerCase();
    }
  }, [activeLanguage]);

  // `t` es a la vez indexable (t.inicio) y callable (t("inicio")) para no romper
  // el código existente que usaba translations[activeLanguage].
  // El target debe ser una función para que el Proxy sea callable (t("key")).
  const t = new Proxy(
    function () {},
    {
      get: (_, key) => resolve(activeLanguage, key),
      apply: (_, __, args) => resolve(activeLanguage, args[0], args[1]),
    }
  );

  const value = {
    activeLanguage,
    setActiveLanguage,
    t,
    translations,
    formatPrice,
    currencyRates,
    supportedLangs: SUPPORTED_LANGS,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation debe usarse dentro de <LanguageProvider>");
  }
  return ctx;
}
