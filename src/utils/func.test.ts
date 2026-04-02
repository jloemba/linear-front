import { formatDate, truncateText } from "./func";

describe("func utils", () => {
  it("formats dates in french and english", () => {
    expect(formatDate("2026-04-02T00:00:00.000Z", "fr")).toContain("2026");
    expect(formatDate("2026-04-02T00:00:00.000Z", "en")).toContain("2026");
  });

  it("keeps short text unchanged", () => {
    expect(truncateText("short text", 20)).toBe("short text");
  });

  it("truncates long text with ellipsis", () => {
    expect(truncateText("abcdefghijklmnopqrstuvwxyz", 5)).toBe("abcde...");
  });
});
