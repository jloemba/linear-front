import type { IGraphSummary } from '../../types/graph';

interface Props {
  graph: IGraphSummary;
  onClick: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Musique':     'bg-violet-50 text-violet-700',
  'Histoire':    'bg-amber-50 text-amber-700',
  'Culture':     'bg-rose-50 text-rose-700',
  'Langue':      'bg-blue-50 text-blue-700',
  'Business':    'bg-emerald-50 text-emerald-700',
  'Mode':        'bg-pink-50 text-pink-700',
  'Technologie': 'bg-cyan-50 text-cyan-700',
};

const getCategoryFromName = (name: string): string => {
  if (name.toLowerCase().includes('musique') || name.toLowerCase().includes('rap') || name.toLowerCase().includes('label')) return 'Musique';
  if (name.toLowerCase().includes('migration') || name.toLowerCase().includes('royaume')) return 'Histoire';
  if (name.toLowerCase().includes('langue')) return 'Langue';
  if (name.toLowerCase().includes('disney') || name.toLowerCase().includes('filiale')) return 'Business';
  if (name.toLowerCase().includes('mode') || name.toLowerCase().includes('streetwear')) return 'Mode';
  if (name.toLowerCase().includes('réseau') || name.toLowerCase().includes('social')) return 'Technologie';
  return 'Culture';
};

const GraphCard = ({ graph, onClick }: Props) => {
  const category = getCategoryFromName(graph.name);
  const colorClass = CATEGORY_COLORS[category] || 'bg-gray-50 text-gray-700';

  return (
    <div
      onClick={() => onClick(graph.id)}
      className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-zinc-300 transition-all duration-200 group"
    >
      {/* Category badge */}
      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${colorClass}`}>
        {category}
      </span>

      {/* Title */}
      <h3 className="text-zinc-900 font-semibold text-lg leading-snug group-hover:text-zinc-600 transition-colors">
        {graph.name}
      </h3>

      {/* Arrow */}
      <div className="mt-4 flex items-center gap-1 text-zinc-400 text-sm group-hover:text-zinc-600 transition-colors">
        <span>Explorer</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default GraphCard;