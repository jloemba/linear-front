import { fireEvent, screen } from "@testing-library/react";
import ClothViewHeader from "./ClothViewHeader";
import { renderWithProviders } from "../../../test/renderWithProviders";

describe("ClothViewHeader", () => {
  it("calls the callbacks for description toggle and delete", async () => {
    const onToggleDescription = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <ClothViewHeader
        clothId="cloth-1"
        clothName="Hip Hop"
        clothDescription="Description"
        createdAt="2026-04-02T00:00:00.000Z"
        lang="fr"
        publishedOnLabel="Publié le"
        authorLabel="Auteur"
        editClothLabel="Modifier"
        deleteClothLabel="Supprimer"
        hideDescriptionLabel="Masquer la description"
        aboutThisClothLabel="A propos de cette toile"
        insightsLabel="Insights"
        noDescriptionLabel="Aucune description disponible."
        descriptionOpen={false}
        onToggleDescription={onToggleDescription}
        onDelete={onDelete}
        isAuthenticated={true}
        view={{
          deleteButtonText: "Supprimer",
          editButtonText: "Modifier",
        }}

      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /a propos de cette toile/i }));
    fireEvent.click(screen.getByRole("button", { name: /supprimer/i }));

    expect(onToggleDescription).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("renders the expanded description fallback", () => {
    renderWithProviders(
      <ClothViewHeader
        clothId="cloth-1"
        clothName="Hip Hop"
        clothDescription={null}
        createdAt="2026-04-02T00:00:00.000Z"
        lang="en"
        publishedOnLabel="Posted on"
        authorLabel="Author"
        editClothLabel="Edit"
        deleteClothLabel="Delete"
        hideDescriptionLabel="Hide description"
        aboutThisClothLabel="About this cloth"
        insightsLabel="Insights"
        noDescriptionLabel="No description available."
        descriptionOpen
        onToggleDescription={() => undefined}
        onDelete={() => undefined}
        isAuthenticated={true}
        view={{
          deleteButtonText: "Delete",
          editButtonText: "Edit",
        }}

      />,
    );

    expect(screen.getByText(/hide description/i)).toBeInTheDocument();
    expect(screen.getByText(/no description available/i)).toBeInTheDocument();
  });
});
