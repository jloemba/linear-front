import type cytoscape from "cytoscape";
import type { IClothDetail, IClothUpdatePayload } from "../types/cloth";
import { NODE_TYPE_COLORS } from "./const";

type ClothGraphData = Pick<IClothDetail, "nodes" | "relationships"> | IClothUpdatePayload;
type ChartVariant = "editor" | "view";

export const getClothNodeColor = (type: string): string =>
  NODE_TYPE_COLORS[type] ?? (type ? "#44403c" : "#78716c");

export const getClothChartElements = (
  cloth: ClothGraphData,
  lang: "fr" | "en",
): cytoscape.ElementDefinition[] => [
  ...cloth.nodes.map((node) => ({
    data: {
      id: node.id,
      label: node.label.trim() || (lang === "fr" ? "Sans titre" : "Untitled"),
      type: node.type,
      color: getClothNodeColor(node.type),
    },
  })),
  ...cloth.relationships
    .filter((relationship) => relationship.fromId && relationship.toId)
    .map((relationship) => ({
      data: {
        id: relationship.id,
        source: relationship.fromId,
        target: relationship.toId,
        label: relationship.type,
      },
    })),
];

export const getClothChartStyle = (
  variant: ChartVariant,
): cytoscape.StylesheetCSS[] => {
  if (variant === "view") {
    return [
      {
        selector: "node",
        css: {
          "background-color": "data(color)",
          label: "data(label)",
          color: "#FFFFFF",
          "text-valign": "center",
          "text-halign": "center",
          "font-size": "11px",
          "font-family": "Inter, sans-serif",
          width: "80px",
          height: "80px",
          shape: "ellipse",
          "text-wrap": "wrap",
          "text-max-width": "70px",
          "border-width": 0,
        },
      },
      {
        selector: "node:selected",
        css: {
          "border-width": 3,
          "border-color": "#FFFFFF",
          "border-opacity": 0.8,
        },
      },
      {
        selector: "node:hover",
        css: {
          opacity: 0.85,
        },
      },
      {
        selector: "edge",
        css: {
          width: 1.5,
          "line-color": "#D4D4D8",
          "target-arrow-color": "#D4D4D8",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          label: "",
        },
      },
      {
        selector: "edge:selected",
        css: {
          "line-color": "#71717A",
          "target-arrow-color": "#71717A",
          label: "data(label)",
          "font-size": "9px",
          color: "#71717A",
          "font-family": "Inter, sans-serif",
          "text-rotation": "autorotate",
          "text-background-color": "#FAFAFA",
          "text-background-opacity": 1,
          "text-background-padding": "2px",
        },
      },
    ];
  }

  return [
    {
      selector: "node",
      css: {
        "background-color": "data(color)",
        label: "data(label)",
        color: "#fafaf9",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "10px",
        "font-family": "Satoshi, Inter, sans-serif",
        width: "58px",
        height: "58px",
        shape: "ellipse",
        "text-wrap": "wrap",
        "text-max-width": "50px",
        "border-width": 2,
        "border-color": "#ffffff",
      },
    },
    {
      selector: "node:selected",
      css: {
        "border-width": 4,
        "border-color": "#f59e0b",
        "overlay-opacity": 0,
      },
    },
    {
      selector: "edge",
      css: {
        width: 1.6,
        "line-color": "#d6d3d1",
        "target-arrow-color": "#d6d3d1",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        "arrow-scale": 0.8,
      },
    },
  ];
};

export const getClothChartLayout = (
  variant: ChartVariant,
  isFullscreen = false,
): cytoscape.LayoutOptions => {
  if (variant === "view") {
    return {
      name: "breadthfirst",
      directed: true,
      padding: 60,
      spacingFactor: 1.2,
      avoidOverlap: true,
    };
  }

  return {
    name: "breadthfirst",
    directed: true,
    padding: isFullscreen ? 48 : 24,
    spacingFactor: isFullscreen ? 1.5 : 1.15,
    avoidOverlap: true,
  };
};
