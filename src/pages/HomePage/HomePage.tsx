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
  Culture:     "bg-rose-50 text-rose-700",
  Langue:      "bg-blue-50 text-blue-700",
  Business:    "bg-emerald-50 text-emerald-700",
  Mode:        "bg-pink-50 text-pink-700",
  Technologie: "bg-cyan-50 text-cyan-700",
};

interface Props {
  lang: 'fr' | 'en';
}

const Home = ({ lang }: Props) => {
  const [graphs, setGraphs] = useState<IGraphSummary[]>([]);
  const [filtered, setFiltered] = useState<IGraphSummary[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [loading, setLoading] = useState(true);
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
    setFiltered(result);
  }, [activeCategory, graphs]);

  const suggested = graphs.slice(0, 4);

  return (
    <div className="px-6 flex gap-12 pt-8 pb-20">

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
  );
};

export default Home;