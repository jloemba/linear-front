import {
  createCloth,
  deleteClothById,
  fetchAllCloths,
  fetchClothById,
  updateClothById,
} from "./clothApi";

describe("clothApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches all cloths", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ graphs: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const data = await fetchAllCloths();

    expect(data).toEqual({ graphs: [] });
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/api/graphs");
  });

  it("fetches a cloth by id", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "cloth-1",
          name: "Hip Hop",
          description: null,
          createdAt: "2026-04-02T00:00:00.000Z",
          type: "MUSIC",
          nodes: [],
          relationships: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const data = await fetchClothById("cloth-1");

    expect(data.id).toBe("cloth-1");
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/api/graphs/cloth-1");
  });

  it("updates a cloth", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "cloth-1",
          name: "Updated",
          description: null,
          createdAt: "2026-04-02T00:00:00.000Z",
          type: "MUSIC",
          nodes: [],
          relationships: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const payload = {
      name: "Updated",
      type: "MUSIC",
      description: null,
      nodes: [],
      relationships: [],
    };

    const data = await updateClothById("cloth-1", payload);

    expect(data.name).toBe("Updated");
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/api/graphs/cloth-1", expect.objectContaining({
      method: "PUT",
    }));
  });

  it("creates a cloth", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "cloth-1",
          name: "Created",
          description: null,
          createdAt: "2026-04-02T00:00:00.000Z",
          type: "MUSIC",
          nodes: [],
          relationships: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const payload = {
      name: "Created",
      type: "MUSIC",
      description: null,
      nodes: [],
      relationships: [],
    };

    const data = await createCloth(payload);

    expect(data.name).toBe("Created");
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/api/graphs", expect.objectContaining({
      method: "POST",
    }));
  });

  it("deletes a cloth", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );

    await deleteClothById("cloth-1");

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/api/graphs/cloth-1", expect.objectContaining({
      method: "DELETE",
    }));
  });

  it("throws when fetchAllCloths fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    await expect(fetchAllCloths()).rejects.toThrow("Failed to fetch cloths");
  });

  it("throws when createCloth fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("create failed", { status: 400 }),
    );

    await expect(
      createCloth({
        name: "Created",
        type: "MUSIC",
        description: null,
        nodes: [],
        relationships: [],
      }),
    ).rejects.toThrow("create failed");
  });

  it("throws when fetchClothById fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    await expect(fetchClothById("cloth-404")).rejects.toThrow(
      "Failed to fetch cloth",
    );
  });

  it("refetches the cloth when update returns 204", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "cloth-1",
            name: "Refetched cloth",
            description: null,
            createdAt: "2026-04-02T00:00:00.000Z",
            type: "MUSIC",
            nodes: [],
            relationships: [],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );

    const data = await updateClothById("cloth-1", {
      name: "Updated",
      type: "MUSIC",
      description: null,
      nodes: [],
      relationships: [],
    });

    expect(data.name).toBe("Refetched cloth");
    expect(fetchSpy).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/api/graphs/cloth-1",
    );
  });

  it("refetches the cloth when update returns non-json content", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response("ok", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "cloth-1",
            name: "Refetched cloth",
            description: null,
            createdAt: "2026-04-02T00:00:00.000Z",
            type: "MUSIC",
            nodes: [],
            relationships: [],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );

    const data = await updateClothById("cloth-1", {
      name: "Updated",
      type: "MUSIC",
      description: null,
      nodes: [],
      relationships: [],
    });

    expect(data.name).toBe("Refetched cloth");
    expect(fetchSpy).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/api/graphs/cloth-1",
    );
  });

  it("throws when createCloth returns no content", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await expect(
      createCloth({
        name: "Created",
        type: "MUSIC",
        description: null,
        nodes: [],
        relationships: [],
      }),
    ).rejects.toThrow("Create endpoint returned no content.");
  });

  it("throws when deleteClothById fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("delete failed", { status: 500 }),
    );

    await expect(deleteClothById("cloth-1")).rejects.toThrow("delete failed");
  });
});
