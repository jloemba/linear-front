import { useContext } from "react";
import LanguageContext from "../../context/Language/languageContext";

const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
};

export default useLanguage;
