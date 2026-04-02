import {
  getClothChartElements,
  getClothChartLayout,
  getClothChartStyle,
  getClothNodeColor,
} from "./clothChart";
import { makeClothPayload, makeNode, makeRelationship } from "../test/factories/cloth";

describe("clothChart", () => {
  it("returns known and fallback node colors", () => {
    expect(getClothNodeColor("ARTIST")).toBe("#DB2777");
    expect(getClothNodeColor("UNKNOWN_TYPE")).toBe("#44403c");
    expect(getClothNodeColor("")).toBe("#78716c");
  });

  it("builds graph elements and filters incomplete relationships", () => {
    const elements = getClothChartElements(
      makeClothPayload({
        nodes: [
          makeNode({ id: "node-1", label: "", type: "ARTIST" }),
          makeNode({ id: "node-2", label: "AZ", type: "PERSON" }),
        ],
        relationships: [
          makeRelationship({
            id: "rel-1",
            fromId: "node-1",
            toId: "node-2",
            type: "COLLABORATED_WITH",
          }),
          makeRelationship({
            id: "rel-2",
            fromId: "",
            toId: "node-2",
          }),
        ],
      }),
      "fr",
    );

    expect(elements).toHaveLength(3);
    expect(elements[0]).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          label: "Sans titre",
          color: "#DB2777",
        }),
      }),
    );
    expect(elements[2]).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          source: "node-1",
          target: "node-2",
        }),
      }),
    );
  });

  it("returns the right style variants for view and editor", () => {
    const viewStyles = getClothChartStyle("view");
    const editorStyles = getClothChartStyle("editor");

    expect(viewStyles).toHaveLength(5);
    expect(editorStyles).toHaveLength(3);
    expect(viewStyles[0].selector).toBe("node");
    expect(editorStyles[1].selector).toBe("node:selected");
  });

  it("returns the expected layout config for each variant", () => {
    expect(getClothChartLayout("view")).toEqual(
      expect.objectContaining({
        name: "breadthfirst",
        padding: 60,
        spacingFactor: 1.2,
      }),
    );

    expect(getClothChartLayout("editor", true)).toEqual(
      expect.objectContaining({
        name: "breadthfirst",
        padding: 48,
        spacingFactor: 1.5,
      }),
    );
  });
});
