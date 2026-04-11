import { renderHook } from "@testing-library/react";
import useLanguage from "./useLanguage";

describe("useLanguage", () => {
  it("throws when used outside its provider", () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      "useLanguage must be used within a LanguageProvider.",
    );
  });
});
