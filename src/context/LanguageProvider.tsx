import { type PropsWithChildren, useMemo, useState } from "react";
import type { AppLang } from "../i18n/cloth";
import LanguageContext, {
  type LanguageContextValue,
} from "./languageContext";

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [lang, setLang] = useState<AppLang>("fr");

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
