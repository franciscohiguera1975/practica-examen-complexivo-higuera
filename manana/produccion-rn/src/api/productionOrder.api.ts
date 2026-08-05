import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { ProductionOrder } from "../types/productionOrder";

export async function listProductionOrdersApi(): Promise<Paginated<ProductionOrder> | ProductionOrder[]> {
  const { data } = await http.get<Paginated<ProductionOrder> | ProductionOrder[]>("/api/production-orders/");
  return data;
}