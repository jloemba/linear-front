import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useLanguage from "../../hooks/useLanguageHook/useLanguage";
import useAuth from "../../hooks/useAuthHook/useAuth";
import Header from "../Header/Header";

const NavigationLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const authActions = [
    ...(isAuthenticated ? [{
      label: lang === 'fr' ? 'Déconnexion' : 'Logout',
      onClick: logout,
      variant: 'outlined' as const,
    }] : [{
      label: lang === 'fr' ? 'Connexion' : 'Login',
      onClick: () => navigate('/login'),
      variant: 'outlined' as const,
    }]),
  ];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950">
      <Header 
        onToggleSidebar={() => setSidebarOpen((current) => !current)}
        actions={authActions}
      />
      <div className="flex">
        <aside
          className={`fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] shrink-0 overflow-hidden border-r border-gray-100 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 ${
            sidebarOpen ? "w-56" : "w-0"
          }`}
        >
          <div className="w-56 overflow-y-auto h-full">
            <nav className="sticky top-14 w-56 p-4">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {lang === "fr" ? "Navigation" : "Browse"}
              </p>
              <ul className="flex flex-col gap-1">
                  <li>
                    <button onClick={() => navigate(`/`)} className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100">
                      {lang === "fr" ? "Accueil" : "Home"}
                    </button>
                  </li>
                    <li>
                    <button onClick={() => navigate(`/`)} className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100">
                      {lang === "fr" ? "Profil" : "Profile"}
                    </button>
                  </li>
      
              </ul>

              <div className="my-4 border-t border-gray-100 dark:border-zinc-800" />

            </nav>
          </div>
        </aside>

        <main
          className={`flex-1 min-w-0 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-56" : "lg:ml-0"
          }`}
        >
          <Outlet context={{ sidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default NavigationLayout;
