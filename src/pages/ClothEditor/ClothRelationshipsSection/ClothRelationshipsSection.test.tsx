import { fireEvent, screen } from "@testing-library/react";
import ClothRelationshipsSection from "./ClothRelationshipsSection";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { getClothMessages } from "../../../i18n/cloth";
import type { IClothRelationship } from "../../../types/cloth";

const relationship: IClothRelationship = {
  id: "rel-1",
  fromId: "node-1",
  toId: "node-2",
  type: "COLLABORATED_WITH",
  startDate: null,
  endDate: null,
};

describe("ClothRelationshipsSection", () => {
  it("wires relationship actions and updates", () => {
    const messages = getClothMessages("fr");
    const onAddRelationship = vi.fn();
    const onRemoveRelationship = vi.fn();
    const onUpdateRelationship = vi.fn();

    renderWithProviders(
      <ClothRelationshipsSection
        relationships={[relationship]}
        nodeOptions={[
          { id: "node-1", label: "Nas" },
          { id: "node-2", label: "AZ" },
        ]}
        common={messages.common}
        editor={messages.editor}
        isCollapsed={false}
        onToggleCollapse={() => undefined}
        onAddRelationship={onAddRelationship}
        onRemoveRelationship={onRemoveRelationship}
        onUpdateRelationship={onUpdateRelationship}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /ajouter une relation/i }));
    fireEvent.click(screen.getByRole("button", { name: /supprimer la relation/i }));
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "node-2" },
    });

    expect(onAddRelationship).toHaveBeenCalledTimes(1);
    expect(onRemoveRelationship).toHaveBeenCalledWith("rel-1");
    expect(onUpdateRelationship).toHaveBeenCalled();
  });

  it("renders the empty state and collapsed label", () => {
    const messages = getClothMessages("en");
    const onToggleCollapse = vi.fn();

    renderWithProviders(
      <ClothRelationshipsSection
        relationships={[]}
        nodeOptions={[]}
        common={messages.common}
        editor={messages.editor}
        isCollapsed
        onToggleCollapse={onToggleCollapse}
        onAddRelationship={() => undefined}
        onRemoveRelationship={() => undefined}
        onUpdateRelationship={() => undefined}
      />,
    );

    expect(screen.getByText(/no relationships yet/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it("updates each relationship field", () => {
    const messages = getClothMessages("en");
    const onUpdateRelationship = vi.fn();

    renderWithProviders(
      <ClothRelationshipsSection
        relationships={[relationship]}
        nodeOptions={[
          { id: "node-1", label: "Nas" },
          { id: "node-2", label: "AZ" },
        ]}
        common={messages.common}
        editor={messages.editor}
        isCollapsed={false}
        onToggleCollapse={() => undefined}
        onAddRelationship={() => undefined}
        onRemoveRelationship={() => undefined}
        onUpdateRelationship={onUpdateRelationship}
      />,
    );

    const selects = screen.getAllByRole("combobox");
    const dateInputs = screen.getAllByDisplayValue("");

    fireEvent.change(selects[1], {
      target: { value: "node-1" },
    });
    fireEvent.change(screen.getByDisplayValue("COLLABORATED_WITH"), {
      target: { value: "MENTORS" },
    });
    fireEvent.change(dateInputs[0], { target: { value: "2026-01-01" } });
    fireEvent.change(dateInputs[1], { target: { value: "2026-12-31" } });

    expect(onUpdateRelationship).toHaveBeenCalledTimes(4);
  });
});
