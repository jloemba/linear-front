import { useEffect, useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguageHook/useLanguage";
import { fetchAllCloths } from "../../api/cloth/clothApi";
import type { IClothSummary } from "../../types/cloth";
import { CATEGORY_COLORS } from "../../utils/const";
import useClothCategory from "../../hooks/useClothCategoryHook/useClothCategory";
import { formatDate, truncateText } from "../../utils/func";
import ProtectedCreateButton from './protectedCreateButton';
import { getClothMessages } from "../../i18n/cloth";

const Home = () => {
  const { lang } = useLanguage();
    const { home } = getClothMessages(lang);
  
  const [cloths, setCloths] = useState<IClothSummary[]>([]);
  const [activeCategory] = useState("Tout");
  const [loading, setLoading] = useState(true);
  const { getCategoryFromName } = useClothCategory();

  useEffect(() => {
    fetchAllCloths()
      .then((data) => {
        const list: IClothSummary[] = data.graphs ?? [];
        setCloths(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "Tout") {
      return cloths;
    }

    return cloths.filter(
      (g) => getCategoryFromName(g.name) === activeCategory,
    );
  }, [activeCategory, cloths, getCategoryFromName]);

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
              <div className="mb-3 h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="mb-2 h-5 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-4 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div className="h-16 w-24 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  } else if (filtered.length === 0) {
    content = (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-medium text-zinc-500 dark:text-zinc-300">
          {home.noCloths}
        </p>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800">
        {filtered.map((cloth) => {
          const category = getCategoryFromName(cloth.name);
          return (
            <article
              key={cloth.id}
              className="flex items-start gap-6 py-8 cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${CATEGORY_COLORS[category]}`}
                >
                  {category}
                </span>
                <h2 className="mb-2 text-xl font-bold leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                  <a href={`/cloth/${cloth.id}`} className="text-inherit no-underline">
                    {cloth.name}
                  </a>
                </h2>
                <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{ellipsedText(cloth.description)}</p>
                <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                  <span>
                    {lang === "fr"
                      ? `Publié le ${formatDate(cloth.createdAt, lang)}`
                      : `Posted on ${formatDate(cloth.createdAt, lang)}`}
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
    <div className="px-4 pt-8 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1120px] justify-center">
        <main className="min-w-0 w-full max-w-[720px]">
          <div className="mb-8 flex items-center justify-between gap-6 border-b border-gray-100 dark:border-zinc-800">
            <button className="border-b-2 border-zinc-300 pb-3 text-sm font-medium text-zinc-700 transition-colors dark:border-zinc-600 dark:text-zinc-100">
              🌐 {home.feedHeading}
            </button>

            <ProtectedCreateButton />
          </div>

          {content}
        </main>
      </div>
    </div>
  );
};

export default Home;
