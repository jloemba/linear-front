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
  <aside className="position-absolute w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
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
          className="text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
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

      <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">
        {selectedNode.label}
      </h2>

      {selectedNode.properties.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {informationLabel}
          </h3>
          <div className="flex flex-col gap-3">
            {selectedNode.properties.map((prop) => (
              <div key={prop.name} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium capitalize text-zinc-400 dark:text-zinc-500">
                  {prop.name.replaceAll("_", " ")}
                </span>
                <span className="text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
                  {getPropertyDisplayValue(prop, cloth.nodes) || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedNode.properties.length > 0 && (
        <div className="mb-6 border-t border-gray-100 dark:border-zinc-800" />
      )}

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-50 p-3 text-sm transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${isFrom ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}
                  >
                    {isFrom ? "→" : "←"}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                      {relationship.type}
                    </span>
                    <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
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
