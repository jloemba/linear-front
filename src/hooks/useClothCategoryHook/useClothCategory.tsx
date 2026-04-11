
export default function useClothCategory() {

  const getCategoryFromName = (name: string): string => {
    if (name.toLowerCase().includes("musique") || name.toLowerCase().includes("rap") || name.toLowerCase().includes("label")) return "Musique";
    if (name.toLowerCase().includes("migration") || name.toLowerCase().includes("royaume")) return "Histoire";
    if (name.toLowerCase().includes("langue")) return "Langue";
    if (name.toLowerCase().includes("disney") || name.toLowerCase().includes("filiale")) return "Business";
    if (name.toLowerCase().includes("mode") || name.toLowerCase().includes("streetwear")) return "Mode";
    if (name.toLowerCase().includes("réseau") || name.toLowerCase().includes("social") || name.toLowerCase().includes("reseaux")) return "Technologie";
    return "Culture";
  }

    return {
        getCategoryFromName
    }
}