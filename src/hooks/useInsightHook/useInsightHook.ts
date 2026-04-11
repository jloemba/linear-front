import { useCallback, useEffect, useState } from "react";
import type { IInsightResult } from "../../types/analytics";
import { fetchCanvasInsights } from "../../api/analytics/analyticsApi";

const useInsightHook = (id:string) => {
 
  const [insightData, setInsightData] = useState<IInsightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

const fetchInsightData = useCallback(async () => {
  setLoading(true);
  try {
    const data = await fetchCanvasInsights(id);
    setInsightData(data);
  } catch (e) {
    console.log("Error fetching insights:", e); 
    setHasError(true);
  } finally {
    setLoading(false);
  }
}, [setLoading, setHasError, setInsightData,id]); // Ces setters de useState sont stables, mais requis ici

useEffect(() => {
  fetchInsightData();
}, [fetchInsightData]); // Maintenant fetchInsightData est une dépendance stable

  return {insightData, loading, hasError};
};

export default useInsightHook;
