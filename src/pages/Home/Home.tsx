import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllGraphs } from "../../api/graphApi";
import type { IGraphSummary } from "../../types/graph";

const CATEGORIES = ["Tout", "Musique", "Histoire", "Langue", "Business", "Mode", "Technologie", "Culture"];

const getCategoryFromName = (name: string): string => {
  if (name.toLowerCase().includes("musique") || name.toLowerCase().includes("rap") || name.toLowerCase().includes("label")) return "Musique";
  if (name.toLowerCase().includes("migration") || name.toLowerCase().includes("royaume")) return "Histoire";
  if (name.toLowerCase().includes("langue")) return "Langue";
  if (name.toLowerCase().includes("disney") || name.toLowerCase().includes("filiale")) return "Business";
  if (name.toLowerCase().includes("mode") || name.toLowerCase().includes("streetwear")) return "Mode";
  if (name.toLowerCase().includes("réseau") || name.toLowerCase().includes("social") || name.toLowerCase().includes("reseaux")) return "Technologie";
  return "Culture";
};

const CATEGORY_COLORS: Record<string, string> = {
  Musique:     "bg-violet-50 text-violet-700",
  Histoire:    "bg-amber-50 text-amber-700",
  Culture:     "bg-rose-50 text-rose-50 text-rose-700",
  Langue:      "bg-blue-50 text-blue-700",
  Business:    "bg-emerald-50 text-emerald-700",
  Mode:        "bg-pink-50 text-pink-700",
  Technologie: "bg-cyan-50 text-cyan-700",
};

const Home = () => {
  const [graphs, setGraphs] = useState<IGraphSummary[]>([]);
  const [filtered, setFiltered] = useState<IGraphSummary[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllGraphs()
      .then((data) => {
        const list: IGraphSummary[] = data.graphs ?? [];
        setGraphs(list);
        setFiltered(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = graphs;
    if (activeCategory !== "Tout") {
      result = result.filter((g) => getCategoryFromName(g.name) === activeCategory);
    }
    if (search) {
      result = result.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [search, activeCategory, graphs]);

  const suggested = graphs.slice(0, 4);

  return (
    <div className="min-h-screen w-full bg-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="w-full max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="text-zinc-900 font-semibold text-lg tracking-tight">Knovia</span>
          </div>

          <div className="flex-1 max-w-sm">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={lang === "fr" ? "Rechercher une toile..." : "Search a canvas..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-zinc-900 placeholder-gray-400 focus:outline-none focus:border-zinc-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setLang((l) => (l === "fr" ? "en" : "fr"))}
              className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>
            <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              {lang === "fr" ? "Connexion" : "Sign in"}
            </button>
            <button className="text-sm font-medium border border-zinc-200 text-zinc-700 px-4 py-1.5 rounded-full hover:bg-zinc-50 transition-colors">
              {lang === "fr" ? "Commencer" : "Get started"}
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="w-full max-w-7xl mx-auto px-6 flex gap-12 pt-8 pb-20">

        {/* Sidebar gauche */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <nav className="sticky top-20">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
              {lang === "fr" ? "Navigation" : "Browse"}
            </p>
            <ul className="flex flex-col gap-1">
              {[
                { icon: "⬡", label: lang === "fr" ? "Accueil" : "Home" },
                { icon: "✦", label: lang === "fr" ? "En vedette" : "Featured" },
                { icon: "🔖", label: lang === "fr" ? "Sauvegardés" : "Saved" },
                { icon: "◎", label: lang === "fr" ? "Mes toiles" : "My canvases" },
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
              {CATEGORIES.filter((c) => c !== "Tout").map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category === activeCategory ? "Tout" : category)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      activeCategory === category
                        ? "bg-transparent text-zinc-900 font-medium"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Feed central */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-6 border-b border-gray-100 mb-8">
            {["Pour vous", "En vedette"].map((tab) => (
              <button
                key={tab}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === "Pour vous"
                    ? "border-zinc-300 text-zinc-700"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="flex-1">
                    <div className="h-3 bg-zinc-100 rounded w-20 mb-3" />
                    <div className="h-5 bg-zinc-100 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-zinc-100 rounded w-1/2" />
                  </div>
                  <div className="w-24 h-16 bg-zinc-100 rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-zinc-500 font-medium">
                {lang === "fr" ? "Aucune toile trouvée." : "No canvas found."}
              </p>
              <p className="text-zinc-400 text-sm mt-1">
                {lang === "fr" ? "Essaie un autre mot clé." : "Try another keyword."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {filtered.map((graph) => {
                const category = getCategoryFromName(graph.name);
                return (
                  <article
                    key={graph.id}
                    onClick={() => navigate(`/graph/${graph.id}`)}
                    className="flex items-start gap-6 py-8 cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${CATEGORY_COLORS[category]}`}>
                        {category}
                      </span>
                      <h2 className="text-xl font-bold text-zinc-900 leading-snug mb-2 group-hover:text-zinc-600 transition-colors">
                        {graph.name}
                      </h2>
                      <p className="text-sm text-zinc-500 mb-4">
                        {lang === "fr"
                          ? "Explore les connexions et relations qui définissent ce sujet."
                          : "Explore the connections and relationships that define this topic."}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span>🕸️ {lang === "fr" ? "Toile" : "Canvas"}</span>
                        <span>·</span>
                        <span>Knovia</span>
                      </div>
                    </div>

                    <div className={`w-28 h-20 rounded-xl shrink-0 flex items-center justify-center ${CATEGORY_COLORS[category]}`}>
                      <span className="text-3xl">🕸️</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {/* Colonne droite */}
        <aside className="w-72 shrink-0 hidden xl:block">
          <div className="sticky top-20 flex flex-col gap-8">
            <div>
              <p className="text-sm font-semibold text-zinc-900 mb-4">
                {lang === "fr" ? "Toiles en vedette" : "Featured canvases"}
              </p>
              <div className="flex flex-col gap-4">
                {suggested.map((graph, i) => (
                  <div
                    key={graph.id}
                    onClick={() => navigate(`/graph/${graph.id}`)}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <span className="text-lg font-bold text-zinc-200 w-5 shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors leading-snug">
                        {graph.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {getCategoryFromName(graph.name)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-900 mb-4">
                {lang === "fr" ? "Sujets recommandés" : "Recommended topics"}
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter((c) => c !== "Tout").map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category === activeCategory ? "Tout" : category)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      activeCategory === category
                        ? "bg-transparent text-zinc-900 border-zinc-400 font-medium"
                        : "border-gray-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-zinc-300 flex flex-wrap gap-2">
              <span>© 2025 Knovia</span>
              <span>·</span>
              <span>{lang === "fr" ? "Confidentialité" : "Privacy"}</span>
              <span>·</span>
              <span>{lang === "fr" ? "Conditions" : "Terms"}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;