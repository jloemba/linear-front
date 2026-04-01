import type { IClothNode } from "../../../types/cloth";
import { panelClassName, type ClothEditorMessages } from "../clothEditorUi";

interface Props {
  nodes: IClothNode[];
  editor: ClothEditorMessages;
  onScrollToNode: (nodeId: string) => void;
  getPropertyCountLabel: (count: number) => string;
}

const ClothQuickNavigation = ({
  nodes,
  editor,
  onScrollToNode,
  getPropertyCountLabel,
}: Props) => (
  <section className={`${panelClassName} overflow-hidden`}>
    <div className="border-b border-stone-200 px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
        {editor.quickNodeAccess}
      </p>
    </div>

    <div className="max-h-[24rem] space-y-2 overflow-y-auto p-4">
      {nodes.map((node, nodeIndex) => (
        <button
          key={`anchor-${node.id}`}
          type="button"
          onClick={() => onScrollToNode(node.id)}
          className="flex w-full items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left transition hover:border-amber-300 hover:bg-amber-50"
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              {`${editor.node} ${nodeIndex + 1}`}
            </span>
            <span className="mt-1 block truncate text-sm font-medium text-stone-800">
              {node.label.trim() || editor.newNode}
            </span>
          </span>
          <span className="ml-3 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
            {getPropertyCountLabel(node.properties.length)}
          </span>
        </button>
      ))}
    </div>
  </section>
);

export default ClothQuickNavigation;
