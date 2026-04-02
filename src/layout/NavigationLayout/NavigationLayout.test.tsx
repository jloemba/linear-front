import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../../context/Theme/ThemeProvider";
import { LanguageProvider } from "../../context/Language/LanguageProvider";
import NavigationLayout from "./NavigationLayout";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
    Outlet: () => <div>layout-content</div>,
  };
});

describe("NavigationLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens the sidebar and navigates from its links", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <LanguageProvider>
            <NavigationLayout />
          </LanguageProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByRole("button", { name: /accueil/i }));

    expect(navigateMock).toHaveBeenCalledWith("/");
    expect(screen.getByText("layout-content")).toBeInTheDocument();
  }, 10000);
});
