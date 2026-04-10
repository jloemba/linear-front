import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ClothInsights from "./ClothInsights";
import { LanguageProvider } from "../../context/Language/LanguageProvider";
import { SnackbarProvider } from "../../context/Snackbar/SnackbarProvider";
import { ThemeProvider } from "../../context/Theme/ThemeProvider";

const mockFetchCanvasInsights = vi.fn();

vi.mock("../../api/analytics/analyticsApi", () => ({
  fetchCanvasInsights: (...args: unknown[]) => mockFetchCanvasInsights(...args),
}));

const renderInsightsPage = (initialEntry = "/cloth/canvas-1/insights") =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider>
        <LanguageProvider>
          <SnackbarProvider>
            <Routes>
              <Route path="/cloth/:id/insights" element={<ClothInsights />} />
            </Routes>
          </SnackbarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("ClothInsights", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders insight data", async () => {
    mockFetchCanvasInsights.mockResolvedValue({
      canvasId: "canvas-1",
      canvasName: "Hip Hop Legacy",
      totalViews: 124,
      uniqueViews: 82,
      totalNodeClicks: 37,
      viewsOverTime: [
        { date: "2026-04-08", count: 12 },
        { date: "2026-04-09", count: 18 },
      ],
      topNodes: [
        { nodeId: "node-1", nodeLabel: "Nas", clicks: 14 },
        { nodeId: "node-2", nodeLabel: "Lauryn Hill", clicks: 9 },
      ],
    });

    renderInsightsPage();

    await waitFor(() => {
      expect(screen.getByText("Hip Hop Legacy")).toBeInTheDocument();
    });

    expect(screen.getByText(/vues totales/i)).toBeInTheDocument();
    expect(screen.getByText("124")).toBeInTheDocument();
    expect(screen.getByText(/noeuds les plus cliques/i)).toBeInTheDocument();
    expect(screen.getByText("Nas")).toBeInTheDocument();
  });

  it("renders an error state when loading fails", async () => {
    mockFetchCanvasInsights.mockRejectedValue(new Error("boom"));

    renderInsightsPage();

    await waitFor(() => {
      expect(
        screen.getByText(/impossible de charger les insights de cette toile/i),
      ).toBeInTheDocument();
    });
  });
});
