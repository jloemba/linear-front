import type { IClothRelationship } from "../../../types/cloth";
import {
  inputClassName,
  labelClassName,
  panelClassName,
  type ClothCommonMessages,
  type ClothEditorMessages,
} from "../clothEditorUi";

interface NodeOption {
  id: string;
  label: string;
}

interface Props {
  relationships: IClothRelationship[];
  nodeOptions: NodeOption[];
  common: ClothCommonMessages;
  editor: ClothEditorMessages;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddRelationship: () => void;
  onRemoveRelationship: (relationshipId: string) => void;
  onUpdateRelationship: (
    relationshipId: string,
    updater: (relationship: IClothRelationship) => IClothRelationship,
  ) => void;
}

const ClothRelationshipsSection = ({
  relationships,
  nodeOptions,
  common,
  editor,
  isCollapsed,
  onToggleCollapse,
  onAddRelationship,
  onRemoveRelationship,
  onUpdateRelationship,
}: Props) => (
  <section className={panelClassName}>
    <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-zinc-100">
          {editor.linksBetweenNodes}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-expanded={!isCollapsed}
          aria-controls="relationships-section-panel"
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
        >
          {isCollapsed ? editor.expand : editor.collapse}
        </button>
        <button
          type="button"
          onClick={onAddRelationship}
          className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-950/60"
        >
          {editor.addRelationship}
        </button>
      </div>
    </div>

    <div
      id="relationships-section-panel"
      className={`collapsible-panel ${isCollapsed ? "is-collapsed" : "is-expanded"}`}
    >
      <div className="collapsible-panel__inner space-y-4 p-6">
        {relationships.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-stone-300 bg-stone-50 px-5 py-6 text-sm text-stone-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            {editor.noRelationships}
          </div>
        )}

        {relationships.map((relationship, relationshipIndex) => (
          <article
            key={relationship.id}
            className="rounded-[24px] border border-stone-200 bg-stone-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/70"
          >
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-zinc-500">
                  {`${editor.relationship} ${relationshipIndex + 1}`}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-zinc-100">
                  {relationship.type.trim() || editor.newRelationship}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onRemoveRelationship(relationship.id)}
                className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 dark:border-red-900/60 dark:bg-zinc-950 dark:text-red-300 dark:hover:bg-red-950/40"
              >
                {editor.deleteRelationship}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClassName}>{editor.sourceNode}</label>
                <select
                  className={inputClassName}
                  value={relationship.fromId}
                  onChange={(event) =>
                    onUpdateRelationship(relationship.id, (currentRelationship) => ({
                      ...currentRelationship,
                      fromId: event.target.value,
                    }))
                  }
                >
                  <option value="">{common.selectNode}</option>
                  {nodeOptions.map((option) => (
                    <option
                      key={`from-${relationship.id}-${option.id}`}
                      value={option.id}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>{editor.targetNode}</label>
                <select
                  className={inputClassName}
                  value={relationship.toId}
                  onChange={(event) =>
                    onUpdateRelationship(relationship.id, (currentRelationship) => ({
                      ...currentRelationship,
                      toId: event.target.value,
                    }))
                  }
                >
                  <option value="">{common.selectNode}</option>
                  {nodeOptions.map((option) => (
                    <option
                      key={`to-${relationship.id}-${option.id}`}
                      value={option.id}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClassName}>{editor.relationshipType}</label>
                <input
                  className={inputClassName}
                  value={relationship.type}
                  onChange={(event) =>
                    onUpdateRelationship(relationship.id, (currentRelationship) => ({
                      ...currentRelationship,
                      type: event.target.value,
                    }))
                  }
                  placeholder="MENTORS, COLLABORATED_WITH..."
                />
              </div>

              <div>
                <label className={labelClassName}>{editor.startDate}</label>
                <input
                  type="date"
                  className={inputClassName}
                  value={relationship.startDate ?? ""}
                  onChange={(event) =>
                    onUpdateRelationship(relationship.id, (currentRelationship) => ({
                      ...currentRelationship,
                      startDate: event.target.value || null,
                    }))
                  }
                />
              </div>

              <div>
                <label className={labelClassName}>{editor.endDate}</label>
                <input
                  type="date"
                  className={inputClassName}
                  value={relationship.endDate ?? ""}
                  onChange={(event) =>
                    onUpdateRelationship(relationship.id, (currentRelationship) => ({
                      ...currentRelationship,
                      endDate: event.target.value || null,
                    }))
                  }
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ClothRelationshipsSection;
