import { api } from "@/shared/lib/axios";
import type {
  ItemParams,
  Item as ItemResponse,
} from "@/shared/schemas/item.schema";

export async function getItem({ itemId }: ItemParams): Promise<ItemResponse> {
  const { data } = await api.get<ItemResponse>(`/product/${itemId}`);

  return data;
}
