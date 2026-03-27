import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import type { IClothUpdatePayload } from "../../../types/cloth";
import { NODE_TYPE_COLORS } from "../../../utils/const";

const panelClassName =
  "rounded-[28px] border border-stone-200 bg-white/90 shadow-[0_18px_60px_rgba(68,64,60,0.08)] backdrop-blur";

const getNodeColor = (type: string) => NODE_TYPE_COLORS[type] ?? "#44403c";

interface Props {
  form: IClothUpdatePayload;
  lang: "fr" | "en";
  saving: boolean;
  isDirty: boolean;
  error: string | null;
  successMessage: string | null;
  onSubmit: () => void;
}

const ClothPreviewPanel = ({
  form,
  lang,
  saving,
  isDirty,
  error,
  successMessage,
  onSubmit,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(form.nodes[0]?.id ?? null);

  useEffect(() => {
    if (!form.nodes.some((node) => node.id === selectedNodeId)) {
      setSelectedNodeId(form.nodes[0]?.id ?? null);
    }
  }, [form.nodes, selectedNodeId]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...form.nodes.map((node) => ({
          data: {
            id: node.id,
            label: node.label.trim() || (lang === "fr" ? "Sans titre" : "Untitled"),
            type: node.type,
            color: getNodeColor(node.type),
          },
        })),
        ...form.relationships
          .filter((relationship) => relationship.fromId && relationship.toId)
          .map((relationship) => ({
            data: {
              id: relationship.id,
              source: relationship.fromId,
              target: relationship.toId,
              label: relationship.type,
            },
          })),
      ],
      style: [
        {
          selector: "node",
          style: {
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
          style: {
            "border-width": 4,
            "border-color": "#f59e0b",
            "overlay-opacity": 0,
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.6,
            "line-color": "#d6d3d1",
            "target-arrow-color": "#d6d3d1",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.8,
          },
        },
      ],
      layout: {
        name: "breadthfirst",
        directed: true,
        padding: 24,
        spacingFactor: 1.15,
        avoidOverlap: true,
      },
    });

    cy.on("tap", "node", (event) => {
      setSelectedNodeId(event.target.id());
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        setSelectedNodeId(null);
      }
    });

    cyRef.current = cy;

    if (selectedNodeId && cy.getElementById(selectedNodeId).length > 0) {
      cy.getElementById(selectedNodeId).select();
    } else {
      cy.fit(undefined, 20);
    }

    return () => {
      cy.destroy();
    };
  }, [form, lang, selectedNodeId]);

  useEffect(() => {
    const cy = cyRef.current;

    if (!cy) return;

    cy.elements().unselect();

    if (selectedNodeId) {
      const selectedElement = cy.getElementById(selectedNodeId);
      if (selectedElement.length > 0) {
        selectedElement.select();
        cy.animate({
          fit: {
            eles: selectedElement.closedNeighborhood(),
            padding: 28,
          },
          duration: 250,
        });
      }
    } else {
      cy.animate({
        fit: {
          eles: cy.elements(),
          padding: 24,
        },
        duration: 250,
      });
    }
  }, [selectedNodeId, form]);

  return (
    <section className={`${panelClassName} overflow-hidden`}>
      <div className="bg-[linear-gradient(135deg,#292524_0%,#0c0a09_100%)] px-6 py-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mt-2 text-2xl font-semibold">
              {lang === "fr" ? "Apercu live" : "Live preview"}
            </h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-stone-100">
            {isDirty
              ? lang === "fr"
                ? "Brouillon"
                : "Draft"
              : lang === "fr"
                ? "Synchro"
                : "Synced"}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                {lang === "fr" ? "Canvas" : "Canvas"}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {lang === "fr"
                  ? "Clique un noeud pour previsualiser le panneau de droite."
                  : "Click a node to preview the right-side panel."}
              </p>
            </div>
          </div>

          <div ref={containerRef} className="h-64 w-full bg-stone-50" />
        </div>

        {error && (
          <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(234,88,12,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? lang === "fr"
                ? "Sauvegarde en cours..."
                : "Saving..."
              : lang === "fr"
                ? "Publier la nouvelle version"
                : "Publish updated version"}
          </button>

          {/* <button
            type="button"
            onClick={onExit}
            className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
          >
            {lang === "fr" ? "Quitter l'editeur" : "Leave editor"}
          </button> */}
        </div>

    
      </div>
    </section>
  );
};

export default ClothPreviewPanel;
