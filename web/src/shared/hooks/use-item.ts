import { useQuery } from "@tanstack/react-query";

import { getItem } from "@/shared/http/get-item";
import type { ItemParams } from "@/shared/schemas/item.schema";

export function useItem({ itemId }: ItemParams) {
  const {
    data: item,
    isLoading: isLoadingItem,
    isFetching: isFetchingItem,
    isError: isErrorItem,
    error: itemError,
  } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => getItem({ itemId }),
    enabled: !!itemId,
  });

  return {
    item,
    isLoadingItem,
    isFetchingItem,
    isErrorItem,
    itemError
  };
}
