import { getClothMessages } from "./cloth";

describe("cloth i18n messages", () => {
  it("returns french messages and validation builders", () => {
    const messages = getClothMessages("fr");

    expect(messages.common.untitled).toBe("Sans titre");
    expect(messages.editor.createTitle).toBe("Créer une toile");
    expect(messages.validation.clothNameRequired).toBe(
      "Le nom de la toile est requis.",
    );
    expect(messages.validation.nodeLabelRequired(2)).toContain("noeud 2");
    expect(messages.validation.nodeTypeRequired(3)).toContain("noeud 3");
    expect(messages.validation.propertyNameRequired(1, 4)).toContain(
      "propriete 1 du noeud 4",
    );
    expect(messages.validation.propertyReferenceInvalid(2, 5)).toContain(
      "propriete 2 du noeud 5",
    );
    expect(messages.validation.relationshipTypeRequired(6)).toContain(
      "relation 6",
    );
    expect(messages.validation.relationshipSourceInvalid(7)).toContain(
      "relation 7",
    );
    expect(messages.validation.relationshipTargetInvalid(8)).toContain(
      "relation 8",
    );
  });

  it("returns english messages and validation builders", () => {
    const messages = getClothMessages("en");

    expect(messages.common.untitled).toBe("Untitled");
    expect(messages.editor.createTitle).toBe("Create cloth");
    expect(messages.validation.clothTypeRequired).toBe(
      "Cloth type is required.",
    );
    expect(messages.validation.nodeLabelRequired(2)).toBe(
      "Node 2 must have a label.",
    );
    expect(messages.validation.nodeTypeRequired(3)).toBe(
      "Node 3 must have a type.",
    );
    expect(messages.validation.propertyNameRequired(1, 4)).toBe(
      "Property 1 of node 4 must have a name.",
    );
    expect(messages.validation.propertyReferenceInvalid(2, 5)).toBe(
      "Reference on property 2 of node 5 is invalid.",
    );
    expect(messages.validation.relationshipTypeRequired(6)).toBe(
      "Relationship 6 must have a type.",
    );
    expect(messages.validation.relationshipSourceInvalid(7)).toBe(
      "Relationship 7 must have a valid source.",
    );
    expect(messages.validation.relationshipTargetInvalid(8)).toBe(
      "Relationship 8 must have a valid target.",
    );
  });
});
