import type {
  IClothCreatePayload,
  IClothDetail,
  IClothNode,
  IClothRelationship,
  IClothUpdatePayload as IClothUpdatePayload,
  IPropertyView,
  PropertyValueType,
} from "../types/cloth";
import { getClothMessages, type AppLang } from "../i18n/cloth";

const FALLBACK_CLOTH_TYPE = "CLOTH";

const createId = () => crypto.randomUUID();

export const createEmptyProperty = (): IPropertyView => ({
  name: "",
  valueType: "string",
  stringValue: "",
  dateValue: null,
  refNodeId: null,
});

export const createEmptyNode = (): IClothNode => ({
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

export const createEmptyClothPayload = (): IClothCreatePayload => ({
  name: "",
  type: FALLBACK_CLOTH_TYPE,
  description: "",
  nodes: [createEmptyNode()],
  relationships: [],
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

export const normalizeClothForForm = (
  cloth: IClothDetail,
): IClothUpdatePayload => ({
  name: cloth.name,
  type: cloth.type ?? FALLBACK_CLOTH_TYPE,
  description: cloth.description ?? "",
  nodes:
    cloth.nodes.length > 0
      ? cloth.nodes.map((node) => ({
          ...node,
          properties:
            node.properties.length > 0
              ? node.properties.map(normalizeProperty)
              : [createEmptyProperty()],
        }))
      : [createEmptyNode()],
  relationships:
    cloth.relationships.length > 0
      ? cloth.relationships.map((relationship) => ({
          ...relationship,
          startDate: relationship.startDate ?? null,
          endDate: relationship.endDate ?? null,
        }))
      : [],
});

export const sanitizeClothPayload = (
  payload: IClothUpdatePayload,
): IClothUpdatePayload => ({
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
  nodes?: IClothNode[],
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

export const validateClothPayload = (
  payload: IClothUpdatePayload,
  lang: AppLang = "fr",
): string[] => {
  const errors: string[] = [];
  const { validation } = getClothMessages(lang);

  if (!payload.name.trim()) {
    errors.push(validation.clothNameRequired);
  }

  if (!payload.type.trim()) {
    errors.push(validation.clothTypeRequired);
  }

  payload.nodes.forEach((node, nodeIndex) => {
    if (!node.label.trim()) {
      errors.push(validation.nodeLabelRequired(nodeIndex + 1));
    }

    if (!node.type.trim()) {
      errors.push(validation.nodeTypeRequired(nodeIndex + 1));
    }

    node.properties.forEach((property, propertyIndex) => {
      if (!property.name.trim()) {
        errors.push(validation.propertyNameRequired(propertyIndex + 1, nodeIndex + 1));
      }

      if (
        property.valueType === "reference" &&
        property.refNodeId &&
        !payload.nodes.some((clothNode) => clothNode.id === property.refNodeId)
      ) {
        errors.push(validation.propertyReferenceInvalid(propertyIndex + 1, nodeIndex + 1));
      }
    });
  });

  payload.relationships.forEach((relationship, relationshipIndex) => {
    if (!relationship.type.trim()) {
      errors.push(validation.relationshipTypeRequired(relationshipIndex + 1));
    }

    if (!relationship.fromId || !payload.nodes.some((node) => node.id === relationship.fromId)) {
      errors.push(validation.relationshipSourceInvalid(relationshipIndex + 1));
    }

    if (!relationship.toId || !payload.nodes.some((node) => node.id === relationship.toId)) {
      errors.push(validation.relationshipTargetInvalid(relationshipIndex + 1));
    }
  });

  return errors;
};
