import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import cytoscape from "cytoscape";
import { fetchGraphById } from "../../api/graphApi";
import type { IGraphDetail, IGraphNode } from "../../types/graph";
import { NODE_TYPE_COLORS } from "../../utils/const";
import { formatDate } from "../../utils/func";

interface Props {
  lang: "fr" | "en";
}

// à mettre dans un hook custom plus tard
const getNodeColor = (type: string): string =>
  NODE_TYPE_COLORS[type] ?? "#3F3F46";

const GraphView = ({ lang }: Props) => {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [graph, setGraph] = useState<IGraphDetail | null>(null);
  const [selectedNode, setSelectedNode] = useState<IGraphNode | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchGraphById(id).then(setGraph);
  }, [id]);

  useEffect(() => {
    if (!graph || !containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...graph.nodes.map((node) => ({
          data: {
            id: node.id,
            label: node.label,
            type: node.type,
            color: getNodeColor(node.type),
          },
        })),
        ...graph.relationships.map((rel) => ({
          data: {
            id: rel.id,
            source: rel.fromId,
            target: rel.toId,
            label: rel.type,
          },
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            label: "data(label)",
            color: "#FFFFFF",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "11px",
            "font-family": "Inter, sans-serif",
            //'font-weight': '500',
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
          style: {
            "border-width": 3,
            "border-color": "#FFFFFF",
            "border-opacity": 0.8,
          },
        },
        {
          selector: "node:hover",
          style: {
            opacity: 0.85,
            //'cursor': 'pointer',
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#D4D4D8",
            "target-arrow-color": "#D4D4D8",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "", // labels cachés
          },
        },
        {
          selector: "edge:selected",
          style: {
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
      ],
      layout: {
        name: "breadthfirst",
        directed: true,
        padding: 60,
        spacingFactor: 1.2,
        avoidOverlap: true,
      },
    });

    cyRef.current = cy;

    cy.on("tap", "node", (evt) => {
      const nodeId = evt.target.data("id");
      const found = graph.nodes.find((n) => n.id === nodeId) ?? null;
      setSelectedNode(found);
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) setSelectedNode(null);
    });

    cy.fit(undefined, 60);

    return () => cy.destroy();
  }, [graph]);

  const handleFit = () => {
    cyRef.current?.fit(undefined, 60);
    cyRef.current?.center();
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50">
      {graph && (
        <div className="shrink-0 bg-white border-b border-gray-100 px-10 py-6 inline-flex flex-col">
          <h1 className="text-3xl font-bold text-zinc-900 leading-tight">
            {graph.name}
          </h1>
          <div className="flex items-center gap-3 mt-3 text-m text-zinc-400">
            <span>
              {lang === "fr"
                ? `Publié le ${formatDate(graph.createdAt, lang)}`
                : `Posted on ${formatDate(graph.createdAt, lang)}`}
            </span>
            <span>·</span>
            <span>Auteur</span>
          </div>

          <div className="shrink-0 bg-white border-b border-gray-100">
            <button
              onClick={() => setDescriptionOpen((o) => !o)}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors mt-2"
            >
              {descriptionOpen
                ? lang === "fr"
                  ? "Masquer la description"
                  : "Hide description"
                : lang === "fr"
                  ? "Voir la description"
                  : "About this graph"}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${descriptionOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${descriptionOpen ? "max-h-48 mt-4" : "max-h-0"}`}
          >
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">
                {(graph.description ?? null)
                  ? graph.description
                  : "Aucune description disponible."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Graph */}
        <div className="flex-1 relative overflow-hidden">
          {!graph && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                <span className="text-sm">
                  {lang === "fr" ? "Chargement..." : "Loading..."}
                </span>
              </div>
            </div>
          )}

          {/* Legend */}
          {graph && (
            <div className="absolute top-3 left-4 z-10">
              <button
                onClick={() => setShowLegend((l) => !l)}
                className="flex items-center gap-2 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <div className="flex gap-1">
                  {!showLegend &&
                    [...new Set(graph.nodes.map((n) => n.type))]
                      .slice(0, 3)
                      .map((type) => (
                        <div
                          key={type}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: getNodeColor(type) }}
                        />
                      ))}
                </div>
                {showLegend
                  ? lang === "fr"
                    ? "Masquer légende"
                    : "Hide"
                  : lang === "fr"
                    ? "Légende"
                    : "Legend"}
              </button>

              {showLegend && (
                <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 shadow-sm max-w-xs">
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(graph.nodes.map((n) => n.type))].map(
                      (type) => (
                        <div key={type} className="flex items-center gap-1.5">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: getNodeColor(type) }}
                          />
                          <span className="text-xs text-zinc-600">{type}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={containerRef} className="w-full h-full" />
        </div>

        {selectedNode && (
          <aside className="shrink-0 bg-white border-l border-gray-200 overflow-y-auto position-absolute w-80">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className="inline-block text-xs font-medium px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                >
                  {selectedNode.type}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Label */}
              <h2 className="text-xl font-bold text-zinc-900 mb-6">
                {selectedNode.label}
              </h2>

              {/* Properties */}
              {selectedNode.properties.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    {lang === "fr" ? "Informations" : "Information"}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {selectedNode.properties.map((prop) => (
                      <div key={prop.name} className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-zinc-400 capitalize">
                          {prop.name.replaceAll("_", " ")}
                        </span>
                        <span className="text-sm text-zinc-900 leading-relaxed">
                          {prop.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {selectedNode.properties.length > 0 && (
                <div className="border-t border-gray-100 mb-6" />
              )}

              {/* Relations */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  {lang === "fr" ? "Relations" : "Relationships"}
                </h3>
                <div className="flex flex-col gap-2">
                  {graph?.relationships
                    .filter(
                      (r) =>
                        r.fromId === selectedNode.id ||
                        r.toId === selectedNode.id,
                    )
                    .map((rel) => {
                      const isFrom = rel.fromId === selectedNode.id;
                      const otherId = isFrom ? rel.toId : rel.fromId;
                      const otherNode = graph.nodes.find(
                        (n) => n.id === otherId,
                      );
                      return (
                        <div
                          key={rel.id}
                          onClick={() => {
                            const found =
                              graph.nodes.find((n) => n.id === otherId) ?? null;
                            setSelectedNode(found);
                          }}
                          className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl text-sm cursor-pointer hover:bg-zinc-100 transition-colors"
                        >
                          <span
                            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${isFrom ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
                          >
                            {isFrom ? "→" : "←"}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-zinc-400 text-xs truncate">
                              {rel.type}
                            </span>
                            <span className="text-zinc-900 font-medium truncate">
                              {otherNode?.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default GraphView;
