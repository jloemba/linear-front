import type {
  IClothDetail,
  IClothNode,
  IClothRelationship,
  IClothSummary,
  IClothUpdatePayload,
  IPropertyView,
} from "../../types/cloth";

export const makeProperty = (
  overrides: Partial<IPropertyView> = {},
): IPropertyView => ({
  name: "birth_date",
  valueType: "string",
  stringValue: "1973",
  dateValue: null,
  refNodeId: null,
  ...overrides,
});

export const makeNode = (
  overrides: Partial<IClothNode> = {},
): IClothNode => ({
  id: "node-1",
  label: "Nas",
  type: "RAPPER",
  properties: [makeProperty()],
  ...overrides,
});

export const makeRelationship = (
  overrides: Partial<IClothRelationship> = {},
): IClothRelationship => ({
  id: "rel-1",
  fromId: "node-1",
  toId: "node-2",
  type: "COLLABORATED_WITH",
  startDate: null,
  endDate: null,
  ...overrides,
});

export const makeClothDetail = (
  overrides: Partial<IClothDetail> = {},
): IClothDetail => ({
  id: "cloth-1",
  name: "Hip Hop Legacy",
  description: "A graph about artists",
  createdAt: "2026-04-02T00:00:00.000Z",
  type: "MUSIC",
  nodes: [makeNode(), makeNode({ id: "node-2", label: "AZ" })],
  relationships: [makeRelationship()],
  ...overrides,
});

export const makeClothSummary = (
  overrides: Partial<IClothSummary> = {},
): IClothSummary => ({
  id: "cloth-1",
  name: "Hip Hop Legacy",
  description: "A graph about artists",
  createdAt: "2026-04-02T00:00:00.000Z",
  type: "MUSIC",
  ...overrides,
});

export const makeClothPayload = (
  overrides: Partial<IClothUpdatePayload> = {},
): IClothUpdatePayload => ({
  name: "Hip Hop Legacy",
  type: "MUSIC",
  description: "A graph about artists",
  nodes: [makeNode()],
  relationships: [makeRelationship()],
  ...overrides,
});
