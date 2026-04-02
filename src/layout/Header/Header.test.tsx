import { fireEvent, screen } from "@testing-library/react";
import Header from "./Header";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("Header", () => {
  it("toggles the sidebar when the menu button is clicked", async () => {
    const onToggleSidebar = vi.fn();

    renderWithProviders(<Header onToggleSidebar={onToggleSidebar} />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("forwards search input updates", async () => {
    const onSearch = vi.fn();

    renderWithProviders(<Header showSearch onSearch={onSearch} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nas" },
    });

    expect(onSearch).toHaveBeenLastCalledWith("nas");
  });

  it("renders the back mode, title and action variants", () => {
    const onBack = vi.fn();
    const defaultAction = vi.fn();
    const outlinedAction = vi.fn();

    renderWithProviders(
      <Header
        title="Hip Hop Legacy"
        onBack={onBack}
        actions={[
          { label: "Share", onClick: defaultAction },
          { label: "Publish", onClick: outlinedAction, variant: "outlined" },
        ]}
      />,
    );

    fireEvent.click(screen.getByText(/retour|back/i));
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    expect(screen.getByText("Hip Hop Legacy")).toBeInTheDocument();
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(defaultAction).toHaveBeenCalledTimes(1);
    expect(outlinedAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Knoyeba")).not.toBeInTheDocument();
  });
});
