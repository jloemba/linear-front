import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchClothById, updateClothById } from "../../api/graphApi";
import type {
  IClothNode,
  IClothRelationship,
  IGraphUpdatePayload,
  IPropertyView,
  PropertyValueType,
} from "../../types/graph";
import {
  createEmptyNode,
  createEmptyProperty,
  createEmptyRelationship,
  normalizeGraphForForm,
  sanitizeGraphPayload,
  validateGraphPayload,
} from "../../utils/graphForm";
import GraphPreviewPanel from "./ClothPreviewPanel/ClothPreviewPanel";

interface Props {
  lang: "fr" | "en";
}

const inputClassName =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100";
const labelClassName = "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500";
const panelClassName =
  "rounded-[28px] border border-stone-200 bg-white/90 shadow-[0_18px_60px_rgba(68,64,60,0.08)] backdrop-blur";

const ClothEditor = ({ lang }: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<IGraphUpdatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetchClothById(id)
      .then((cloth) => {
        const normalized = normalizeGraphForForm(cloth);
        setForm(normalized);
        setLastSavedSnapshot(JSON.stringify(normalized));
      })
      .catch(() => {
        setError(
          lang === "fr"
            ? "Impossible de charger cette toile."
            : "Unable to load this graph.",
        );
      })
      .finally(() => setLoading(false));
  }, [id, lang]);

  const isDirty = useMemo(() => {
    if (!form) return false;
    return JSON.stringify(form) !== lastSavedSnapshot;
  }, [form, lastSavedSnapshot]);

  const nodeOptions = useMemo(
    () =>
      form?.nodes.map((node) => ({
        id: node.id,
        label: node.label.trim() || (lang === "fr" ? "Sans titre" : "Untitled"),
      })) ?? [],
    [form?.nodes, lang],
  );

  const updateForm = (updater: (current: IGraphUpdatePayload) => IGraphUpdatePayload) => {
    setForm((current) => {
      if (!current) return current;
      return updater(current);
    });
    setError(null);
    setSuccessMessage(null);
  };

  const updateGraphField = (field: "name" | "type" | "description", value: string) => {
    updateForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateNode = (nodeId: string, updater: (node: IClothNode) => IClothNode) => {
    updateForm((current) => ({
      ...current,
      nodes: current.nodes.map((node) => (node.id === nodeId ? updater(node) : node)),
    }));
  };

  const updateProperty = (
    nodeId: string,
    propertyIndex: number,
    updater: (property: IPropertyView) => IPropertyView,
  ) => {
    updateNode(nodeId, (node) => ({
      ...node,
      properties: node.properties.map((property, index) =>
        index === propertyIndex ? updater(property) : property,
      ),
    }));
  };

  const updateRelationship = (
    relationshipId: string,
    updater: (relationship: IClothRelationship) => IClothRelationship,
  ) => {
    updateForm((current) => ({
      ...current,
      relationships: current.relationships.map((relationship) =>
        relationship.id === relationshipId ? updater(relationship) : relationship,
      ),
    }));
  };

  const handleAddNode = () => {
    updateForm((current) => ({
      ...current,
      nodes: [...current.nodes, createEmptyNode()],
    }));
  };

  const handleRemoveNode = (nodeId: string) => {
    updateForm((current) => ({
      ...current,
      nodes: current.nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          properties: node.properties.map((property) =>
            property.refNodeId === nodeId
              ? {
                  ...property,
                  refNodeId: null,
                }
              : property,
          ),
        })),
      relationships: current.relationships.filter(
        (relationship) => relationship.fromId !== nodeId && relationship.toId !== nodeId,
      ),
    }));
  };

  const handleRegenerateNodeId = (nodeId: string) => {
    const newId = crypto.randomUUID();

    updateForm((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              id: newId,
            }
          : {
              ...node,
              properties: node.properties.map((property) =>
                property.refNodeId === nodeId
                  ? {
                      ...property,
                      refNodeId: newId,
                    }
                  : property,
              ),
            },
      ),
      relationships: current.relationships.map((relationship) => ({
        ...relationship,
        fromId: relationship.fromId === nodeId ? newId : relationship.fromId,
        toId: relationship.toId === nodeId ? newId : relationship.toId,
      })),
    }));
  };

  const handleAddProperty = (nodeId: string) => {
    updateNode(nodeId, (node) => ({
      ...node,
      properties: [...node.properties, createEmptyProperty()],
    }));
  };

  const handleRemoveProperty = (nodeId: string, propertyIndex: number) => {
    updateNode(nodeId, (node) => ({
      ...node,
      properties: node.properties.filter((_, index) => index !== propertyIndex),
    }));
  };

  const handlePropertyTypeChange = (
    nodeId: string,
    propertyIndex: number,
    valueType: PropertyValueType,
  ) => {
    updateProperty(nodeId, propertyIndex, (property) => ({
      ...property,
      valueType,
      stringValue: valueType === "string" ? property.stringValue ?? "" : null,
      dateValue: valueType === "date" ? property.dateValue ?? null : null,
      refNodeId: valueType === "reference" ? property.refNodeId ?? null : null,
    }));
  };

  const handleAddRelationship = () => {
    updateForm((current) => ({
      ...current,
      relationships: [...current.relationships, createEmptyRelationship()],
    }));
  };

  const handleRemoveRelationship = (relationshipId: string) => {
    updateForm((current) => ({
      ...current,
      relationships: current.relationships.filter(
        (relationship) => relationship.id !== relationshipId,
      ),
    }));
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!id || !form) return;
    const sanitizedPayload = sanitizeGraphPayload(form);
    const validationErrors = validateGraphPayload(sanitizedPayload);

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedGraph = await updateClothById(id, sanitizedPayload);
      const normalized = normalizeGraphForForm(updatedGraph);
      setForm(normalized);
      setLastSavedSnapshot(JSON.stringify(normalized));
      setSuccessMessage(
        lang === "fr"
          ? "La toile a bien ete mise a jour."
          : "The graph was successfully updated.",
      );
    } catch {
      //console.error("Failed to update graph with payload:", sanitizedPayload);
      setError(
        lang === "fr"
          ? "La sauvegarde a echoue. Verifie la route PUT cote API."
          : "Save failed. Please verify the PUT API route.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[linear-gradient(180deg,#fef7ed_0%,#fffbeb_45%,#fafaf9_100%)] px-6 py-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-12 w-64 rounded-full bg-orange-100" />
          <div className="grid gap-6 lg:grid-cols-[1.65fr_0.95fr]">
            <div className="space-y-6">
              <div className="h-60 rounded-[28px] bg-white" />
              <div className="h-96 rounded-[28px] bg-white" />
            </div>
            <div className="h-[420px] rounded-[28px] bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-xl rounded-[28px] border border-red-200 bg-red-50 px-6 py-8 text-red-700">
          {error ??
            (lang === "fr" ? "Cette toile est introuvable." : "This graph could not be found.")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(180deg,#fff8f1_0%,#fafaf9_55%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              <span className="rounded-full bg-amber-100 px-3 py-1">
                {lang === "fr" ? "Studio d'edition" : "Editing studio"}
              </span>
              <span className="text-stone-400">
                {lang === "fr" ? "Mise a jour complete de la toile" : "Full graph update"}
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
              {lang === "fr" ? "Modifier une toile" : "Edit graph"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
              {lang === "fr"
                ? "Chaque section reprend les donnees existantes pour que tu puisses ajuster la structure complete du graphe avant envoi. Les suppressions de noeuds nettoient aussi les references et relations associees."
                : "Each section reuses the existing graph data so you can adjust the full structure before saving. Removing a node also clears related references and relationships."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={id ? `/cloth/${id}` : "/"}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              {lang === "fr" ? "Retour au graphe" : "Back to graph"}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {saving
                ? lang === "fr"
                  ? "Sauvegarde..."
                  : "Saving..."
                : lang === "fr"
                  ? "Enregistrer les changements"
                  : "Save changes"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <section className={`${panelClassName} overflow-hidden`}>
              <div className="border-b border-stone-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_85%)] px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {lang === "fr" ? "Identite de la toile" : "Graph identity"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                  {lang === "fr" ? "Informations generales" : "General information"}
                </h2>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className={labelClassName} htmlFor="graph-name">
                    {lang === "fr" ? "Nom" : "Name"}
                  </label>
                  <input
                    id="graph-name"
                    className={inputClassName}
                    value={form.name}
                    onChange={(event) => updateGraphField("name", event.target.value)}
                    placeholder={lang === "fr" ? "Nom de la toile" : "Graph name"}
                  />
                </div>

                <div>
                  <label className={labelClassName} htmlFor="graph-type">
                    {lang === "fr" ? "Type" : "Type"}
                  </label>
                  <input
                    id="graph-type"
                    className={inputClassName}
                    value={form.type}
                    onChange={(event) => updateGraphField("type", event.target.value)}
                    placeholder="HIP_HOP"
                  />
                </div>

                <div>
                  <label className={labelClassName} htmlFor="graph-id">
                    ID
                  </label>
                  <input
                    id="graph-id"
                    className={`${inputClassName} bg-stone-50`}
                    value={id ?? ""}
                    readOnly
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClassName} htmlFor="graph-description">
                    {lang === "fr" ? "Description" : "Description"}
                  </label>
                  <textarea
                    id="graph-description"
                    className={`${inputClassName} min-h-32 resize-y`}
                    value={form.description ?? ""}
                    onChange={(event) => updateGraphField("description", event.target.value)}
                    placeholder={
                      lang === "fr"
                        ? "Explique la logique de la toile, son angle et ses limites."
                        : "Describe the graph logic, angle and boundaries."
                    }
                  />
                </div>
              </div>
            </section>

            <section className={panelClassName}>
              <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    {lang === "fr" ? "Noeuds" : "Nodes"}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                    {lang === "fr" ? "Structure des entites" : "Entity structure"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddNode}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  {lang === "fr" ? "Ajouter un noeud" : "Add node"}
                </button>
              </div>

              <div className="space-y-5 p-6">
                {form.nodes.map((node, nodeIndex) => (
                  <article
                    key={node.id}
                    className="rounded-[24px] border border-stone-200 bg-stone-50/70 p-5"
                  >
                    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                          {lang === "fr" ? `Noeud ${nodeIndex + 1}` : `Node ${nodeIndex + 1}`}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-stone-900">
                          {node.label.trim() || (lang === "fr" ? "Nouveau noeud" : "New node")}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNode(node.id)}
                        className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
                      >
                        {lang === "fr" ? "Supprimer le noeud" : "Delete node"}
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelClassName}>Label</label>
                        <input
                          className={inputClassName}
                          value={node.label}
                          onChange={(event) =>
                            updateNode(node.id, (currentNode) => ({
                              ...currentNode,
                              label: event.target.value,
                            }))
                          }
                          placeholder={lang === "fr" ? "Ex: Nas" : "Example: Nas"}
                        />
                      </div>

                      <div>
                        <label className={labelClassName}>
                          {lang === "fr" ? "Type du noeud" : "Node type"}
                        </label>
                        <input
                          className={inputClassName}
                          value={node.type}
                          onChange={(event) =>
                            updateNode(node.id, (currentNode) => ({
                              ...currentNode,
                              type: event.target.value,
                            }))
                          }
                          placeholder="RAPPER"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={labelClassName}>ID</label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input className={`${inputClassName} bg-white`} value={node.id} readOnly />
                          <button
                            type="button"
                            onClick={() => handleRegenerateNodeId(node.id)}
                            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400"
                          >
                            {lang === "fr" ? "Regenerer l'ID" : "Regenerate ID"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[20px] border border-dashed border-stone-300 bg-white p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                            {lang === "fr" ? "Proprietes" : "Properties"}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            {lang === "fr"
                              ? "Choisis un type de valeur pour guider la saisie."
                              : "Choose a value type to guide input."}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddProperty(node.id)}
                          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400"
                        >
                          {lang === "fr" ? "Ajouter une propriete" : "Add property"}
                        </button>
                      </div>

                      <div className="space-y-4">
                        {node.properties.map((property, propertyIndex) => (
                          <div
                            key={`${node.id}-${propertyIndex}`}
                            className="rounded-[20px] border border-stone-200 bg-stone-50 p-4"
                          >
                            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.8fr_1.2fr_auto] lg:items-end">
                              <div>
                                <label className={labelClassName}>
                                  {lang === "fr" ? "Nom" : "Name"}
                                </label>
                                <input
                                  className={inputClassName}
                                  value={property.name}
                                  onChange={(event) =>
                                    updateProperty(node.id, propertyIndex, (currentProperty) => ({
                                      ...currentProperty,
                                      name: event.target.value,
                                    }))
                                  }
                                  placeholder="birth_date"
                                />
                              </div>

                              <div>
                                <label className={labelClassName}>
                                  {lang === "fr" ? "Type de valeur" : "Value type"}
                                </label>
                                <select
                                  className={inputClassName}
                                  value={property.valueType ?? "string"}
                                  onChange={(event) =>
                                    handlePropertyTypeChange(
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
                                    ? lang === "fr"
                                      ? "Noeud reference"
                                      : "Referenced node"
                                    : lang === "fr"
                                      ? "Valeur"
                                      : "Value"}
                                </label>

                                {(property.valueType ?? "string") === "date" && (
                                  <input
                                    type="date"
                                    className={inputClassName}
                                    value={property.dateValue ?? ""}
                                    onChange={(event) =>
                                      updateProperty(node.id, propertyIndex, (currentProperty) => ({
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
                                      updateProperty(node.id, propertyIndex, (currentProperty) => ({
                                        ...currentProperty,
                                        refNodeId: event.target.value || null,
                                      }))
                                    }
                                  >
                                    <option value="">
                                      {lang === "fr" ? "Choisir un noeud" : "Select a node"}
                                    </option>
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
                                      updateProperty(node.id, propertyIndex, (currentProperty) => ({
                                        ...currentProperty,
                                        stringValue: event.target.value,
                                      }))
                                    }
                                    placeholder={lang === "fr" ? "Valeur texte" : "Text value"}
                                  />
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveProperty(node.id, propertyIndex)}
                                className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
                              >
                                {lang === "fr" ? "Retirer" : "Remove"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

        
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20">
            <GraphPreviewPanel
              form={form}
              lang={lang}
              saving={saving}
              isDirty={isDirty}
              error={error}
              successMessage={successMessage}
              onSubmit={() => {
                void handleSubmit();
              }}
              onExit={() => navigate(id ? `/graph/${id}` : "/")}
            />
          </aside>
        </div>
      </form>
    </div>
  );
};

export default ClothEditor;
