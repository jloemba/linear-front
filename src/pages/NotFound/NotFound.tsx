import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage/useLanguage";
import { getClothMessages } from "../../i18n/cloth";

const NotFound = () => {
  const { lang } = useLanguage();
  const { notFound } = getClothMessages(lang);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-white/50 dark:border-zinc-700/50 p-12 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-black bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent mb-4">
            {notFound.errorTitle}
          </h1>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-4">
            {notFound.subErrortitle}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-8">
            {notFound.message}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 font-semibold  text-lg transform hover:-translate-y-1 transition-all duration-300"
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {notFound.home}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
