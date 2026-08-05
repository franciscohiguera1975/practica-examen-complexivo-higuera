import { http } from "./http";
import type { SystemEvent } from "../types/systemEvent";
import type { Paginated } from "../types/drf";

export type SystemEventCreatePayload = {
  event_type: string;
  source?: string;
  details?: string;
  created_at?: string;
};

export async function listSystemEventsApi(): Promise<Paginated<SystemEvent> | SystemEvent[]> {
  const { data } = await http.get<Paginated<SystemEvent> | SystemEvent[]>("/api/system-events/");
  return data;
}

export async function createSystemEventApi(payload: SystemEventCreatePayload): Promise<SystemEvent> {
  const { data } = await http.post<SystemEvent>("/api/system-events/", payload);
  return data;
}

export async function deleteSystemEventApi(id: string): Promise<void> {
  await http.delete(`/api/system-events/${id}/`);
}