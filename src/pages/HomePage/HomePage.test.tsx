import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";
import { LanguageProvider } from "../../context/Language/LanguageProvider";
import { ThemeProvider } from "../../context/Theme/ThemeProvider";
import { SnackbarProvider } from "../../context/Snackbar/SnackbarProvider";
import { makeClothSummary } from "../../test/factories/cloth";

const fetchAllClothsMock = vi.fn();

vi.mock("../../api/cloth/clothApi", () => ({
  fetchAllCloths: (...args: unknown[]) => fetchAllClothsMock(...args),
}));

vi.mock("../../hooks/useClothCategory/useClothCategory", () => ({
  default: () => ({
    getCategoryFromName: () => "Music",
  }),
}));

const renderHomePage = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <SnackbarProvider>
            <HomePage />
          </SnackbarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the fetched cloth list", async () => {
    fetchAllClothsMock.mockResolvedValue({
      graphs: [
        makeClothSummary({
          description:
            "A".repeat(180),
        }),
      ],
    });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText("Hip Hop Legacy")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /créer une toile/i })).toBeInTheDocument();
    expect(screen.getByText(/\.\.\.\.\.\./)).toBeInTheDocument();
  });

  it("renders the empty state when there are no cloths", async () => {
    fetchAllClothsMock.mockResolvedValue({ graphs: [] });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText(/aucune toile trouvée/i)).toBeInTheDocument();
    });
  });

  it("falls back to the empty state when the api request fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    fetchAllClothsMock.mockRejectedValue(new Error("network"));

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText(/aucune toile trouvée/i)).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("renders the default description when the cloth has none", async () => {
    fetchAllClothsMock.mockResolvedValue({
      graphs: [
        makeClothSummary({
          description: null,
        }),
      ],
    });

    renderHomePage();

    await waitFor(() => {
      expect(
        screen.getByText(/aucune description disponible/i),
      ).toBeInTheDocument();
    });
  });
});
