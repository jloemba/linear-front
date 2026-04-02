import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ClothEditor from "./ClothEditor";
import { LanguageProvider } from "../../context/Language/LanguageProvider";
import { ThemeProvider } from "../../context/Theme/ThemeProvider";
import { SnackbarProvider } from "../../context/Snackbar/SnackbarProvider";

const useClothEditorMock = vi.fn();

vi.mock("../../hooks/useClothEditor/useClothEditor", () => ({
  default: (...args: unknown[]) => useClothEditorMock(...args),
}));

vi.mock("./ClothIdentitySection/ClothIdentitySection", () => ({
  default: ({
    onUpdateField,
  }: {
    onUpdateField: (field: "name" | "type" | "description", value: string) => void;
  }) => (
    <div>
      <div>identity-section</div>
      <button type="button" onClick={() => onUpdateField("name", "Updated cloth")}>
        identity-update
      </button>
    </div>
  ),
}));

vi.mock("./ClothNodesSection/ClothNodesSection", () => ({
  default: ({
    onToggleSectionCollapse,
    onAddNode,
    onToggleNodeCollapse,
    onRemoveNode,
    onUpdateNode,
    onAddProperty,
    onRemoveProperty,
    onUpdateProperty,
    onPropertyTypeChange,
  }: {
    onToggleSectionCollapse: () => void;
    onAddNode: () => void;
    onToggleNodeCollapse: (nodeId: string) => void;
    onRemoveNode: (nodeId: string) => void;
    onUpdateNode: (nodeId: string, updater: (node: { label: string }) => { label: string }) => void;
    onAddProperty: (nodeId: string) => void;
    onRemoveProperty: (nodeId: string, index: number) => void;
    onUpdateProperty: (nodeId: string, index: number, updater: (property: { name: string }) => { name: string }) => void;
    onPropertyTypeChange: (nodeId: string, index: number, valueType: string) => void;
  }) => (
    <div>
      <div>nodes-section</div>
      <button type="button" onClick={onToggleSectionCollapse}>nodes-toggle</button>
      <button type="button" onClick={onAddNode}>nodes-add</button>
      <button type="button" onClick={() => onToggleNodeCollapse("node-1")}>node-collapse</button>
      <button type="button" onClick={() => onRemoveNode("node-1")}>node-remove</button>
      <button
        type="button"
        onClick={() => onUpdateNode("node-1", (node) => ({ ...node, label: "Next" }))}
      >
        node-update
      </button>
      <button type="button" onClick={() => onAddProperty("node-1")}>property-add</button>
      <button type="button" onClick={() => onRemoveProperty("node-1", 0)}>property-remove</button>
      <button
        type="button"
        onClick={() =>
          onUpdateProperty("node-1", 0, (property) => ({ ...property, name: "birth_date" }))
        }
      >
        property-update
      </button>
      <button type="button" onClick={() => onPropertyTypeChange("node-1", 0, "date")}>
        property-type
      </button>
    </div>
  ),
}));

vi.mock("./ClothRelationshipsSection/ClothRelationshipsSection", () => ({
  default: ({
    onToggleCollapse,
    onAddRelationship,
    onRemoveRelationship,
    onUpdateRelationship,
  }: {
    onToggleCollapse: () => void;
    onAddRelationship: () => void;
    onRemoveRelationship: (relationshipId: string) => void;
    onUpdateRelationship: (
      relationshipId: string,
      updater: (relationship: { type: string }) => { type: string },
    ) => void;
  }) => (
    <div>
      <div>relationships-section</div>
      <button type="button" onClick={onToggleCollapse}>relationships-toggle</button>
      <button type="button" onClick={onAddRelationship}>relationships-add</button>
      <button type="button" onClick={() => onRemoveRelationship("rel-1")}>relationships-remove</button>
      <button
        type="button"
        onClick={() =>
          onUpdateRelationship("rel-1", (relationship) => ({ ...relationship, type: "MENTORS" }))
        }
      >
        relationships-update
      </button>
    </div>
  ),
}));

vi.mock("./ClothQuickNavigation/ClothQuickNavigation", () => ({
  default: ({
    onScrollToNode,
  }: {
    onScrollToNode: (nodeId: string) => void;
  }) => (
    <div>
      <div>quick-navigation</div>
      <button type="button" onClick={() => onScrollToNode("node-1")}>
        quick-scroll
      </button>
    </div>
  ),
}));

vi.mock("./ClothPreviewPanel/ClothPreviewPanel", () => ({
  default: ({ onSubmit }: { onSubmit: () => void }) => (
    <div>
      <div>preview-panel</div>
      <button type="button" onClick={onSubmit}>preview-submit</button>
    </div>
  ),
}));

