import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import ClothPreviewPanel from "./ClothPreviewPanel";

vi.mock("../../../components/ClothGraphCanvas/ClothGraphCanvas", () => ({
  default: ({ className }: { className?: string }) => (
    <div className={className}>graph-canvas</div>
  ),
}));

const form = {
  name: "Cloth",
  type: "MUSIC",
  description: "",
  nodes: [],
  relationships: [],
};

describe("ClothPreviewPanel", () => {
  it("submits and opens fullscreen preview", () => {
    const onSubmit = vi.fn();

    renderWithProviders(
      <ClothPreviewPanel
        form={form}
        lang="fr"
        isCreateMode
        saving={false}
        error={null}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /mode plein ecran/i }));
    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(screen.getByText(/apercu etendu en plein ecran/i)).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders the error state and saving label", () => {
    renderWithProviders(
      <ClothPreviewPanel
        form={form}
        lang="en"
        isCreateMode={false}
        saving
        error="Save failed"
        onSubmit={() => undefined}
      />,
    );

    expect(screen.getByText("Save failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  it("closes fullscreen mode from the button and escape key", () => {
    renderWithProviders(
      <ClothPreviewPanel
        form={form}
        lang="en"
        isCreateMode={false}
        saving={false}
        error={null}
        onSubmit={() => undefined}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /fullscreen mode/i }));
    expect(screen.getByText(/expanded fullscreen preview/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.queryByText(/expanded fullscreen preview/i),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /fullscreen mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText(/expanded fullscreen preview/i)).not.toBeInTheDocument();
  });
});
