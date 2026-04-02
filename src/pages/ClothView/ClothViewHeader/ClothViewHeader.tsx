import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/func";

interface Props {
  clothId: string;
  clothName: string;
  clothDescription: string | null;
  createdAt: string;
  lang: "fr" | "en";
  publishedOnLabel: string;
  authorLabel: string;
  editClothLabel: string;
  deleteClothLabel: string;
  hideDescriptionLabel: string;
  aboutThisClothLabel: string;
  noDescriptionLabel: string;
  descriptionOpen: boolean;
  onToggleDescription: () => void;
  onDelete: () => void;
}

const ClothViewHeader = ({
  clothId,
  clothName,
  clothDescription,
  createdAt,
  lang,
  publishedOnLabel,
  authorLabel,
  editClothLabel,
  deleteClothLabel,
  hideDescriptionLabel,
  aboutThisClothLabel,
  noDescriptionLabel,
  descriptionOpen,
  onToggleDescription,
  onDelete,
}: Props) => (
  <div className="inline-flex shrink-0 flex-col border-b border-gray-100 bg-white px-10 py-6 dark:border-zinc-800 dark:bg-zinc-950">
    <h1 className="text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
      {clothName}
    </h1>
    <div className="mt-3 flex items-center gap-3 text-m text-zinc-400 dark:text-zinc-500">
      <span>{`${publishedOnLabel} ${formatDate(createdAt, lang)}`}</span>
      <span>·</span>
      <span>{authorLabel}</span>
    </div>

    <div className="mt-4 flex flex-wrap gap-3">
      <Link
        to={`/cloth/${clothId}/edit`}
        className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
      >
        {editClothLabel}
      </Link>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center rounded-full border border-red-300 bg-red px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:border-red-400 hover:text-red-950 dark:border-red-700 dark:bg-red-900 dark:text-red-200 dark:hover:border-red-600 dark:hover:text-red-100"
      >
        {deleteClothLabel}
      </button>
    </div>

    <div className="shrink-0 border-b border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <button
        onClick={onToggleDescription}
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        {descriptionOpen ? hideDescriptionLabel : aboutThisClothLabel}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${descriptionOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <div
      className={`overflow-hidden transition-all duration-300 ${descriptionOpen ? "max-h-48 mt-4" : "max-h-0"}`}
    >
      <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {clothDescription || noDescriptionLabel}
        </p>
      </div>
    </div>
  </div>
);

export default ClothViewHeader;
