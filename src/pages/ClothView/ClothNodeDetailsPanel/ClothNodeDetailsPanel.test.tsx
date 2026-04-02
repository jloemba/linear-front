import { fireEvent, screen } from "@testing-library/react";
import ClothNodeDetailsPanel from "./ClothNodeDetailsPanel";
import { renderWithProviders } from "../../../test/renderWithProviders";
import type { IClothDetail, IClothNode } from "../../../types/cloth";

const selectedNode: IClothNode = {
  id: "node-1",
  label: "Nas",
  type: "RAPPER",
  properties: [
    {
      name: "birth_date",
      valueType: "string",
      stringValue: "1973",
    },
  ],
};

const cloth: IClothDetail = {
  id: "cloth-1",
  name: "Hip Hop",
  description: null,
  createdAt: "2026-04-02T00:00:00.000Z",
  type: "MUSIC",
  nodes: [
    selectedNode,
    {
      id: "node-2",
      label: "AZ",
      type: "RAPPER",
      properties: [],
    },
  ],
  relationships: [
    {
      id: "rel-1",
      fromId: "node-1",
      toId: "node-2",
      type: "COLLABORATED_WITH",
      startDate: null,
      endDate: null,
    },
  ],
};

describe("ClothNodeDetailsPanel", () => {
  it("selects a related node when a relationship item is clicked", async () => {
    const onSelectNode = vi.fn();

    renderWithProviders(
      <ClothNodeDetailsPanel
        cloth={cloth}
        selectedNode={selectedNode}
        informationLabel="Informations"
        relationshipsLabel="Relations"
        onClose={() => undefined}
        onSelectNode={onSelectNode}
      />,
    );

    fireEvent.click(screen.getByText("AZ"));

    expect(onSelectNode).toHaveBeenCalledWith("node-2");
  });
});
