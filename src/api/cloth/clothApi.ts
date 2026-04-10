import type {
  IClothCreatePayload,
  IClothDetail,
  IClothSummary,
  IClothUpdatePayload,
} from "../../types/cloth";
import { getUserId } from "../../utils/analytics.utils";

// Todo : Faire un fichier de config pour stocker les valeurs sensibles selon les environnements de dev, staging et prod  
const BASE_URL = "http://localhost:8080/api";

export const fetchAllCloths = async (): Promise<{ graphs: IClothSummary[] }> => {
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
  const userId = getUserId();
  const payloadWithUserId: IClothUpdatePayload = {
    ...payload,
    ...(userId && { userId }),
  };

  const res = await fetch(`${BASE_URL}/graphs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadWithUserId),
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

export const createCloth = async (
  payload: IClothCreatePayload,
): Promise<IClothDetail> => {
  const userId = getUserId();
  const payloadWithUserId: IClothCreatePayload = {
    ...payload,
    ...(userId && { userId }),
  };

  const res = await fetch(`${BASE_URL}/graphs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadWithUserId),
  });

  if (!res.ok) {
    const responseText = await res.text();
    throw new Error(responseText || `Failed to create cloth (${res.status})`);
  }

  if (res.status === 204) {
    throw new Error("Create endpoint returned no content.");
  }

  return res.json();
};

export const deleteClothById = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/graphs/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const responseText = await res.text();
    throw new Error(responseText || `Failed to delete cloth (${res.status})`);
  }
};

