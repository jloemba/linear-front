import { fireEvent, screen } from "@testing-library/react";
import ConfirmDialog from "./ConfirmDialog";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("ConfirmDialog", () => {
  it("does not render when closed", () => {
    renderWithProviders(
      <ConfirmDialog
        open={false}
        title="Delete"
        description="Body"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />,
    );

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("calls the matching handlers", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    renderWithProviders(
      <ConfirmDialog
        open
        title="Delete"
        description="Body"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
