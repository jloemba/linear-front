const BASE_URL = 'http://localhost:8080/api';

export const fetchAllGraphs = async () => {
  const res = await fetch(`${BASE_URL}/graphs`);
  if (!res.ok) throw new Error('Failed to fetch graphs');
  return res.json();
};

export const fetchGraphById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/graphs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch graph');
  return res.json();
};