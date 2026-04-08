import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import type { AppLang } from "../../i18n/cloth";
import LanguageContext, {
  type LanguageContextValue,
} from "./languageContext";

const STORAGE_KEY = "knovia-lang";

const getInitialLang = (): AppLang => {
  if (typeof window === "undefined") {
    return "fr";
  }

  const storedLang = window.localStorage.getItem(STORAGE_KEY);
  if (storedLang === "fr" || storedLang === "en") {
    return storedLang;
  }

  return "fr";
};

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [lang, setLang] = useState<AppLang>(getInitialLang());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      toggleLang: () =>
        setLang((current) => (current === "fr" ? "en" : "fr")),
    }),
    [lang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

