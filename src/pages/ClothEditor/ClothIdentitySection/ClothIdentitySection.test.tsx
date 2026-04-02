import { fireEvent, screen } from "@testing-library/react";
import type { IClothUpdatePayload } from "../../../types/cloth";
import ClothIdentitySection from "./ClothIdentitySection";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { getClothMessages } from "../../../i18n/cloth";

const form: IClothUpdatePayload = {
  name: "My cloth",
  type: "ART",
  description: "Description",
  nodes: [],
  relationships: [],
};

describe("ClothIdentitySection", () => {
  it("updates the requested cloth field", async () => {
    const onUpdateField = vi.fn();

    renderWithProviders(
      <ClothIdentitySection
        form={form}
        editor={getClothMessages("fr").editor}
        onUpdateField={onUpdateField}
      />,
    );

    fireEvent.change(screen.getByLabelText("Nom"), {
      target: { value: "My cloth2" },
    });

    expect(onUpdateField).toHaveBeenLastCalledWith("name", "My cloth2");
  });

  it("updates the type and description fields", () => {
    const onUpdateField = vi.fn();

    renderWithProviders(
      <ClothIdentitySection
        form={{ ...form, description: null }}
        editor={getClothMessages("en").editor}
        onUpdateField={onUpdateField}
      />,
    );

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "MUSIC" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Detailed description" },
    });

    expect(onUpdateField).toHaveBeenNthCalledWith(1, "type", "MUSIC");
    expect(onUpdateField).toHaveBeenNthCalledWith(
      2,
      "description",
      "Detailed description",
    );
  });
});
