import { useState } from "react";

interface HeaderAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outlined";
}

interface Props {
  lang: "fr" | "en";
  onToggleLang: () => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  title?: string;
  onBack?: () => void;
  onToggleSidebar?: () => void;
  actions?: HeaderAction[];
}

const Header = ({
  lang,
  onToggleLang,
  onSearch,
  showSearch = false,
  title,
  onBack,
  onToggleSidebar,
  actions = [],
}: Props) => {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full max-w-7xl h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
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
                className="text-zinc-500 hover:text-zinc-900 transition-colors text-sm"
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
              <span className="text-zinc-900 font-semibold text-lg tracking-tight">
                Knoyeba
              </span>
            </div>
          )}

          {title && (
            <h1 className="text-sm font-semibold text-zinc-900 truncate max-w-xs">
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
                className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-zinc-900 placeholder-gray-400 focus:outline-none focus:border-zinc-400 transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 shrink-0">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`text-sm font-medium transition-colors ${
                action.variant === "outlined"
                  ? "border border-zinc-200 text-zinc-700 px-4 py-1.5 rounded-full hover:bg-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {action.label}
            </button>
          ))}

          {/* <button
            onClick={onToggleLang}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
