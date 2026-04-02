import type {
  IClothNode,
  IPropertyView,
  PropertyValueType,
} from "../../../types/cloth";
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
  lang: "fr" | "en";
  nodes: IClothNode[];
  nodeOptions: NodeOption[];
  collapsedNodeIds: string[];
  common: ClothCommonMessages;
  editor: ClothEditorMessages;
  isSectionCollapsed: boolean;
  onToggleSectionCollapse: () => void;
  onAddNode: () => void;
  onToggleNodeCollapse: (nodeId: string) => void;
  onRemoveNode: (nodeId: string) => void;
  onUpdateNode: (nodeId: string, updater: (node: IClothNode) => IClothNode) => void;
  onAddProperty: (nodeId: string) => void;
  onRemoveProperty: (nodeId: string, propertyIndex: number) => void;
  onUpdateProperty: (
    nodeId: string,
    propertyIndex: number,
    updater: (property: IPropertyView) => IPropertyView,
  ) => void;
  onPropertyTypeChange: (
    nodeId: string,
    propertyIndex: number,
    valueType: PropertyValueType,
  ) => void;
}

const ClothNodesSection = ({
  lang,
  nodes,
  nodeOptions,
  collapsedNodeIds,
  common,
  editor,
  isSectionCollapsed,
  onToggleSectionCollapse,
  onAddNode,
  onToggleNodeCollapse,
  onRemoveNode,
  onUpdateNode,
  onAddProperty,
  onRemoveProperty,
  onUpdateProperty,
  onPropertyTypeChange,
}: Props) => (
  <section className={panelClassName}>
    <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-zinc-100">
          {editor.nodes}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleSectionCollapse}
          aria-expanded={!isSectionCollapsed}
          aria-controls="nodes-section-panel"
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
        >
          {isSectionCollapsed ? editor.expand : editor.collapse}
        </button>
        <button
          type="button"
          onClick={onAddNode}
          className="rounded-full border border-emerald-200 bg-sky-50 px-2 py-1 text-sm font-semibold text-sky-700 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-950/60"
        >
          {editor.addNode}
        </button>
      </div>
    </div>

    <div
      id="nodes-section-panel"
      className={`collapsible-panel ${isSectionCollapsed ? "is-collapsed" : "is-expanded"}`}
    >
      <div className="collapsible-panel__inner space-y-5 p-6">
        {nodes.map((node, nodeIndex) => {
          const isCollapsed = collapsedNodeIds.includes(node.id);

          return (
            <article
              id={`node-section-${node.id}`}
              key={node.id}
              className="scroll-mt-24 rounded-[24px] border border-stone-200 bg-stone-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleNodeCollapse(node.id)}
                    aria-expanded={!isCollapsed}
                    aria-controls={`node-panel-${node.id}`}
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-lg font-semibold text-stone-600 transition hover:border-stone-300 hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
                  >
                    {isCollapsed ? "+" : "−"}
                  </button>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-zinc-500">
                      {`${editor.node} ${nodeIndex + 1}`}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-zinc-100">
                      {node.label.trim() || editor.newNode}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveNode(node.id)}
                  className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 dark:border-red-900/60 dark:bg-zinc-950 dark:text-red-300 dark:hover:bg-red-950/40"
                >
                  {editor.deleteNode}
                </button>
              </div>

              {!isCollapsed && (
                <div id={`node-panel-${node.id}`}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClassName}>Label</label>
                      <input
                        className={inputClassName}
                        value={node.label}
                        onChange={(event) =>
                          onUpdateNode(node.id, (currentNode) => ({
                            ...currentNode,
                            label: event.target.value,
                          }))
                        }
                        placeholder={lang === "fr" ? "Ex: Nas" : "Example: Nas"}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>{editor.nodeType}</label>
                      <input
                        className={inputClassName}
                        value={node.type}
                        onChange={(event) =>
                          onUpdateNode(node.id, (currentNode) => ({
                            ...currentNode,
                            type: event.target.value,
                          }))
                        }
                        placeholder="RAPPER"
                      />
                    </div>
                  </div>

                  <div className="mt-6 rounded-[20px] border border-dashed border-stone-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-zinc-500">
                          {editor.properties}
                        </p>
                        <p className="mt-1 text-sm text-stone-500 dark:text-zinc-400">
                          {lang === "fr"
                            ? "Choisis un type de valeur pour guider la saisie."
                            : "Choose a value type to guide input."}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAddProperty(node.id)}
                        className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600"
                      >
                        {editor.addProperty}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {node.properties.map((property, propertyIndex) => (
                        <div
                          key={`${node.id}-${propertyIndex}`}
                          className="rounded-[20px] border border-stone-200 bg-stone-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.8fr_1.2fr_auto] lg:items-end">
                            <div>
                              <label className={labelClassName}>{editor.propertyName}</label>
                              <input
                                className={inputClassName}
                                value={property.name}
                                onChange={(event) =>
                                  onUpdateProperty(node.id, propertyIndex, (currentProperty) => ({
                                    ...currentProperty,
                                    name: event.target.value,
                                  }))
                                }
                                placeholder="birth_date"
                              />
                            </div>

                            <div>
                              <label className={labelClassName}>{editor.valueType}</label>
                              <select
                                className={inputClassName}
                                value={property.valueType ?? "string"}
                                onChange={(event) =>
                                  onPropertyTypeChange(
                                    node.id,
                                    propertyIndex,
                                    event.target.value as PropertyValueType,
                                  )
                                }
                              >
                                <option value="string">string</option>
                                <option value="date">date</option>
                                <option value="reference">reference</option>
                              </select>
                            </div>

                            <div>
                              <label className={labelClassName}>
                                {property.valueType === "reference"
                                  ? editor.referencedNode
                                  : editor.value}
                              </label>

                              {(property.valueType ?? "string") === "date" && (
                                <input
                                  type="date"
                                  className={inputClassName}
                                  value={property.dateValue ?? ""}
                                  onChange={(event) =>
                                    onUpdateProperty(node.id, propertyIndex, (currentProperty) => ({
                                      ...currentProperty,
                                      dateValue: event.target.value || null,
                                    }))
                                  }
                                />
                              )}

                              {(property.valueType ?? "string") === "reference" && (
                                <select
                                  className={inputClassName}
                                  value={property.refNodeId ?? ""}
                                  onChange={(event) =>
                                    onUpdateProperty(node.id, propertyIndex, (currentProperty) => ({
                                      ...currentProperty,
                                      refNodeId: event.target.value || null,
                                    }))
                                  }
                                >
                                  <option value="">{common.selectNode}</option>
                                  {nodeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {(property.valueType ?? "string") === "string" && (
                                <input
                                  className={inputClassName}
                                  value={property.stringValue ?? ""}
                                  onChange={(event) =>
                                    onUpdateProperty(node.id, propertyIndex, (currentProperty) => ({
                                      ...currentProperty,
                                      stringValue: event.target.value,
                                    }))
                                  }
                                  placeholder={editor.textValue}
                                />
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveProperty(node.id, propertyIndex)}
                              className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 dark:border-red-900/60 dark:bg-zinc-950 dark:text-red-300 dark:hover:bg-red-950/40"
                            >
                              {editor.remove}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default ClothNodesSection;
