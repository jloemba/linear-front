import type {
  IClothDetail,
  IGraphNode,
  IClothRelationship,
  IGraphUpdatePayload,
  IPropertyView,
  PropertyValueType,
} from "../types/graph";

const FALLBACK_GRAPH_TYPE = "GRAPH";

const createId = () => crypto.randomUUID();

export const createEmptyProperty = (): IPropertyView => ({
  name: "",
  valueType: "string",
  stringValue: "",
  dateValue: null,
  refNodeId: null,
});

export const createEmptyNode = (): IGraphNode => ({
  id: createId(),
  label: "",
  type: "",
  properties: [createEmptyProperty()],
});

export const createEmptyRelationship = (): IClothRelationship => ({
  id: createId(),
  fromId: "",
  toId: "",
  type: "",
  startDate: null,
  endDate: null,
});

export const normalizeProperty = (property: IPropertyView): IPropertyView => {
  const valueType: PropertyValueType = property.valueType ?? "string";

  if (valueType === "date") {
    return {
      name: property.name,
      valueType,
      stringValue: null,
      dateValue: property.dateValue ?? null,
      refNodeId: null,
    };
  }

  if (valueType === "reference") {
    return {
      name: property.name,
      valueType,
      stringValue: null,
      dateValue: null,
      refNodeId: property.refNodeId ?? null,
    };
  }

  return {
    name: property.name,
    valueType,
    stringValue: property.stringValue ?? property.value ?? "",
    dateValue: null,
    refNodeId: null,
  };
};

export const normalizeGraphForForm = (
  graph: IClothDetail,
): IGraphUpdatePayload => ({
  name: graph.name,
  type: graph.type ?? FALLBACK_GRAPH_TYPE,
  description: graph.description ?? "",
  nodes:
    graph.nodes.length > 0
      ? graph.nodes.map((node) => ({
          ...node,
          properties:
            node.properties.length > 0
              ? node.properties.map(normalizeProperty)
              : [createEmptyProperty()],
        }))
      : [createEmptyNode()],
  relationships:
    graph.relationships.length > 0
      ? graph.relationships.map((relationship) => ({
          ...relationship,
          startDate: relationship.startDate ?? null,
          endDate: relationship.endDate ?? null,
        }))
      : [],
});

export const sanitizeGraphPayload = (
  payload: IGraphUpdatePayload,
): IGraphUpdatePayload => ({
  name: payload.name.trim(),
  type: payload.type.trim(),
  description: payload.description?.trim() || null,
  nodes: payload.nodes.map((node) => ({
    ...node,
    label: node.label.trim(),
    type: node.type.trim(),
    properties: node.properties
      .map((property) => normalizeProperty(property))
      .filter((property) => property.name.trim().length > 0),
  })),
  relationships: payload.relationships.map((relationship) => ({
    ...relationship,
    type: relationship.type.trim(),
    startDate: relationship.startDate || null,
    endDate: relationship.endDate || null,
  })),
});

export const getPropertyDisplayValue = (
  property: IPropertyView,
  nodes?: IGraphNode[],
): string => {
  if (property.valueType === "date") {
    return property.dateValue ?? "";
  }

  if (property.valueType === "reference") {
    if (!property.refNodeId) return "";

    const referencedNode = nodes?.find((node) => node.id === property.refNodeId);
    return referencedNode?.label ?? property.refNodeId;
  }

  return property.stringValue ?? property.value ?? "";
};

export const validateGraphPayload = (payload: IGraphUpdatePayload): string[] => {
  const errors: string[] = [];

  if (!payload.name.trim()) {
    errors.push("Le nom de la toile est requis.");
  }

  if (!payload.type.trim()) {
    errors.push("Le type de la toile est requis.");
  }

  payload.nodes.forEach((node, nodeIndex) => {
    if (!node.label.trim()) {
      errors.push(`Le noeud ${nodeIndex + 1} doit avoir un libelle.`);
    }

    if (!node.type.trim()) {
      errors.push(`Le noeud ${nodeIndex + 1} doit avoir un type.`);
    }

    node.properties.forEach((property, propertyIndex) => {
      if (!property.name.trim()) {
        errors.push(
          `La propriete ${propertyIndex + 1} du noeud ${nodeIndex + 1} doit avoir un nom.`,
        );
      }

      if (
        property.valueType === "reference" &&
        property.refNodeId &&
        !payload.nodes.some((graphNode) => graphNode.id === property.refNodeId)
      ) {
        errors.push(
          `La reference de la propriete ${propertyIndex + 1} du noeud ${nodeIndex + 1} est invalide.`,
        );
      }
    });
  });

  payload.relationships.forEach((relationship, relationshipIndex) => {
    if (!relationship.type.trim()) {
      errors.push(`La relation ${relationshipIndex + 1} doit avoir un type.`);
    }

    if (!relationship.fromId || !payload.nodes.some((node) => node.id === relationship.fromId)) {
      errors.push(`La relation ${relationshipIndex + 1} doit avoir une source valide.`);
    }

    if (!relationship.toId || !payload.nodes.some((node) => node.id === relationship.toId)) {
      errors.push(`La relation ${relationshipIndex + 1} doit avoir une cible valide.`);
    }
  });

  return errors;
};
