import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllGraphs } from "../../api/graphApi";
import type { IGraphSummary } from "../../types/graph";
import { CATEGORIES, CATEGORY_COLORS } from "../../utils/const";
import useClothCategory from "../../hooks/useClothCategory/useClothCategory";
import { formatDate, truncateText } from "../../utils/func";

interface Props {
  lang: "fr" | "en";
}

const Home = ({ lang }: Props) => {
  const [graphs, setGraphs] = useState<IGraphSummary[]>([]);
  const [filtered, setFiltered] = useState<IGraphSummary[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getCategoryFromName } = useClothCategory();

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
      result = result.filter(
        (g) => getCategoryFromName(g.name) === activeCategory,
      );
    }
    setFiltered(result);
  }, [activeCategory, graphs]);

  const suggested = graphs.slice(0, 4);

  let content;
  const ellipsedText = (description: string|null) => {
    return description && description.length > 150 ? `${truncateText(description, 150)}...` : description || "Aucune description disponible.";
  };


  if (loading) {
    content = (
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
    );
  } else if (filtered.length === 0) {
    content = (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-zinc-500 font-medium">
          {lang === "fr" ? "Aucune toile trouvée." : "No canvas found."}
        </p>
        <p className="text-zinc-400 text-sm mt-1">
          {lang === "fr" ? "Essaie un autre mot clé." : "Try another keyword."}
        </p>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col divide-y divide-gray-100">
        {filtered.map((graph) => {
          const category = getCategoryFromName(graph.name);
          return (
            <article
              key={graph.id}
              className="flex items-start gap-6 py-8 cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${CATEGORY_COLORS[category]}`}
                >
                  {category}
                </span>
                <h2 className="text-xl font-bold text-zinc-900 leading-snug mb-2 group-hover:text-zinc-600 transition-colors">
                  <a href={`/graph/${graph.id}`} className="text-inherit no-underline">
                    {graph.name}
                  </a>
                </h2>
                <p className="text-sm text-zinc-500 mb-4">{ellipsedText(graph.description)}</p>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>
                    {lang === "fr"
                      ? `Publié le ${formatDate(graph.createdAt, lang)}`
                      : `Posted on ${formatDate(graph.createdAt, lang)}`}
                  </span>
                  <span>·</span>
                  <span>Auteur</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="px-6 flex gap-12 pt-8 pb-20">
      <main className="flex-1 min-w-0">
        <div className="flex items-center gap-6 border-b border-gray-100 mb-8">
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors  border-zinc-300 text-zinc-700`}
          >
          🌐 Ton fil
          </button>
        </div>

        {content}
      </main>
    </div>
  );
};

export default Home;
