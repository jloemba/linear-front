import type { IClothDetail, IClothSummary, IClothUpdatePayload } from "../types/cloth";

const BASE_URL = "http://localhost:8080/api";

export const fetchAllCloths = async (): Promise<{ cloths: IClothSummary[] }> => {
  const res = await fetch(`${BASE_URL}/graphs`);
  if (!res.ok) throw new Error('Failed to fetch cloths');
  return res.json();
};

export const fetchClothById = async (id: string): Promise<IClothDetail> => {
  const res = await fetch(`${BASE_URL}/graphs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch cloth');
  return res.json();
};

export const updateClothById = async (
  id: string,
  payload: IClothUpdatePayload,
): Promise<IClothDetail> => {
  const res = await fetch(`${BASE_URL}/graphs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const responseText = await res.text();
    throw new Error(responseText || `Failed to update cloth (${res.status})`);
  }

  if (res.status === 204) {
    return fetchClothById(id);
  }

  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return fetchClothById(id);
  }

  return res.json();
};
