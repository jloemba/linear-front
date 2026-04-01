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
  hideDescriptionLabel: string;
  aboutThisClothLabel: string;
  noDescriptionLabel: string;
  descriptionOpen: boolean;
  onToggleDescription: () => void;
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
  hideDescriptionLabel,
  aboutThisClothLabel,
  noDescriptionLabel,
  descriptionOpen,
  onToggleDescription,
}: Props) => (
  <div className="shrink-0 bg-white border-b border-gray-100 px-10 py-6 inline-flex flex-col">
    <h1 className="text-3xl font-bold text-zinc-900 leading-tight">
      {clothName}
    </h1>
    <div className="flex items-center gap-3 mt-3 text-m text-zinc-400">
      <span>{`${publishedOnLabel} ${formatDate(createdAt, lang)}`}</span>
      <span>·</span>
      <span>{authorLabel}</span>
    </div>

    <div className="mt-4">
      <Link
        to={`/cloth/${clothId}/edit`}
        className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950"
      >
        {editClothLabel}
      </Link>
    </div>

    <div className="shrink-0 bg-white border-b border-gray-100">
      <button
        onClick={onToggleDescription}
        className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors mt-2"
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
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">
          {clothDescription || noDescriptionLabel}
        </p>
      </div>
    </div>
  </div>
);

export default ClothViewHeader;
