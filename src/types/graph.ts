export interface IGraphSummary {
  id: string;
  name: string;
}

export interface IGraphNode {
  id: string;
  label: string;
  type: string;
}

export interface IGraphRelationship {
  id: string;
  fromId: string;
  toId: string;
  type: string;
  startDate: string | null;
  endDate: string | null;
}

export interface IGraphDetail {
  id: string;
  name: string;
  nodes: IGraphNode[];
  relationships: IGraphRelationship[];
}