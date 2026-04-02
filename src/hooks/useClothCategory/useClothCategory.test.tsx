import { renderHook } from "@testing-library/react";
import useClothCategory from "./useClothCategory";

describe("useClothCategory", () => {
  it("maps names to the expected category", () => {
    const { result } = renderHook(() => useClothCategory());

    expect(result.current.getCategoryFromName("Rap francais")).toBe("Musique");
    expect(result.current.getCategoryFromName("Royaume du Mali")).toBe("Histoire");
    expect(result.current.getCategoryFromName("Mode streetwear")).toBe("Mode");
    expect(result.current.getCategoryFromName("Sujet libre")).toBe("Culture");
  });
});
