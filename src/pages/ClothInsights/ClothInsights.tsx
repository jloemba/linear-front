import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCanvasInsights } from "../../api/analytics/analyticsApi";
import useLanguage from "../../hooks/useLanguage/useLanguage";
import { getClothMessages } from "../../i18n/cloth";
import type { IInsightResult } from "../../types/analytics";

const formatCount = (value: number, lang: "fr" | "en") =>
  new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US").format(value);

const formatInsightDate = (value: string, lang: "fr" | "en") => {
  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const ClothInsights = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const { common, insights } = getClothMessages(lang);
  const [data, setData] = useState<IInsightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);


  // // Todo : À mettre dans un hook pour séparer la logique de données et de présentation + rendre le composant plus générique pour d'autres types d'insights
  // useEffect(() => {
  //   if (!id) {
  //     setLoading(false);
  //     setHasError(true);
  //     return;
  //   }

  //   setLoading(true);
  //   setHasError(false);
  //   // Mettre cette logique de chargement dans un hook pour séparer la logique de données et de présentation + rendre le composant plus générique pour d'autres types d'insights
  //   fetchCanvasInsights(id)
  //     .then(setData)
  //     .catch(() => {
  //       setHasError(true);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [id,setLoading,setHasError,setData]);

    // Todo : À mettre dans un hook pour séparer la logique de données et de présentation + rendre le composant plus générique pour d'autres types d'insights
  useEffect(() => {
    if (!id) return;

    let ignore = false; // Flag pour ignorer le résultat si nécessaire

    const fetchData = async () => {
      try {
        setLoading(true);
            // Mettre cette logique de chargement dans un hook pour séparer la logique de données et de présentation + rendre le composant plus générique pour d'autres types d'insights
        const result = await fetchCanvasInsights(id);
        
        if (!ignore) { // On ne met à jour l'état que si l'effet est toujours valide
          setData(result);
        }
      } catch (e) {
        // Todo : éviter de rendre obligatoire l'objet error dans le catch pour pouvoir différencier les types d'erreurs (ex: 404 vs 500) et afficher des messages d'erreur plus précis en fonction du type d'erreur
        console.error(e);
        if (!ignore) setHasError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    // Fonction de nettoyage (cleanup)
    return () => {
      ignore = true;
    };
  }, [id]);
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
          <span className="text-sm">{common.loading}</span>
        </div>
      </div>
    );
  }

  if (hasError || !data) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to={id ? `/cloth/${id}` : "/"}
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {insights.backToCanvas}
        </Link>
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {insights.loadError}
        </div>
      </div>
    );
  }

  // Todo: mettre ces stats dans un hook pour séparer la logique de présentation et de données + rendre le composant plus générique pour réutiliser ces cards de stats dans d'autres pages
  const stats = [
    { label: insights.totalViews, value: data.totalViews },
    { label: insights.uniqueViews, value: data.uniqueViews },
    { label: insights.totalNodeClicks, value: data.totalNodeClicks },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <Link
          to={`/cloth/${data.canvasId}`}
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {insights.backToCanvas}
        </Link>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">
            {insights.pageEyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            {data.canvasName}
          </h1>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            <p className="mt-3 text-4xl font-semibold text-zinc-950 dark:text-zinc-50">
              {formatCount(stat.value, lang)}
            </p>
          </article>
        ))}
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                {insights.viewsOverTime}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {insights.viewsOverTimeHint}
              </p>
            </div>
          </div>

          {data.viewsOverTime.length === 0 ? (
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              {insights.noViewsData}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {data.viewsOverTime.map((entry) => {
                const maxCount = Math.max(...data.viewsOverTime.map((item) => item.count), 1);
                const width = Math.max((entry.count / maxCount) * 100, entry.count > 0 ? 8 : 0);
                return (
                  <div key={entry.date} className="space-y-2">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300">
                        {formatInsightDate(entry.date, lang)}
                      </span>
                      <span className="font-medium text-zinc-950 dark:text-zinc-50">
                        {formatCount(entry.count, lang)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-2 rounded-full bg-zinc-900 transition-[width] duration-300 dark:bg-zinc-100"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            {insights.topNodes}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {insights.topNodesHint}
          </p>

          {data.topNodes.length === 0 ? (
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              {insights.noNodeData}
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {data.topNodes.map((node, index) => (
                <article
                  key={node.nodeId}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/70"
                >
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                      #{index + 1}
                    </p>
                    <p className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">
                      {node.nodeLabel}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    {formatCount(node.clicks, lang)} {insights.clicksSuffix}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ClothInsights;
