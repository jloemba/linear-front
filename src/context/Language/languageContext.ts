import { createContext } from "react";
import type { AppLang } from "../i18n/cloth";

export interface LanguageContextValue {
  lang: AppLang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export default LanguageContext;
