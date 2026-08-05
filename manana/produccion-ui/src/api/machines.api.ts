import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Machine = {
  id: number;
  name: string;
  is_active?: boolean;
};

export async function listMachinesPublicApi() {
  const { data } = await http.get<Paginated<Machine>>("/api/machines/");
  return data; // { ... , results: [] }
}

export async function listMachinesAdminApi() {
  const { data } = await http.get<Paginated<Machine>>("/api/machines/");
  return data;
}

export async function createMachineApi(payload: Omit<Machine, "id">) {
  const { data } = await http.post<Machine>("/api/machines/", payload);
  return data;
}

export async function updateMachineApi(id: number, payload: Partial<Machine>) {
  const { data } = await http.put<Machine>(`/api/machines/${id}/`, payload);
  return data;
}

export async function deleteMachineApi(id: number) {
  await http.delete(`/api/machines/${id}/`);
}