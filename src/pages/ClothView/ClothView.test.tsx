import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ClothView from "./ClothView";
import { LanguageProvider } from "../../context/Language/LanguageProvider";
import { ThemeProvider } from "../../context/Theme/ThemeProvider";
import { SnackbarProvider } from "../../context/Snackbar/SnackbarProvider";

const mockUseClothView = vi.fn();

vi.mock("../../hooks/useClothView/useClothView", () => ({
  default: (...args: unknown[]) => mockUseClothView(...args),
}));

vi.mock("../../components/ClothGraphCanvas/ClothGraphCanvas", () => ({
  default: ({
    onSelectNode,
  }: {
    onSelectNode?: (nodeId: string | null) => void;
  }) => (
    <div>
      <div>graph-canvas</div>
      <button type="button" onClick={() => onSelectNode?.("node-1")}>
        graph-select
      </button>
      <button type="button" onClick={() => onSelectNode?.(null)}>
        graph-clear
      </button>
    </div>
  ),
}));

vi.mock("./ClothViewHeader/ClothViewHeader", () => ({
  default: ({
    clothName,
    onToggleDescription,
    onDelete,
  }: {
    clothName: string;
    onToggleDescription: () => void;
    onDelete: () => void;
  }) => (
    <div>
      <div>{clothName}</div>
      <button type="button" onClick={onToggleDescription}>toggle-description</button>
      <button type="button" onClick={onDelete}>open-delete</button>
    </div>
  ),
}));

vi.mock("./ClothViewLegend/ClothViewLegend", () => ({
  default: ({ onToggleLegend }: { onToggleLegend: () => void }) => (
    <div>
      <div>view-legend</div>
      <button type="button" onClick={onToggleLegend}>toggle-legend</button>
    </div>
  ),
}));

vi.mock("./ClothNodeDetailsPanel/ClothNodeDetailsPanel", () => ({
  default: ({
    onClose,
    onSelectNode,
  }: {
    onClose: () => void;
    onSelectNode: (nodeId: string | null) => void;
  }) => (
    <div>
      <div>node-details-panel</div>
      <button type="button" onClick={onClose}>details-close</button>
      <button type="button" onClick={() => onSelectNode("node-2")}>details-select</button>
    </div>
  ),
}));

const renderViewPage = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <SnackbarProvider>
            <ClothView />
          </SnackbarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("ClothView page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the loading state while the cloth is unavailable", () => {
    mockUseClothView.mockReturnValue({
      cloth: null,
      selectedNode: null,
      showLegend: true,
      descriptionOpen: false,
      isDeleteDialogOpen: false,
      setSelectedNode: vi.fn(),
      setShowLegend: vi.fn(),
      setDescriptionOpen: vi.fn(),
      handleSelectNode: vi.fn(),
      handleNodeTap: vi.fn(),
      openDeleteDialog: vi.fn(),
      closeDeleteDialog: vi.fn(),
      handleDelete: vi.fn(),
    });

    renderViewPage();

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it("renders the cloth content and delete dialog", () => {
    const setSelectedNode = vi.fn();
    const setShowLegend = vi.fn();
    const setDescriptionOpen = vi.fn();
    const handleSelectNode = vi.fn();
    const handleNodeTap = vi.fn();
    const openDeleteDialog = vi.fn();
    const closeDeleteDialog = vi.fn();
    const handleDelete = vi.fn();

    //TODO : Mettre les type de cloth(Music , Business ,etc ...) dans une enum pour éviter les erreurs de string
    //TODO : Faire des mocks de cloths plus complets pour tester les différentes parties du composant (description, legend, node details panel, etc ...)
    mockUseClothView.mockReturnValue({
      cloth: {
        id: "cloth-1",
        name: "Hip Hop Legacy",
        description: null,
        type: "MUSIC",
        createdAt: "2026-04-02T00:00:00.000Z",
        nodes: [{ id: "node-1", label: "Nas", type: "RAPPER", properties: [] }],
        relationships: [],
      },
      selectedNode: { id: "node-1", label: "Nas", type: "RAPPER", properties: [] },
      showLegend: true,
      descriptionOpen: false,
      isDeleteDialogOpen: true,
      setSelectedNode,
      setShowLegend,
      setDescriptionOpen,
      handleSelectNode,
      handleNodeTap,
      openDeleteDialog,
      closeDeleteDialog,
      handleDelete,
    });

    renderViewPage();

    expect(screen.getByText("Hip Hop Legacy")).toBeInTheDocument();
    expect(screen.getByText("graph-canvas")).toBeInTheDocument();
    expect(screen.getByText("node-details-panel")).toBeInTheDocument();
    expect(screen.getByText(/confirmer la suppression/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "toggle-description" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle-legend" }));
    fireEvent.click(screen.getByRole("button", { name: "graph-select" }));
    fireEvent.click(screen.getByRole("button", { name: "details-close" }));
    fireEvent.click(screen.getByRole("button", { name: /supprimer la toile/i }));
    fireEvent.click(screen.getByRole("button", { name: /annuler/i }));

    expect(setDescriptionOpen).toHaveBeenCalledWith(expect.any(Function));
    expect(setShowLegend).toHaveBeenCalledWith(expect.any(Function));
    expect(handleSelectNode).toHaveBeenCalledWith("node-1");
    expect(setSelectedNode).toHaveBeenCalledWith(null);
    expect(closeDeleteDialog).toHaveBeenCalledTimes(1);
    expect(openDeleteDialog).not.toHaveBeenCalled();
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
