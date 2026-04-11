import { Link, useParams } from "react-router-dom";
import useLanguage from "../../hooks/useLanguageHook/useLanguage";
import { getClothMessages } from "../../i18n/cloth";
import useInsightHook from "../../hooks/useInsightHook/useInsightHook";
import { formatDateDDMMMYYYY } from "../../utils/func";

const ClothInsights = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const { common, insights } = getClothMessages(lang);
  const { loading, hasError, insightData } = useInsightHook(id!);
  const stats = [
    { label: insights.totalViews, value: insightData?.totalViews },
    { label: insights.uniqueViews, value: insightData?.uniqueViews },
    { label: insights.totalNodeClicks, value: insightData?.totalNodeClicks },
  ];

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

  if (hasError || !insightData) {
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <Link
          to={`/cloth/${insightData.canvasId}`}
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {insights.backToCanvas}
        </Link>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">
            {insights.pageEyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            {insightData.canvasName}
          </h1>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-3 text-4xl font-semibold text-zinc-950 dark:text-zinc-50">
              {stat.value}
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

          {insightData.viewsOverTime.length === 0 ? (
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              {insights.noViewsData}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {insightData.viewsOverTime.map((entry) => {
                const maxCount = Math.max(
                  ...insightData.viewsOverTime.map((item) => item.count),
                  1,
                );
                const width = Math.max(
                  (entry.count / maxCount) * 100,
                  entry.count > 0 ? 8 : 0,
                );
                return (
                  <div key={entry.date} className="space-y-2">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300">
                        {formatDateDDMMMYYYY(entry.date, lang)}
                      </span>
                      <span className="font-medium text-zinc-950 dark:text-zinc-50">
                        {entry.count}
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

          {insightData.topNodes.length === 0 ? (
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              {insights.noNodeData}
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {insightData.topNodes.map((node, index) => (
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
                    {node.clicks} {insights.clicksSuffix}
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
