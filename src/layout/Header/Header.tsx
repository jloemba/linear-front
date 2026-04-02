import { useState } from "react";
import { getClothMessages } from "../../i18n/cloth";
import useLanguage from "../../hooks/useLanguage/useLanguage";
import useTheme from "../../hooks/useTheme/useTheme";

interface HeaderAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outlined";
}

interface Props {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  title?: string;
  onBack?: () => void;
  onToggleSidebar?: () => void;
  actions?: HeaderAction[];
}

const Header = ({
  onSearch,
  showSearch = false,
  title,
  onBack,
  onToggleSidebar,
  actions = [],
}: Props) => {
  const [query, setQuery] = useState("");
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { common } = getClothMessages(lang);
  const themeLabel =
    theme === "dark" ? common.switchToLightMode : common.switchToDarkMode;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="h-14 w-full max-w-7xl items-center justify-between gap-6 px-4 flex sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {onBack && (
            <>
              <button
                onClick={onBack}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {lang === "fr" ? "Retour" : "Back"}
              </button>
              <div className="h-4 w-px bg-gray-200" />
            </>
          )}

          {!onBack && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">K</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Knoyeba
              </span>
            </div>
          )}

          {title && (
            <h1 className="max-w-xs truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h1>
          )}
        </div>

        {showSearch && onSearch && (
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder={
                  lang === "fr"
                    ? "Rechercher une toile..."
                    : "Search a canvas..."
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-sm text-zinc-900 placeholder-gray-400 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-600"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === "dark" ? "☀︎" : "☾"}
          </button>

          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`text-sm font-medium transition-colors ${
                action.variant === "outlined"
                  ? "rounded-full border border-zinc-200 px-4 py-1.5 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {action.label}
            </button>
          ))}

          <button
            onClick={toggleLang}
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
