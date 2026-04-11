import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackCanvasView, trackNodeClick } from "../../api/analytics/analyticsApi";
import { deleteClothById, fetchClothById } from "../../api/cloth/clothApi";
import type { IClothDetail, IClothNode } from "../../types/cloth";
import useAuth from "../useAuthHook/useAuth";
import useSnackbar from "../useSnackbarHook/useSnackbar";

interface Props {
  id?: string;
  deleteSuccessMessage: string;
  deleteErrorMessage: string;
}

const recentTrackedViews = new Map<string, number>();
const VIEW_DEDUP_WINDOW_MS = 1500;

const useClothView = ({
  id,
  deleteSuccessMessage,
  deleteErrorMessage,
}: Props) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const [cloth, setCloth] = useState<IClothDetail | null>(null);
  const [selectedNode, setSelectedNode] = useState<IClothNode | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // TODO : Un seul useEffet

  useEffect(() => {
    if (!id) return;
    fetchClothById(id).then(setCloth);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const now = Date.now();
    const lastTrackedAt = recentTrackedViews.get(id);

    if (lastTrackedAt && now - lastTrackedAt < VIEW_DEDUP_WINDOW_MS) {
      return;
    }

    recentTrackedViews.set(id, now);

    void trackCanvasView(id).catch((error) => {
      console.error("Unable to track canvas view", error);
    });
  }, [id]);

  const handleSelectNode = (nodeId: string | null) => {
    if (!cloth || !nodeId) {
      setSelectedNode(null);
      return;
    }

    const found = cloth.nodes.find((node) => node.id === nodeId) ?? null;
    setSelectedNode(found);
  };

  const handleNodeTap = (nodeId: string) => {
    if (!id) return;

    void trackNodeClick(id, nodeId).catch((error) => {
      console.error("Unable to track node click", error);
    });
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!id) return;

    // Todo : mettre ce texte dans les fichiers de langue + Mettre les typesSnackbar dans une enum pour éviter les erreurs de string
    if (!isAuthenticated) {
      showSnackbar({
        message: 'Connectez-vous pour supprimer cette toile',
        type: "warning",
      });
      return;
    }

    try {
      await deleteClothById(id);
      setIsDeleteDialogOpen(false);
      showSnackbar({
        message: deleteSuccessMessage,
        type: "success",
      });
      navigate("/", {
        replace: true,
      });
    } catch {
      showSnackbar({
        message: deleteErrorMessage,
        type: "error",
      });
    }
  };

  return {
    cloth,
    selectedNode,
    showLegend,
    descriptionOpen,
    isDeleteDialogOpen,
    setSelectedNode,
    setShowLegend,
    setDescriptionOpen,
    handleSelectNode,
    handleNodeTap,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  };
};

export default useClothView;
