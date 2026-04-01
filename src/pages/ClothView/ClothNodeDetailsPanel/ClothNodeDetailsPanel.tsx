import type { IClothDetail, IClothNode } from "../../../types/cloth";
import { getClothNodeColor } from "../../../utils/clothChart";
import { getPropertyDisplayValue } from "../../../utils/clothForm";

interface Props {
  cloth: IClothDetail;
  selectedNode: IClothNode;
  informationLabel: string;
  relationshipsLabel: string;
  onClose: () => void;
  onSelectNode: (nodeId: string | null) => void;
}

const ClothNodeDetailsPanel = ({
  cloth,
  selectedNode,
  informationLabel,
  relationshipsLabel,
  onClose,
  onSelectNode,
}: Props) => (
  <aside className="shrink-0 bg-white border-l border-gray-200 overflow-y-auto position-absolute w-80">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <span
          className="inline-block text-xs font-medium px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: getClothNodeColor(selectedNode.type) }}
        >
          {selectedNode.type}
        </span>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <h2 className="text-xl font-bold text-zinc-900 mb-6">
        {selectedNode.label}
      </h2>

      {selectedNode.properties.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            {informationLabel}
          </h3>
          <div className="flex flex-col gap-3">
            {selectedNode.properties.map((prop) => (
              <div key={prop.name} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-zinc-400 capitalize">
                  {prop.name.replaceAll("_", " ")}
                </span>
                <span className="text-sm text-zinc-900 leading-relaxed">
                  {getPropertyDisplayValue(prop, cloth.nodes) || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedNode.properties.length > 0 && (
        <div className="border-t border-gray-100 mb-6" />
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          {relationshipsLabel}
        </h3>
        <div className="flex flex-col gap-2">
          {cloth.relationships
            .filter(
              (relationship) =>
                relationship.fromId === selectedNode.id ||
                relationship.toId === selectedNode.id,
            )
            .map((relationship) => {
              const isFrom = relationship.fromId === selectedNode.id;
              const otherId = isFrom ? relationship.toId : relationship.fromId;
              const otherNode = cloth.nodes.find((node) => node.id === otherId);

              return (
                <div
                  key={relationship.id}
                  onClick={() => onSelectNode(otherId)}
                  className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl text-sm cursor-pointer hover:bg-zinc-100 transition-colors"
                >
                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${isFrom ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
                  >
                    {isFrom ? "→" : "←"}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-zinc-400 text-xs truncate">
                      {relationship.type}
                    </span>
                    <span className="text-zinc-900 font-medium truncate">
                      {otherNode?.label}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  </aside>
);

export default ClothNodeDetailsPanel;
