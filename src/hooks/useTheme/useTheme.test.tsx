import { renderHook } from "@testing-library/react";
import useTheme from "./useTheme";

describe("useTheme", () => {
  it("throws outside the theme provider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider.",
    );
  });
});
