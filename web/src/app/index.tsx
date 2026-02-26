import "@/styles/globals.css";

import { AppProviders } from "./providers";
import { AppRoutes } from "./router";

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
