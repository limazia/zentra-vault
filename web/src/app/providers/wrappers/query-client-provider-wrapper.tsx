import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { queryClient } from "@/shared/lib/tanstack-query";

export function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
