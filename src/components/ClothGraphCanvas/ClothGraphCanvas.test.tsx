import { render } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ClothGraphCanvas from "./ClothGraphCanvas";

// 1. Initialisation "hoisted" (élevée) au-dessus des imports
const { mockCytoscape, mockCyInstance } = vi.hoisted(() => {
  const instance = {
    on: vi.fn().mockReturnThis(),
    fit: vi.fn().mockReturnThis(),
    resize: vi.fn().mockReturnThis(),
    destroy: vi.fn().mockReturnThis(),
    animate: vi.fn().mockReturnThis(),
    elements: vi.fn().mockReturnValue({
      unselect: vi.fn().mockReturnThis(),
    }),
    getElementById: vi.fn().mockReturnValue({
      length: 1,
      select: vi.fn().mockReturnThis(),
      closedNeighborhood: vi.fn().mockReturnThis(),
    }),
  };

  return {
    mockCyInstance: instance,
    mockCytoscape: vi.fn(() => instance),
  };
});

// 2. Mock du module utilisant la variable élevée
vi.mock("cytoscape", () => ({
  default: mockCytoscape,
}));

// Mock des utilitaires pour isoler le test du composant
vi.mock("../../utils/clothChart", () => ({
  getClothChartElements: vi.fn(() => []),
  getClothChartStyle: vi.fn(() => ({})),
  getClothChartLayout: vi.fn(() => ({})),
}));

describe("ClothGraphCanvas", () => {
  const defaultProps = {
    data: { nodes: [], relationships: [] },
    lang: "fr" as const,
    variant: "view" as const,
    onSelectNode: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doit initialiser cytoscape avec le bon conteneur", () => {
    render(<ClothGraphCanvas {...defaultProps} />);
    
    // Vérifie que cytoscape a été appelé avec un élément HTML (le containerRef)
    expect(mockCytoscape).toHaveBeenCalledWith(
      expect.objectContaining({
        container: expect.any(HTMLDivElement),
      })
    );
  });

  it("doit appeler destroy lors du démontage du composant", () => {
    const { unmount } = render(<ClothGraphCanvas {...defaultProps} />);
    unmount();
    expect(mockCyInstance.destroy).toHaveBeenCalled();
  });

  it("doit sélectionner le nœud si selectedNodeId est présent", () => {
    render(<ClothGraphCanvas {...defaultProps} selectedNodeId="node-123" />);
    
    expect(mockCyInstance.getElementById).toHaveBeenCalledWith("node-123");
  });

  it("doit appeler resize et animate lors d'un changement de data", () => {
    const { rerender } = render(<ClothGraphCanvas {...defaultProps} />);
    
    // Utilise des données compatibles avec le type attendu pour éviter l'erreur de type
    const newData = {
      nodes: [{ id: "1", label: "node1", type: "test", description: "test node" }],
      relationships: [],
    } as unknown as typeof defaultProps.data;

    rerender(<ClothGraphCanvas {...defaultProps} data={newData} />);

    expect(mockCyInstance.resize).toHaveBeenCalled();
    expect(mockCyInstance.animate).toHaveBeenCalled();
  });
});