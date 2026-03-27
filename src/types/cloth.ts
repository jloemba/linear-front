export type PropertyValueType = "string" | "date" | "reference";

export interface IClothSummary {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  type?: string | null;
}

export interface IPropertyView {
  name: string;
  valueType?: PropertyValueType;
  stringValue?: string | null;
  dateValue?: string | null;
  refNodeId?: string | null;
  value?: string;
}

export interface IClothNode {
  id: string;
  label: string;
  type: string;
  properties: IPropertyView[];
}

export interface IClothRelationship {
  id: string;
  fromId: string;
  toId: string;
  type: string;
  startDate: string | null;
  endDate: string | null;
}

export interface IClothDetail {
  id: string;
  name: string;
  description: string | null;
  type?: string | null;
  nodes: IClothNode[];
  relationships: IClothRelationship[];
  createdAt: string;
}

export interface IClothUpdatePayload {
  name: string;
  type: string;
  description: string | null;
  nodes: IClothNode[];
  relationships: IClothRelationship[];
}
