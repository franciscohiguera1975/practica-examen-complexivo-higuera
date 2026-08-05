import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Machine } from "../types/machine";

export async function listMachinesApi(): Promise<Paginated<Machine> | Machine[]> {
  const { data } = await http.get<Paginated<Machine> | Machine[]>("/api/machines/");
  return data;
}