const renderEditorPage = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <SnackbarProvider>
            <ClothEditor />
          </SnackbarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("ClothEditor page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the create mode layout", () => {
    const updateClothField = vi.fn();
    const setIsNodesSectionCollapsed = vi.fn();
    const setIsRelationshipsSectionCollapsed = vi.fn();
    const updateNode = vi.fn();
    const updateProperty = vi.fn();
    const handleAddNode = vi.fn();
    const handleRemoveNode = vi.fn();
    const toggleNodeCollapse = vi.fn();
    const handleAddProperty = vi.fn();
    const handleRemoveProperty = vi.fn();
    const handlePropertyTypeChange = vi.fn();
    const handleAddRelationship = vi.fn();
    const handleRemoveRelationship = vi.fn();
    const updateRelationship = vi.fn();
    const scrollToNode = vi.fn();
    const handleSubmit = vi.fn();

    useClothEditorMock.mockReturnValue({
      isCreateMode: true,
      isDeleteDialogOpen: false,
      form: {
        name: "",
        type: "MUSIC",
        description: "",
        nodes: [],
        relationships: [],
      },
      loading: false,
      saving: false,
      error: null,
      nodeOptions: [],
      collapsedNodeIds: [],
      isNodesSectionCollapsed: false,
      isRelationshipsSectionCollapsed: false,
      setIsNodesSectionCollapsed,
      setIsRelationshipsSectionCollapsed,
      updateClothField,
      updateNode,
      updateProperty,
      updateRelationship,
      handleAddNode,
      handleRemoveNode,
      toggleNodeCollapse,
      handleAddProperty,
      handleRemoveProperty,
      handlePropertyTypeChange,
      handleAddRelationship,
      handleRemoveRelationship,
      scrollToNode,
      handleSubmit,
      openDeleteDialog: vi.fn(),
      closeDeleteDialog: vi.fn(),
      handleDelete: vi.fn(),
    });

    renderEditorPage();

    expect(screen.getByText(/créer une toile/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /supprimer la toile/i })).not.toBeInTheDocument();
    expect(screen.getByText("identity-section")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "identity-update" }));
    fireEvent.click(screen.getByRole("button", { name: "nodes-toggle" }));
    fireEvent.click(screen.getByRole("button", { name: "node-update" }));
    fireEvent.click(screen.getByRole("button", { name: "relationships-toggle" }));
    fireEvent.click(screen.getByRole("button", { name: "quick-scroll" }));
    fireEvent.click(screen.getByRole("button", { name: "preview-submit" }));

    expect(updateClothField).toHaveBeenCalledWith("name", "Updated cloth");
    expect(setIsNodesSectionCollapsed).toHaveBeenCalledWith(expect.any(Function));
    expect(updateNode).toHaveBeenCalled();
    expect(setIsRelationshipsSectionCollapsed).toHaveBeenCalledWith(
      expect.any(Function),
    );
    expect(scrollToNode).toHaveBeenCalledWith("node-1");
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleAddNode).not.toHaveBeenCalled();
    expect(toggleNodeCollapse).not.toHaveBeenCalled();
    expect(handleRemoveNode).not.toHaveBeenCalled();
    expect(handleAddProperty).not.toHaveBeenCalled();
    expect(handleRemoveProperty).not.toHaveBeenCalled();
    expect(updateProperty).not.toHaveBeenCalled();
    expect(handlePropertyTypeChange).not.toHaveBeenCalled();
    expect(handleAddRelationship).not.toHaveBeenCalled();
    expect(handleRemoveRelationship).not.toHaveBeenCalled();
    expect(updateRelationship).not.toHaveBeenCalled();
  });

  it("renders the delete dialog in edit mode", () => {
    useClothEditorMock.mockReturnValue({
      isCreateMode: false,
      isDeleteDialogOpen: true,
      form: {
        name: "Hip Hop",
        type: "MUSIC",
        description: "",
        nodes: [],
        relationships: [],
      },
      loading: false,
      saving: false,
      error: null,
      nodeOptions: [],
      collapsedNodeIds: [],
      isNodesSectionCollapsed: false,
      isRelationshipsSectionCollapsed: false,
      setIsNodesSectionCollapsed: vi.fn(),
      setIsRelationshipsSectionCollapsed: vi.fn(),
      updateClothField: vi.fn(),
      updateNode: vi.fn(),
      updateProperty: vi.fn(),
      updateRelationship: vi.fn(),
      handleAddNode: vi.fn(),
      handleRemoveNode: vi.fn(),
      toggleNodeCollapse: vi.fn(),
      handleAddProperty: vi.fn(),
      handleRemoveProperty: vi.fn(),
      handlePropertyTypeChange: vi.fn(),
      handleAddRelationship: vi.fn(),
      handleRemoveRelationship: vi.fn(),
      scrollToNode: vi.fn(),
      handleSubmit: vi.fn(),
      openDeleteDialog: vi.fn(),
      closeDeleteDialog: vi.fn(),
      handleDelete: vi.fn(),
    });

    renderEditorPage();

    expect(screen.getByText(/éditer une toile/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /supprimer la toile/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/confirmer la suppression/i)).toBeInTheDocument();
  });

  it("renders the loading skeleton", () => {
    useClothEditorMock.mockReturnValue({
      isCreateMode: false,
      isDeleteDialogOpen: false,
      form: null,
      loading: true,
      saving: false,
      error: null,
    });

    const { container } = renderEditorPage();

    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("renders the load error state when no form is available", () => {
    useClothEditorMock.mockReturnValue({
      isCreateMode: false,
      isDeleteDialogOpen: false,
      form: null,
      loading: false,
      saving: false,
      error: "Impossible de charger cette toile.",
    });

    renderEditorPage();

    expect(
      screen.getByText(/impossible de charger cette toile/i),
    ).toBeInTheDocument();
  });
});
