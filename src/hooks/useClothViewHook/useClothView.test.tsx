import { act, renderHook, waitFor } from "@testing-library/react";
import useClothView from "./useClothView";
import { makeClothDetail } from "../../test/factories/cloth";

const navigateMock = vi.fn();
const showSnackbarMock = vi.fn();
const fetchClothByIdMock = vi.fn();
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
  deleteClothById: (...args: unknown[]) => deleteClothByIdMock(...args),
}));

describe("useClothView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads a cloth and selects a node from the graph", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        name: "Hip Hop",
        nodes: [
          {
            id: "node-1",
            label: "Nas",
            type: "RAPPER",
            properties: [],
          },
        ],
        relationships: [],
      }),
    );

    const { result } = renderHook(() =>
      useClothView({
        id: "cloth-1",
        deleteSuccessMessage: "Deleted",
        deleteErrorMessage: "Delete failed",
      }),
    );

    await waitFor(() => {
      expect(result.current.cloth?.name).toBe("Hip Hop");
    });

    act(() => {
      result.current.handleSelectNode("node-1");
    });

    expect(result.current.selectedNode?.label).toBe("Nas");

    act(() => {
      result.current.handleSelectNode(null);
    });

    expect(result.current.selectedNode).toBeNull();

    act(() => {
      result.current.handleSelectNode("missing-node");
    });

    expect(result.current.selectedNode).toBeNull();
  });

  it("deletes a cloth and redirects home", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        name: "Hip Hop",
        nodes: [],
        relationships: [],
      }),
    );
    deleteClothByIdMock.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useClothView({
        id: "cloth-1",
        deleteSuccessMessage: "Deleted",
        deleteErrorMessage: "Delete failed",
      }),
    );

    await waitFor(() => {
      expect(result.current.cloth?.id).toBe("cloth-1");
    });

    act(() => {
      result.current.openDeleteDialog();
    });

    expect(result.current.isDeleteDialogOpen).toBe(true);

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(deleteClothByIdMock).toHaveBeenCalledWith("cloth-1");
    expect(showSnackbarMock).toHaveBeenCalledWith({
      message: "Deleted",
      type: "success",

    });
    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
  });

  it("opens and closes the delete dialog", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        nodes: [],
        relationships: [],
      }),
    );

    const { result } = renderHook(() =>
      useClothView({
        id: "cloth-1",
        deleteSuccessMessage: "Deleted",
        deleteErrorMessage: "Delete failed",
      }),
    );

    await waitFor(() => {
      expect(result.current.cloth?.id).toBe("cloth-1");
    });

    act(() => {
      result.current.openDeleteDialog();
    });

    expect(result.current.isDeleteDialogOpen).toBe(true);

    act(() => {
      result.current.closeDeleteDialog();
    });

    expect(result.current.isDeleteDialogOpen).toBe(false);
  });

  it("shows an error snackbar when deletion fails", async () => {
    fetchClothByIdMock.mockResolvedValue(
      makeClothDetail({
        nodes: [],
        relationships: [],
      }),
    );
    deleteClothByIdMock.mockRejectedValue(new Error("delete failed"));

    const { result } = renderHook(() =>
      useClothView({
        id: "cloth-1",
        deleteSuccessMessage: "Deleted",
        deleteErrorMessage: "Delete failed",
      }),
    );

    await waitFor(() => {
      expect(result.current.cloth?.id).toBe("cloth-1");
    });

    act(() => {
      result.current.openDeleteDialog();
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(showSnackbarMock).toHaveBeenCalledWith({
      message: "Delete failed",
      type: "error",

    });
    expect(navigateMock).not.toHaveBeenCalled();
    expect(result.current.isDeleteDialogOpen).toBe(true);
  });
});
