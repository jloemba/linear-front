import { renderHook } from "@testing-library/react";
import useSnackbar from "./useSnackbar";

describe("useSnackbar", () => {
  it("throws when used outside its provider", () => {
    expect(() => renderHook(() => useSnackbar())).toThrow(
      "useSnackbar must be used within a SnackbarProvider.",
    );
  });
});
