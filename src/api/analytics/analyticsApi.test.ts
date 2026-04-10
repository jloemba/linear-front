import {
  fetchCanvasInsights,
  trackCanvasView,
  trackNodeClick,
} from "./analyticsApi";

describe("analyticsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("tracks a canvas view", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    window.localStorage.setItem("userId", "user-1");

    await trackCanvasView("canvas-1");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/analytics/views",
      expect.objectContaining({
        method: "POST",
        body: expect.any(String),
      }),
    );

    const [, requestInit] = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(String(requestInit?.body));

    expect(body).toMatchObject({
      canvasId: "canvas-1",
      sessionId: expect.any(String),
      userId: "user-1",
      durationMs: 0,
    });
    expect(body.viewedAt).toEqual(expect.any(String));
    expect(window.sessionStorage.getItem("analyticsSessionId")).toBe(body.sessionId);
  });

  it("reuses the same analytics session id between view events", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await trackCanvasView("canvas-1");
    await trackCanvasView("canvas-2");

    const firstBody = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));
    const secondBody = JSON.parse(String(vi.mocked(fetch).mock.calls[1][1]?.body));

    expect(firstBody.sessionId).toBe(secondBody.sessionId);
  });

  it("omits userId when no authenticated user is available", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await trackCanvasView("canvas-1");

    const body = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));

    expect(body.userId).toBeUndefined();
  });

  it("tracks a node click", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    window.localStorage.setItem("userId", "user-1");

    await trackNodeClick("canvas-1", "node-1");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/analytics/clicks",
      expect.objectContaining({
        method: "POST",
        body: expect.any(String),
      }),
    );

    const [, requestInit] = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(String(requestInit?.body));

    expect(body).toMatchObject({
      canvasId: "canvas-1",
      nodeId: "node-1",
      sessionId: expect.any(String),
      userId: "user-1",
    });
    expect(body.clickedAt).toEqual(expect.any(String));
  });

  it("reuses the same analytics session id for node clicks", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await trackNodeClick("canvas-1", "node-1");
    await trackNodeClick("canvas-1", "node-2");

    const firstBody = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));
    const secondBody = JSON.parse(String(vi.mocked(fetch).mock.calls[1][1]?.body));

    expect(firstBody.sessionId).toBe(secondBody.sessionId);
  });

  it("omits userId for node clicks when no authenticated user is available", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await trackNodeClick("canvas-1", "node-1");

    const body = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));

    expect(body.userId).toBeUndefined();
  });

  it("fetches insights", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          canvasId: "canvas-1",
          canvasName: "Hip Hop Legacy",
          totalViews: 12,
          uniqueViews: 10,
          totalNodeClicks: 5,
          viewsOverTime: [{ date: "2026-04-09", count: 4 }],
          topNodes: [{ nodeId: "node-1", nodeLabel: "Nas", clicks: 3 }],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const data = await fetchCanvasInsights("canvas-1");

    expect(data.canvasName).toBe("Hip Hop Legacy");
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/analytics/canvas-1/insights",
    );
  });

  it("throws when insights fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));

    await expect(fetchCanvasInsights("canvas-1")).rejects.toThrow(
      "Failed to fetch insights",
    );
  });
});
