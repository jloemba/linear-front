import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import type { IClothDetail, IClothUpdatePayload } from "../../types/cloth";
import {
  getClothChartElements,
  getClothChartLayout,
  getClothChartStyle,
} from "../../utils/clothChart";

type GraphData = Pick<IClothDetail, "nodes" | "relationships"> | IClothUpdatePayload;
type GraphVariant = "editor" | "view";

interface Props {
  data: GraphData;
  lang: "fr" | "en";
  variant: GraphVariant;
  className?: string;
  isFullscreen?: boolean;
  selectedNodeId?: string | null;
  fitPadding?: number;
  focusPadding?: number;
  onSelectNode?: (nodeId: string | null) => void;
}

const ClothGraphCanvas = ({
  data,
  lang,
  variant,
  className,
  isFullscreen = false,
  selectedNodeId = null,
  fitPadding,
  focusPadding,
  onSelectNode,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: getClothChartElements(data, lang),
      style: getClothChartStyle(variant),
      layout: getClothChartLayout(variant, isFullscreen),
    });

    cy.on("tap", "node", (event) => {
      onSelectNode?.(event.target.id());
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        onSelectNode?.(null);
      }
    });

    cyRef.current = cy;

    if (selectedNodeId && cy.getElementById(selectedNodeId).length > 0) {
      cy.getElementById(selectedNodeId).select();
    } else {
      cy.fit(undefined, fitPadding ?? (variant === "view" ? 60 : isFullscreen ? 40 : 20));
    }

    return () => {
      cy.destroy();
    };
  }, [
    data,
    fitPadding,
    isFullscreen,
    lang,
    onSelectNode,
    selectedNodeId,
    variant,
  ]);

  useEffect(() => {
    const cy = cyRef.current;

    if (!cy) return;

    cy.resize();
    cy.elements().unselect();

    if (selectedNodeId) {
      const selectedElement = cy.getElementById(selectedNodeId);
      if (selectedElement.length > 0) {
        selectedElement.select();
        cy.animate({
          fit: {
            eles: selectedElement.closedNeighborhood(),
            padding:
              focusPadding ?? (variant === "view" ? 60 : isFullscreen ? 52 : 28),
          },
          duration: 250,
        });
      }
    } else {
      cy.animate({
        fit: {
          eles: cy.elements(),
          padding: fitPadding ?? (variant === "view" ? 60 : isFullscreen ? 40 : 24),
        },
        duration: 250,
      });
    }
  }, [fitPadding, focusPadding, isFullscreen, selectedNodeId, variant, data]);

  return <div ref={containerRef} className={className} />;
};

export default ClothGraphCanvas;
