import { http } from "./http";
import type { OperationLog } from "../types/operationLog";
import type { Paginated } from "../types/drf";

export type OperationLogCreatePayload = {
  order_id?: number;
  level?: string;
  message?: string;
  machine_id?: number;
  system_event_id?: string;
  meta?: string;
  created_at?: string;
};

export async function listOperationLogsApi(): Promise<Paginated<OperationLog> | OperationLog[]> {
  const { data } = await http.get<Paginated<OperationLog> | OperationLog[]>("/api/operation-logs/");
  return data;
}

export async function createOperationLogApi(payload: OperationLogCreatePayload): Promise<OperationLog> {
  const { data } = await http.post<OperationLog>("/api/operation-logs/", payload);
  return data;
}

export async function deleteOperationLogApi(id: string): Promise<void> {
  await http.delete(`/api/operation-logs/${id}/`);
}