import { fireEvent, screen } from "@testing-library/react";
import ClothNodesSection from "./ClothNodesSection";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { getClothMessages } from "../../../i18n/cloth";
import type { IClothNode } from "../../../types/cloth";

const node: IClothNode = {
  id: "node-1",
  label: "Nas",
  type: "RAPPER",
  properties: [
    {
      name: "birth_date",
      valueType: "string",
      stringValue: "1973",
      dateValue: null,
      refNodeId: null,
    },
  ],
};

describe("ClothNodesSection", () => {
  it("wires the main node actions", () => {
    const messages = getClothMessages("fr");
    const onAddProperty = vi.fn();
    const onRemoveProperty = vi.fn();
    const onPropertyTypeChange = vi.fn();
    const onToggleNodeCollapse = vi.fn();

    renderWithProviders(
      <ClothNodesSection
        lang="fr"
        nodes={[node]}
        nodeOptions={[{ id: "node-1", label: "Nas" }]}
        collapsedNodeIds={[]}
        common={messages.common}
        editor={messages.editor}
        isSectionCollapsed={false}
        onToggleSectionCollapse={() => undefined}
        onAddNode={() => undefined}
        onToggleNodeCollapse={onToggleNodeCollapse}
        onRemoveNode={() => undefined}
        onUpdateNode={() => node}
        onAddProperty={onAddProperty}
        onRemoveProperty={onRemoveProperty}
        onUpdateProperty={() => node.properties[0]}
        onPropertyTypeChange={onPropertyTypeChange}
      />,
    );

    fireEvent.click(screen.getAllByRole("button")[2]);
    fireEvent.click(screen.getByRole("button", { name: /ajouter une propriete/i }));
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "date" },
    });
    fireEvent.click(screen.getByRole("button", { name: /retirer/i }));

    expect(onToggleNodeCollapse).toHaveBeenCalledWith("node-1");
    expect(onAddProperty).toHaveBeenCalledWith("node-1");
    expect(onPropertyTypeChange).toHaveBeenCalledWith("node-1", 0, "date");
    expect(onRemoveProperty).toHaveBeenCalledWith("node-1", 0);
  });

  it("wires section-level actions and node field updates", () => {
    const messages = getClothMessages("fr");
    const onToggleSectionCollapse = vi.fn();
    const onAddNode = vi.fn();
    const onRemoveNode = vi.fn();
    const onUpdateNode = vi.fn();
    const onUpdateProperty = vi.fn();

    renderWithProviders(
      <ClothNodesSection
        lang="fr"
        nodes={[node]}
        nodeOptions={[{ id: "node-1", label: "Nas" }]}
        collapsedNodeIds={[]}
        common={messages.common}
        editor={messages.editor}
        isSectionCollapsed={false}
        onToggleSectionCollapse={onToggleSectionCollapse}
        onAddNode={onAddNode}
        onToggleNodeCollapse={() => undefined}
        onRemoveNode={onRemoveNode}
        onUpdateNode={onUpdateNode}
        onAddProperty={() => undefined}
        onRemoveProperty={() => undefined}
        onUpdateProperty={onUpdateProperty}
        onPropertyTypeChange={() => undefined}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /replier/i }));
    fireEvent.click(screen.getByRole("button", { name: /supprimer le noeud/i }));
    fireEvent.change(screen.getByDisplayValue("Nas"), {
      target: { value: "AZ" },
    });

    expect(onToggleSectionCollapse).toHaveBeenCalledTimes(1);
    expect(onRemoveNode).toHaveBeenCalledWith("node-1");
    expect(onUpdateNode).toHaveBeenCalledTimes(1);
    expect(onAddNode).not.toHaveBeenCalled();
    expect(onUpdateProperty).not.toHaveBeenCalled();
  });

  it("renders the collapsed section label", () => {
    const messages = getClothMessages("en");

    renderWithProviders(
      <ClothNodesSection
        lang="en"
        nodes={[
          {
            ...node,
            id: "node-date",
            label: "",
            properties: [
              {
                name: "release_date",
                valueType: "date",
                stringValue: null,
                dateValue: "2026-04-02",
                refNodeId: null,
              },
            ],
          },
        ]}
        nodeOptions={[{ id: "node-1", label: "Nas" }]}
        collapsedNodeIds={["node-date"]}
        common={messages.common}
        editor={messages.editor}
        isSectionCollapsed
        onToggleSectionCollapse={() => undefined}
        onAddNode={() => undefined}
        onToggleNodeCollapse={() => undefined}
        onRemoveNode={() => undefined}
        onUpdateNode={() => node}
        onAddProperty={() => undefined}
        onRemoveProperty={() => undefined}
        onUpdateProperty={() => node.properties[0]}
        onPropertyTypeChange={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: /expand/i })).toBeInTheDocument();
    expect(screen.getByText(/new node/i)).toBeInTheDocument();
  });

  it("renders and updates date and reference properties", () => {
    const messages = getClothMessages("en");
    const onUpdateProperty = vi.fn();

    renderWithProviders(
      <>
        <ClothNodesSection
          lang="en"
          nodes={[
            {
              ...node,
              id: "node-date",
              label: "Date node",
              properties: [
                {
                  name: "release_date",
                  valueType: "date",
                  stringValue: null,
                  dateValue: "2026-04-02",
                  refNodeId: null,
                },
              ],
            },
          ]}
          nodeOptions={[{ id: "node-1", label: "Nas" }]}
          collapsedNodeIds={[]}
          common={messages.common}
          editor={messages.editor}
          isSectionCollapsed={false}
          onToggleSectionCollapse={() => undefined}
          onAddNode={() => undefined}
          onToggleNodeCollapse={() => undefined}
          onRemoveNode={() => undefined}
          onUpdateNode={() => node}
          onAddProperty={() => undefined}
          onRemoveProperty={() => undefined}
          onUpdateProperty={onUpdateProperty}
          onPropertyTypeChange={() => undefined}
        />
        <ClothNodesSection
          lang="en"
          nodes={[
            {
              ...node,
              id: "node-ref",
              label: "Reference node",
              properties: [
                {
                  name: "mentor",
                  valueType: "reference",
                  stringValue: null,
                  dateValue: null,
                  refNodeId: "node-1",
                },
              ],
            },
          ]}
          nodeOptions={[{ id: "node-1", label: "Nas" }]}
          collapsedNodeIds={[]}
          common={messages.common}
          editor={messages.editor}
          isSectionCollapsed={false}
          onToggleSectionCollapse={() => undefined}
          onAddNode={() => undefined}
          onToggleNodeCollapse={() => undefined}
          onRemoveNode={() => undefined}
          onUpdateNode={() => node}
          onAddProperty={() => undefined}
          onRemoveProperty={() => undefined}
          onUpdateProperty={onUpdateProperty}
          onPropertyTypeChange={() => undefined}
        />
      </>,
    );

    const dateInput = screen.getByDisplayValue("2026-04-02");
    const comboboxes = screen.getAllByRole("combobox");

    fireEvent.change(dateInput, {
      target: { value: "2026-04-03" },
    });
    fireEvent.change(comboboxes[comboboxes.length - 1], {
      target: { value: "" },
    });

    expect(onUpdateProperty).toHaveBeenCalledTimes(2);
  });
});
