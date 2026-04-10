import type { IInsightResult } from "../../types/analytics";
import { getSessionId, getUserId } from "../../utils/analytics.utils";

const BASE_URL = "http://localhost:8080/api";

export const trackCanvasView = async (canvasId: string): Promise<void> => {
  const payload = {
    canvasId,
    sessionId: getSessionId(),
    userId: getUserId(),
    viewedAt: new Date().toISOString(),
    durationMs: 0,
  };

  const res = await fetch(`${BASE_URL}/analytics/views`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to track view (${res.status})`);
  }
};

export const trackNodeClick = async (
  canvasId: string,
  nodeId: string,
): Promise<void> => {
  const payload = {
    canvasId,
    nodeId,
    sessionId: getSessionId(),
    userId: getUserId(),
    clickedAt: new Date().toISOString(),
  };

  const res = await fetch(`${BASE_URL}/analytics/clicks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to track click (${res.status})`);
  }
};

export const fetchCanvasInsights = async (
  canvasId: string,
): Promise<IInsightResult> => {
  const res = await fetch(`${BASE_URL}/analytics/${canvasId}/insights`);

  if (!res.ok) {
    throw new Error("Failed to fetch insights");
  }

  return res.json();
};
