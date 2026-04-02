import { fireEvent, screen } from "@testing-library/react";
import ClothQuickNavigation from "./ClothQuickNavigation";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { getClothMessages } from "../../../i18n/cloth";

describe("ClothQuickNavigation", () => {
  it("scrolls to the selected node when an anchor is clicked", async () => {
    const onScrollToNode = vi.fn();

    renderWithProviders(
      <ClothQuickNavigation
        nodes={[
          {
            id: "node-1",
            label: "Nas",
            type: "RAPPER",
            properties: [],
          },
        ]}
        editor={getClothMessages("fr").editor}
        onScrollToNode={onScrollToNode}
        getPropertyCountLabel={(count) => `${count} propriete(s)`}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /nas/i }));

    expect(onScrollToNode).toHaveBeenCalledWith("node-1");
  });

  it("falls back to the default node label when the label is empty", () => {
    renderWithProviders(
      <ClothQuickNavigation
        nodes={[
          {
            id: "node-1",
            label: "   ",
            type: "RAPPER",
            properties: [],
          },
        ]}
        editor={getClothMessages("en").editor}
        onScrollToNode={() => undefined}
        getPropertyCountLabel={(count) => `${count} properties`}
      />,
    );

    expect(screen.getByText(/new node/i)).toBeInTheDocument();
  });
});
