import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import useTheme from "../../hooks/useTheme/useTheme";

const TestConsumer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span>{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("toggles the theme and updates the root class", async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText("light")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByText("dark")).toBeInTheDocument();

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });
  });

  it("uses the stored theme when available", () => {
    window.localStorage.setItem("knovia-theme", "dark");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText("dark")).toBeInTheDocument();
  });

  it("falls back to the system preference when storage is invalid", () => {
    window.localStorage.setItem("knovia-theme", "invalid");
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText("dark")).toBeInTheDocument();
  });
});
