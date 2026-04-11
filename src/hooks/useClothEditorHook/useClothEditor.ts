import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCloth,
  deleteClothById,
  fetchClothById,
  updateClothById,
} from "../../api/cloth/clothApi";
import type {
  IClothNode,
  IClothRelationship,
  IClothUpdatePayload,
  IPropertyView,
  PropertyValueType,
} from "../../types/cloth";
import {
  createEmptyClothPayload,
  createEmptyNode,
  createEmptyProperty,
  createEmptyRelationship,
  normalizeClothForForm,
  sanitizeClothPayload,
  validateClothPayload,
} from "../../utils/clothForm";
import type { ClothCommonMessages, ClothEditorMessages } from "../../pages/ClothEditor/clothEditorUi";
import useAuth from "../useAuthHook/useAuth";
import useSnackbar from "../useSnackbarHook/useSnackbar";

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
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState<IClothUpdatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<string[]>([]);
  const [isNodesSectionCollapsed, setIsNodesSectionCollapsed] = useState(false);
  const [isRelationshipsSectionCollapsed, setIsRelationshipsSectionCollapsed] =
    useState(false);
  const isCreateMode = !id;

  useEffect(() => {
    if (!id) {
      setForm(createEmptyClothPayload());
      setCollapsedNodeIds([]);
      setLoading(false);
      return;
    }

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
    if (!form) return;

    if (!isAuthenticated) {
      showSnackbar({
        message: lang === 'fr' ? 'Connectez-vous pour sauvegarder' : 'Log in to save',
        type: "warning",
      });
      return;
    }

    const sanitizedPayload = sanitizeClothPayload(form);
    const validationErrors = validateClothPayload(sanitizedPayload, lang);

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (id) {
        const updatedCloth = await updateClothById(id, sanitizedPayload);
        setForm(normalizeClothForForm(updatedCloth));
        showSnackbar({
          message: editor.saveSuccess,
          type: "success",
        });
      } else {
        const createdCloth = await createCloth(sanitizedPayload);
        setForm(normalizeClothForForm(createdCloth));
        showSnackbar({
          message: editor.createSuccess,
          type: "success",
        });
        navigate(`/cloth/${createdCloth.id}/edit`, { replace: true });
      }
    } catch {
      showSnackbar({
        message: id ? editor.saveError : editor.createError,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = () => {
    if (!id) {
      navigate("/");
      return;
    }

    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (saving) return;
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!id) {
      navigate("/");
      return;
    }

    if (!isAuthenticated) {
      showSnackbar({
        message: lang === 'fr' ? 'Connectez-vous pour supprimer' : 'Log in to delete',
        type: "warning",
      });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await deleteClothById(id);
      setIsDeleteDialogOpen(false);
      showSnackbar({
        message: editor.deleteSuccess,
        type: "success",
      });
      navigate("/", {
        replace: true,
      });
    } catch {
      showSnackbar({
        message: editor.deleteError,
        type: "error",
      });
      setSaving(false);
    }
  };

  return {
    id,
    isCreateMode,
    isDeleteDialogOpen,
    form,
    loading,
    saving,
    error,
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
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  };
}
