import { useEffect, useState } from "react";
import type { IInsightResult } from "../../types/analytics";
import { fetchCanvasInsights } from "../../api/analytics/analyticsApi";

const useInsightHook = (id:string) => {
 
  const [insightData, setInsightData] = useState<IInsightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  let ignore = false;

  useEffect(() => {
    fetchInsightData();
  }, []);

  const fetchInsightData = async () => {
    try {
      setLoading(true);
      const result = await fetchCanvasInsights(id);
      if (!ignore) {
        // On ne met à jour l'état que si l'effet est toujours valide
        setInsightData(result);
      }
    } catch (e) {
      // Todo : éviter de rendre obligatoire l'objet error dans le catch pour pouvoir différencier les types d'erreurs (ex: 404 vs 500) et afficher des messages d'erreur plus précis en fonction du type d'erreur
      console.error(e);
      if (!ignore) setHasError(true);
    } finally {
      if (!ignore) setLoading(false);
    }
  };

  return {insightData, loading, hasError};
};

export default useInsightHook;
