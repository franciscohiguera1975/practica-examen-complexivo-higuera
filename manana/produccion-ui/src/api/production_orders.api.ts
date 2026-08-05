import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ProductionOrder = {
  id: number;
  product_name?: string;
  quantity: number;
  status: string;
  created_at?: string;
  machine?: number;
};

export async function listProductionOrdersPublicApi() {
  const { data } = await http.get<Paginated<ProductionOrder>>("/api/production-orders/");
  return data; // { ... , results: [] }
}

export async function listProductionOrdersAdminApi() {
  const { data } = await http.get<Paginated<ProductionOrder>>("/api/production-orders/");
  return data;
}

export async function createProductionOrderApi(payload: Omit<ProductionOrder, "id">) {
  const { data } = await http.post<ProductionOrder>("/api/production-orders/", payload);
  return data;
}

export async function updateProductionOrderApi(id: number, payload: Partial<ProductionOrder>) {
  const { data } = await http.put<ProductionOrder>(`/api/production-orders/${id}/`, payload);
  return data;
}

export async function deleteProductionOrderApi(id: number) {
  await http.delete(`/api/production-orders/${id}/`);
}