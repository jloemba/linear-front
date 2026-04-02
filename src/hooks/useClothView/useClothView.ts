import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteClothById, fetchClothById } from "../../api/clothApi";
import type { IClothDetail, IClothNode } from "../../types/cloth";
import useSnackbar from "../useSnackbar/useSnackbar";

interface Props {
  id?: string;
  deleteSuccessMessage: string;
  deleteErrorMessage: string;
}

const useClothView = ({
  id,
  deleteSuccessMessage,
  deleteErrorMessage,
}: Props) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [cloth, setCloth] = useState<IClothDetail | null>(null);
  const [selectedNode, setSelectedNode] = useState<IClothNode | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchClothById(id).then(setCloth);
  }, [id]);

  const handleSelectNode = (nodeId: string | null) => {
    if (!cloth || !nodeId) {
      setSelectedNode(null);
      return;
    }

    const found = cloth.nodes.find((node) => node.id === nodeId) ?? null;
    setSelectedNode(found);
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!id) return;

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
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  };
};

export default useClothView;
