import { fireEvent, screen, waitFor } from "@testing-library/react";
import { SnackbarProvider } from "./SnackbarProvider";
import useSnackbar from "../../hooks/useSnackbar/useSnackbar";
import { render } from "@testing-library/react";

const TestConsumer = () => {
  const { showSnackbar } = useSnackbar();

  return (
    <button
      onClick={() =>
        showSnackbar({
          message: "Created",
          type: "success",
        })
      }
    >
      notify
    </button>
  );
};

describe("SnackbarProvider", () => {
  it("shows a snackbar when requested", async () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "notify" }));

    await waitFor(() => {
      expect(screen.getByText("Created")).toBeInTheDocument();
    });
  });
});
