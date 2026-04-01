import { type FormEvent, useEffect, useMemo, useState } from "react";
import { fetchClothById, updateClothById } from "../../api/clothApi";
import type {
  IClothNode,
  IClothRelationship,
  IClothUpdatePayload,
  IPropertyView,
  PropertyValueType,
} from "../../types/cloth";
import {
  createEmptyNode,
  createEmptyProperty,
  createEmptyRelationship,
  normalizeClothForForm,
  sanitizeClothPayload,
  validateClothPayload,
} from "../../utils/clothForm";
import type { ClothCommonMessages, ClothEditorMessages } from "../../pages/ClothEditor/clothEditorUi";

interface Props {
  id?: string;
  lang: "fr" | "en";
  common: ClothCommonMessages;
  editor: ClothEditorMessages;
}

export default function useClothEditor({
  id,
  lang,
  common,
  editor,
}: Props) {
  const [form, setForm] = useState<IClothUpdatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<string[]>([]);
  const [isNodesSectionCollapsed, setIsNodesSectionCollapsed] = useState(false);
  const [isRelationshipsSectionCollapsed, setIsRelationshipsSectionCollapsed] =
    useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetchClothById(id)
      .then((cloth) => {
        setForm(normalizeClothForForm(cloth));
        setCollapsedNodeIds([]);
      })
      .catch(() => {
        setError(editor.loadError);
      })
      .finally(() => setLoading(false));
  }, [editor.loadError, id]);

  const nodeOptions = useMemo(
    () =>
      form?.nodes.map((node) => ({
        id: node.id,
        label: node.label.trim() || common.untitled,
      })) ?? [],
    [common.untitled, form?.nodes],
  );

  const updateForm = (
    updater: (current: IClothUpdatePayload) => IClothUpdatePayload,
  ) => {
    setForm((current) => {
      if (!current) return current;
      return updater(current);
    });
    setError(null);
    setSuccessMessage(null);
  };

  const updateClothField = (
    field: "name" | "type" | "description",
    value: string,
  ) => {
    updateForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateNode = (
    nodeId: string,
    updater: (node: IClothNode) => IClothNode,
  ) => {
    updateForm((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === nodeId ? updater(node) : node,
      ),
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
        relationship.id === relationshipId
          ? updater(relationship)
          : relationship,
      ),
    }));
  };

  const handleAddNode = () => {
    const newNode = createEmptyNode();
    updateForm((current) => ({
      ...current,
      nodes: [...current.nodes, newNode],
    }));
    setCollapsedNodeIds((current) =>
      current.filter((nodeId) => nodeId !== newNode.id),
    );
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
        (relationship) =>
          relationship.fromId !== nodeId && relationship.toId !== nodeId,
      ),
    }));
    setCollapsedNodeIds((current) =>
      current.filter((currentNodeId) => currentNodeId !== nodeId),
    );
  };

  const toggleNodeCollapse = (nodeId: string) => {
    setCollapsedNodeIds((current) =>
      current.includes(nodeId)
        ? current.filter((currentNodeId) => currentNodeId !== nodeId)
        : [...current, nodeId],
    );
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
      stringValue: valueType === "string" ? (property.stringValue ?? "") : null,
      dateValue: valueType === "date" ? (property.dateValue ?? null) : null,
      refNodeId:
        valueType === "reference" ? (property.refNodeId ?? null) : null,
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

  const scrollToNode = (nodeId: string) => {
    setCollapsedNodeIds((current) =>
      current.filter((currentNodeId) => currentNodeId !== nodeId),
    );
    requestAnimationFrame(() => {
      document.getElementById(`node-section-${nodeId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!id || !form) return;
    const sanitizedPayload = sanitizeClothPayload(form);
    const validationErrors = validateClothPayload(sanitizedPayload, lang);

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedCloth = await updateClothById(id, sanitizedPayload);
      setForm(normalizeClothForForm(updatedCloth));
      setSuccessMessage(editor.saveSuccess);
    } catch {
      setError(editor.saveError);
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    loading,
    saving,
    error,
    successMessage,
    nodeOptions,
    collapsedNodeIds,
    isNodesSectionCollapsed,
    isRelationshipsSectionCollapsed,
    setIsNodesSectionCollapsed,
    setIsRelationshipsSectionCollapsed,
    updateClothField,
    updateNode,
    updateProperty,
    updateRelationship,
    handleAddNode,
    handleRemoveNode,
    toggleNodeCollapse,
    handleAddProperty,
    handleRemoveProperty,
    handlePropertyTypeChange,
    handleAddRelationship,
    handleRemoveRelationship,
    scrollToNode,
    handleSubmit,
  };
}
