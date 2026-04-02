import { fireEvent, screen } from "@testing-library/react";
import ClothViewLegend from "./ClothViewLegend";
import { renderWithProviders } from "../../../test/renderWithProviders";

describe("ClothViewLegend", () => {
  it("lets the user toggle the legend", async () => {
    const onToggleLegend = vi.fn();

    renderWithProviders(
      <ClothViewLegend
        nodeTypes={["RAPPER", "PRODUCER"]}
        showLegend
        hideLegendLabel="Masquer"
        legendLabel="Legende"
        onToggleLegend={onToggleLegend}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /masquer/i }));

    expect(onToggleLegend).toHaveBeenCalledTimes(1);
  });

  it("renders the compact legend when collapsed", () => {
    renderWithProviders(
      <ClothViewLegend
        nodeTypes={["RAPPER", "PRODUCER", "LABEL"]}
        showLegend={false}
        hideLegendLabel="Hide"
        legendLabel="Legend"
        onToggleLegend={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: /legend/i })).toBeInTheDocument();
    expect(screen.getAllByRole("generic").length).toBeGreaterThan(0);
  });
});
