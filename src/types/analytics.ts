export interface IDailyView {
  date: string;
  count: number;
}

export interface INodeClickCount {
  nodeId: string;
  nodeLabel: string;
  clicks: number;
}

export interface IInsightResult {
  canvasId: string;
  canvasName: string;
  totalViews: number;
  uniqueViews: number;
  totalNodeClicks: number;
  viewsOverTime: IDailyView[];
  topNodes: INodeClickCount[];
}
