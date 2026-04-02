import {
  createEmptyClothPayload,
  createEmptyNode,
  createEmptyProperty,
  createEmptyRelationship,
  getPropertyDisplayValue,
  normalizeClothForForm,
  normalizeProperty,
  sanitizeClothPayload,
  validateClothPayload,
} from "./clothForm";
import {
  makeClothDetail,
  makeClothPayload,
  makeNode,
  makeProperty,
  makeRelationship,
} from "../test/factories/cloth";

describe("clothForm", () => {
  it("creates empty form entities with the expected defaults", () => {
    const property = createEmptyProperty();
    const node = createEmptyNode();
    const relationship = createEmptyRelationship();
    const payload = createEmptyClothPayload();

    expect(property.valueType).toBe("string");
    expect(node.properties).toHaveLength(1);
    expect(relationship.type).toBe("");
    expect(payload.type).toBe("CLOTH");
    expect(payload.nodes).toHaveLength(1);
  });

  it("normalizes properties for each supported value type", () => {
    expect(
      normalizeProperty(makeProperty({ valueType: "date", dateValue: "2020-01-01" })),
    ).toEqual({
      name: "birth_date",
      valueType: "date",
      stringValue: null,
      dateValue: "2020-01-01",
      refNodeId: null,
    });

    expect(
      normalizeProperty(makeProperty({ valueType: "reference", refNodeId: "node-2" })),
    ).toEqual({
      name: "birth_date",
      valueType: "reference",
      stringValue: null,
      dateValue: null,
      refNodeId: "node-2",
    });

    expect(
      normalizeProperty({
        name: "alias",
        value: "Escobar",
      }),
    ).toEqual({
      name: "alias",
      valueType: "string",
      stringValue: "Escobar",
      dateValue: null,
      refNodeId: null,
    });
  });

  it("normalizes a cloth detail into an editor-friendly payload", () => {
    const payload = normalizeClothForForm(
      makeClothDetail({
        type: null,
        description: null,
        nodes: [makeNode({ properties: [] })],
        relationships: [makeRelationship({ startDate: null, endDate: null })],
      }),
    );

    expect(payload.type).toBe("CLOTH");
    expect(payload.description).toBe("");
    expect(payload.nodes[0].properties).toHaveLength(1);
  });

  it("sanitizes the cloth payload before submit", () => {
    const sanitized = sanitizeClothPayload(
      makeClothPayload({
        name: "  Hip Hop  ",
        type: " MUSIC ",
        description: "  description  ",
        nodes: [
          makeNode({
            label: " Nas ",
            type: " RAPPER ",
            properties: [
              makeProperty({
                name: " alias ",
                stringValue: " Escobar ",
              }),
              makeProperty({
                name: "   ",
                stringValue: "ignored",
              }),
            ],
          }),
        ],
        relationships: [
          makeRelationship({
            type: " COLLABORATED_WITH ",
            startDate: "",
            endDate: "",
          }),
        ],
      }),
    );

    expect(sanitized.name).toBe("Hip Hop");
    expect(sanitized.type).toBe("MUSIC");
    expect(sanitized.description).toBe("description");
    expect(sanitized.nodes[0].label).toBe("Nas");
    expect(sanitized.nodes[0].properties).toHaveLength(1);
    expect(sanitized.relationships[0].type).toBe("COLLABORATED_WITH");
    expect(sanitized.relationships[0].startDate).toBeNull();
  });

  it("returns the right property display values", () => {
    expect(
      getPropertyDisplayValue(makeProperty({ valueType: "date", dateValue: "2020-01-01" })),
    ).toBe("2020-01-01");

    expect(
      getPropertyDisplayValue(
        makeProperty({ valueType: "reference", refNodeId: "node-2" }),
        [makeNode({ id: "node-2", label: "AZ" })],
      ),
    ).toBe("AZ");

    expect(getPropertyDisplayValue(makeProperty({ stringValue: "Queens" }))).toBe(
      "Queens",
    );
  });

  it("validates the cloth payload and returns user-facing errors", () => {
    const errors = validateClothPayload(
      {
        name: "",
        type: "",
        description: null,
        nodes: [
          makeNode({
            label: "",
            type: "",
            properties: [
              makeProperty({
                name: "",
              }),
              makeProperty({
                name: "friend",
                valueType: "reference",
                refNodeId: "missing-node",
              }),
            ],
          }),
        ],
        relationships: [
          makeRelationship({
            type: "",
            fromId: "",
            toId: "missing-node",
          }),
        ],
      },
      "fr",
    );

    expect(errors).toEqual(
      expect.arrayContaining([
        "Le nom de la toile est requis.",
        "Le type de la toile est requis.",
      ]),
    );
    expect(errors.length).toBeGreaterThan(4);
  });
});
