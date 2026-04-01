import { useEffect, useState } from "react";
import { fetchClothById } from "../../api/clothApi";
import type { IClothDetail, IClothNode } from "../../types/cloth";

interface Props {
  id?: string;
}

const useClothView = ({ id }: Props) => {
  const [cloth, setCloth] = useState<IClothDetail | null>(null);
  const [selectedNode, setSelectedNode] = useState<IClothNode | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

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

  return {
    cloth,
    selectedNode,
    showLegend,
    descriptionOpen,
    setSelectedNode,
    setShowLegend,
    setDescriptionOpen,
    handleSelectNode,
  };
};

export default useClothView;
