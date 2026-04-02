import { fireEvent, screen } from "@testing-library/react";
import Snackbar from "./Snackbar";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("Snackbar", () => {
  it("renders the provided message", () => {
    renderWithProviders(
      <Snackbar message="Saved" type="success" onClose={() => undefined} />,
    );

    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();

    renderWithProviders(
      <Snackbar message="Saved" type="error" onClose={onClose} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /close notification/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
