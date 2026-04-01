import { getClothNodeColor } from "../../../utils/clothChart";

interface Props {
  nodeTypes: string[];
  showLegend: boolean;
  hideLegendLabel: string;
  legendLabel: string;
  onToggleLegend: () => void;
}

const ClothViewLegend = ({
  nodeTypes,
  showLegend,
  hideLegendLabel,
  legendLabel,
  onToggleLegend,
}: Props) => (
  <div className="absolute top-3 left-4 z-10">
    <button
      onClick={onToggleLegend}
      className="flex items-center gap-2 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
    >
      <div className="flex gap-1">
        {!showLegend &&
          nodeTypes.slice(0, 3).map((type) => (
            <div
              key={type}
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getClothNodeColor(type) }}
            />
          ))}
      </div>
      {showLegend ? hideLegendLabel : legendLabel}
    </button>

    {showLegend && (
      <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 shadow-sm max-w-xs">
        <div className="flex flex-wrap gap-2">
          {nodeTypes.map((type) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: getClothNodeColor(type) }}
              />
              <span className="text-xs text-zinc-600">{type}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ClothViewLegend;
