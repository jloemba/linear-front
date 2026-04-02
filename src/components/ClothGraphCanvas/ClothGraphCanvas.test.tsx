import { render } from "@testing-library/react";
import ClothGraphCanvas from "./ClothGraphCanvas";

const onMock = vi.fn();
const fitMock = vi.fn();
const animateMock = vi.fn();
const resizeMock = vi.fn();
const destroyMock = vi.fn();
const elementsMock = vi.fn(() => ({ unselect: vi.fn() }));
const selectMock = vi.fn();
const closedNeighborhoodMock = vi.fn(() => "neighborhood");
const getElementByIdMock = vi.fn(() => ({
  length: 0,
  select: selectMock,
  closedNeighborhood: closedNeighborhoodMock,
}));

const cyInstance = {
  on: onMock,
  fit: fitMock,
  animate: animateMock,
  resize: resizeMock,
  destroy: destroyMock,
  elements: elementsMock,
  getElementById: getElementByIdMock,
};

const cytoscapeMock = vi.fn(() => cyInstance);
const getClothChartElementsMock = vi.fn(() => []);
const getClothChartLayoutMock = vi.fn(() => ({ name: "breadthfirst" }));
const getClothChartStyleMock = vi.fn(() => []);

vi.mock("cytoscape", () => ({
  default: (...args: unknown[]) => cytoscapeMock(...args),
}));

vi.mock("../../utils/clothChart", () => ({
  getClothChartElements: (...args: unknown[]) => getClothChartElementsMock(...args),
  getClothChartLayout: (...args: unknown[]) => getClothChartLayoutMock(...args),
  getClothChartStyle: (...args: unknown[]) => getClothChartStyleMock(...args),
}));

describe("ClothGraphCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes cytoscape with the expected graph config", () => {
    render(
      <ClothGraphCanvas
        data={{ nodes: [], relationships: [] }}
        lang="fr"
        variant="editor"
        className="graph"
      />,
    );

    expect(cytoscapeMock).toHaveBeenCalled();
    expect(getClothChartElementsMock).toHaveBeenCalledWith(
      { nodes: [], relationships: [] },
      "fr",
    );
    expect(getClothChartStyleMock).toHaveBeenCalledWith("editor");
    expect(getClothChartLayoutMock).toHaveBeenCalledWith("editor", false);
  });

  it("selects a node on init when selectedNodeId exists", () => {
    getElementByIdMock.mockReturnValue({
      length: 1,
      select: selectMock,
      closedNeighborhood: closedNeighborhoodMock,
    });

    render(
      <ClothGraphCanvas
        data={{ nodes: [], relationships: [] }}
        lang="en"
        variant="view"
        selectedNodeId="node-1"
      />,
    );

    expect(selectMock).toHaveBeenCalled();
    expect(fitMock).not.toHaveBeenCalled();
  });

  it("handles node selection and background deselection", () => {
    const onSelectNode = vi.fn();

    render(
      <ClothGraphCanvas
        data={{ nodes: [], relationships: [] }}
        lang="fr"
        variant="editor"
        onSelectNode={onSelectNode}
      />,
    );

    const nodeTapHandler = onMock.mock.calls.find(
      ([event, selector]) => event === "tap" && selector === "node",
    )?.[2];
    const canvasTapHandler = onMock.mock.calls.find(
      ([event, selector]) => event === "tap" && typeof selector === "function",
    )?.[1];

    nodeTapHandler?.({ target: { id: () => "node-2" } });
    canvasTapHandler?.({ target: cyInstance });

    expect(onSelectNode).toHaveBeenCalledWith("node-2");
    expect(onSelectNode).toHaveBeenCalledWith(null);
  });

  it("animates focus when a selected node exists and fits all elements otherwise", () => {
    getElementByIdMock.mockReturnValue({
      length: 1,
      select: selectMock,
      closedNeighborhood: closedNeighborhoodMock,
    });

    const { rerender, unmount } = render(
      <ClothGraphCanvas
        data={{ nodes: [], relationships: [] }}
        lang="fr"
        variant="editor"
        selectedNodeId="node-1"
      />,
    );

    expect(animateMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        fit: expect.objectContaining({
          eles: "neighborhood",
        }),
      }),
    );

    getElementByIdMock.mockReturnValue({
      length: 0,
      select: selectMock,
      closedNeighborhood: closedNeighborhoodMock,
    });

    rerender(
      <ClothGraphCanvas
        data={{ nodes: [], relationships: [] }}
        lang="fr"
        variant="editor"
        selectedNodeId={null}
      />,
    );

    expect(animateMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        fit: expect.objectContaining({
          eles: expect.anything(),
        }),
      }),
    );

    unmount();
    expect(destroyMock).toHaveBeenCalled();
  });
});
