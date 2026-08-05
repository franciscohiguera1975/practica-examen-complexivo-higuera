export type OperationLog = {
  id: string;
  level: string;
  message?: string;
  machine_id?: number;
  meta?: string;
  created_at?: string;
};