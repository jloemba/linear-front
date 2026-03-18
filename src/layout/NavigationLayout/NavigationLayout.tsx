import { Outlet } from "react-router-dom";

import Header from "../Header/Header";

const NavigationLayout = ({
  sidebarOpen,
  onToggleSidebar,
  lang,
  onToggleLang,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  lang: "fr" | "en";
  onToggleLang: () => void;
}) => {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header
        lang={lang}
        onToggleLang={onToggleLang}
        onToggleSidebar={onToggleSidebar}
      />
      <div className="flex">
        {/* Sidebar globale */}
        <aside
          className={`shrink-0 fixed top-14 left-0 h-[calc(100vh-3.5rem)] border-r border-gray-100 z-20 bg-white transition-all duration-300 overflow-hidden ${
            sidebarOpen ? "w-56" : "w-0"
          }`}
        >
          <div className="w-56 overflow-y-auto h-full">
            <nav className="sticky top-14 w-56 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                {lang === "fr" ? "Navigation" : "Browse"}
              </p>
              <ul className="flex flex-col gap-1">
                {[
                  { icon: "⬡", label: lang === "fr" ? "Accueil" : "Home" },
                  {
                    icon: "✦",
                    label: lang === "fr" ? "En vedette" : "Featured",
                  },
                  {
                    icon: "🔖",
                    label: lang === "fr" ? "Sauvegardés" : "Saved",
                  },
                  {
                    icon: "◎",
                    label: lang === "fr" ? "Mes toiles" : "My canvases",
                  },
                ].map((item) => (
                  <li key={item.label}>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors text-left">
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 my-4" />

              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                {lang === "fr" ? "Catégories" : "Topics"}
              </p>
              <ul className="flex flex-col gap-1">
                {[
                  "Musique",
                  "Histoire",
                  "Langue",
                  "Business",
                  "Mode",
                  "Technologie",
                  "Culture",
                ].map((category) => (
                  <li key={category}>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors text-left">
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <main
          className={`flex-1 min-w-0 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-56" : "lg:ml-0"
          }`}
        >
          <Outlet context={{ lang, sidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default NavigationLayout;
