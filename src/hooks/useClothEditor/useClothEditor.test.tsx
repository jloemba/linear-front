import { act, renderHook, waitFor } from "@testing-library/react";
import { getClothMessages } from "../../i18n/cloth";
import { makeClothDetail } from "../../test/factories/cloth";
import useClothEditor from "./useClothEditor";

const navigateMock = vi.fn();
const showSnackbarMock = vi.fn();
const fetchClothByIdMock = vi.fn();
const updateClothByIdMock = vi.fn();
const createClothMock = vi.fn();
const deleteClothByIdMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../useSnackbar/useSnackbar", () => ({
  default: () => ({
    showSnackbar: showSnackbarMock,
  }),
}));

vi.mock("../../api/cloth/clothApi", () => ({
  fetchClothById: (...args: unknown[]) => fetchClothByIdMock(...args),
  updateClothById: (...args: unknown[]) => updateClothByIdMock(...args),
  createCloth: (...args: unknown[]) => createClothMock(...args),
  deleteClothById: (...args: unknown[]) => deleteClothByIdMock(...args),
}));

const { common, editor } = getClothMessages("fr");

describe("useClothEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a cloth and redirects to edit mode", async () => {
    createClothMock.mockResolvedValue(
      makeClothDetail({
        name: "My cloth",
        nodes: [],
        relationships: [],
      }),
    );

    const { result } = renderHook(() =>
      useClothEditor({
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.updateClothField("name", "My cloth");
      const firstNodeId = result.current.form?.nodes[0]?.id ?? "";
      result.current.updateNode(firstNodeId, (node) => ({
        ...node,
        label: "Nas",
        type: "RAPPER",
      }));
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(createClothMock).toHaveBeenCalled();
    expect(showSnackbarMock).toHaveBeenCalledWith({
      message: editor.createSuccess,
      type: "success",

    });
    expect(navigateMock).toHaveBeenCalledWith("/cloth/cloth-1/edit", {
      replace: true,
    });
  });

  it("loads and updates an existing cloth", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        name: "Loaded cloth",
        nodes: [],
        relationships: [],
      }),
    );
    updateClothByIdMock.mockResolvedValue(
      makeClothDetail({
        name: "Updated cloth",
        nodes: [],
        relationships: [],
      }),
    );

    const { result } = renderHook(() =>
      useClothEditor({
        id: "cloth-1",
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.form?.name).toBe("Loaded cloth");
    });

    act(() => {
      result.current.updateClothField("name", "Updated cloth");
      const firstNodeId = result.current.form?.nodes[0]?.id ?? "";
      result.current.updateNode(firstNodeId, (node) => ({
        ...node,
        label: "Nas",
        type: "RAPPER",
      }));
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(updateClothByIdMock).toHaveBeenCalledWith(
      "cloth-1",
      expect.objectContaining({ name: "Updated cloth" }),
    );
    expect(showSnackbarMock).toHaveBeenCalledWith({
      message: editor.saveSuccess,
      type: "success",

    });
  });

  it("opens the delete dialog and deletes the cloth", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        name: "Loaded cloth",
        nodes: [],
        relationships: [],
      }),
    );
    deleteClothByIdMock.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useClothEditor({
        id: "cloth-1",
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.openDeleteDialog();
    });

    expect(result.current.isDeleteDialogOpen).toBe(true);

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(deleteClothByIdMock).toHaveBeenCalledWith("cloth-1");
    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
  });

  it("shows an error snackbar when save fails", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        name: "Loaded cloth",
        nodes: [],
        relationships: [],
      }),
    );
    updateClothByIdMock.mockRejectedValue(new Error("save failed"));

    const { result } = renderHook(() =>
      useClothEditor({
        id: "cloth-1",
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.updateClothField("name", "Updated cloth");
      const firstNodeId = result.current.form?.nodes[0]?.id ?? "";
      result.current.updateNode(firstNodeId, (node) => ({
        ...node,
        label: "Nas",
        type: "RAPPER",
      }));
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(showSnackbarMock).toHaveBeenCalledWith({
      message: editor.saveError,
      type: "error",

    });
  });

  it("sets an error when cloth loading fails", async () => {
    fetchClothByIdMock.mockRejectedValue(new Error("load failed"));

    const { result } = renderHook(() =>
      useClothEditor({
        id: "cloth-1",
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(editor.loadError);
    expect(result.current.form).toBeNull();
  });

  it("sets a validation error instead of saving an invalid payload", async () => {
    const { result } = renderHook(() =>
      useClothEditor({
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.updateClothField("name", "");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toBe(editor ? "Le nom de la toile est requis." : null);
    expect(createClothMock).not.toHaveBeenCalled();
  });

  it("redirects home when delete is requested in create mode", () => {
    const { result } = renderHook(() =>
      useClothEditor({
        lang: "fr",
        common,
        editor,
      }),
    );

    act(() => {
      result.current.openDeleteDialog();
    });

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("shows an error snackbar when delete fails", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        name: "Loaded cloth",
        nodes: [],
        relationships: [],
      }),
    );
    deleteClothByIdMock.mockRejectedValue(new Error("delete failed"));

    const { result } = renderHook(() =>
      useClothEditor({
        id: "cloth-1",
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.openDeleteDialog();
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(showSnackbarMock).toHaveBeenCalledWith({
      message: editor.deleteError,
      type: "error",

    });
    expect(result.current.saving).toBe(false);
  });

  it("manages nodes, properties, relationships and scroll navigation", async () => {
    const scrollIntoViewMock = vi.fn();
    const getElementByIdSpy = vi
      .spyOn(document, "getElementById")
      .mockReturnValue({
        scrollIntoView: scrollIntoViewMock,
      } as unknown as HTMLElement);
    const requestAnimationFrameSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      });

    const { result } = renderHook(() =>
      useClothEditor({
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialNodeId = result.current.form?.nodes[0]?.id ?? "";

    act(() => {
      result.current.updateNode(initialNodeId, (node) => ({
        ...node,
        label: "Nas",
        type: "RAPPER",
        properties: [
          {
            name: "mentor",
            valueType: "reference",
            stringValue: null,
            dateValue: null,
            refNodeId: initialNodeId,
          },
        ],
      }));
      result.current.handleAddNode();
    });

    const addedNodeId =
      result.current.form?.nodes.find((node) => node.id !== initialNodeId)?.id ?? "";

    act(() => {
      result.current.toggleNodeCollapse(initialNodeId);
      result.current.toggleNodeCollapse(initialNodeId);
      result.current.handleAddProperty(initialNodeId);
      result.current.handlePropertyTypeChange(initialNodeId, 1, "date");
      result.current.handlePropertyTypeChange(initialNodeId, 1, "string");
      result.current.handlePropertyTypeChange(initialNodeId, 1, "reference");
      result.current.handleRemoveProperty(initialNodeId, 1);
      result.current.handleAddRelationship();
    });

    const relationshipId = result.current.form?.relationships[0]?.id ?? "";

    act(() => {
      result.current.updateRelationship(relationshipId, (relationship) => ({
        ...relationship,
        fromId: initialNodeId,
        toId: addedNodeId,
        type: "COLLABORATED_WITH",
      }));
      result.current.scrollToNode(initialNodeId);
      result.current.handleRemoveRelationship(relationshipId);
      result.current.handleRemoveNode(addedNodeId);
    });

    expect(result.current.form?.nodes).toHaveLength(1);
    expect(result.current.form?.relationships).toHaveLength(0);
    expect(result.current.collapsedNodeIds).toEqual([]);
    expect(getElementByIdSpy).toHaveBeenCalledWith(
      `node-section-${initialNodeId}`,
    );
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    requestAnimationFrameSpy.mockRestore();
    getElementByIdSpy.mockRestore();
  });

  it("does not close the delete dialog while saving and redirects delete in create mode", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        name: "Loaded cloth",
        nodes: [],
        relationships: [],
      }),
    );
    deleteClothByIdMock.mockResolvedValue(
      new Promise<void>(() => undefined),
    );

    const { result } = renderHook(() =>
      useClothEditor({
        id: "cloth-1",
        lang: "fr",
        common,
        editor,
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.openDeleteDialog();
    });

    expect(result.current.isDeleteDialogOpen).toBe(true);

    act(() => {
      void result.current.handleDelete();
    });

    act(() => {
      result.current.closeDeleteDialog();
    });

    expect(result.current.isDeleteDialogOpen).toBe(true);

    const createMode = renderHook(() =>
      useClothEditor({
        lang: "fr",
        common,
        editor,
      }),
    );

    act(() => {
      void createMode.result.current.handleDelete();
    });

    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
