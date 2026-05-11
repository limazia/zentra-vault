import { setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { BrowserRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { NuqsAdapter } from "nuqs/adapters/react";

import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import {
  ComposeProviders,
  QueryClientProviderWrapper,
  ThemeProviderWrapper,
  AuthProviderWrapper,
  ProgressProviderWrapper,
} from "./wrappers";

setDefaultOptions({ locale: ptBR });

const OuterProviders = ComposeProviders([
  HelmetProvider as any,
  NuqsAdapter,
  TooltipProvider,
  QueryClientProviderWrapper,
  ProgressProviderWrapper,
  ThemeProviderWrapper,
  HelmetProvider,
]);

const InnerProviders = ComposeProviders([AuthProviderWrapper]);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <OuterProviders>
      <BrowserRouter>
        <InnerProviders>
          <Helmet titleTemplate="%s | Avantpro Admin" />

          {children}

          <Toaster
            position="top-right"
            closeButton={false}
            duration={5000}
            toastOptions={{
              duration: 5000,
            }}
            expand
          />
        </InnerProviders>
      </BrowserRouter>
    </OuterProviders>
  );
}
