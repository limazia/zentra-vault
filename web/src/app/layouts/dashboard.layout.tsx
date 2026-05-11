import { Outlet } from "react-router-dom";

import { Header } from "@/shared/components/header";
import { SetupVaultModal } from "@/shared/components/setup-vault-modal";

export function DashboardLayout() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto mx-auto w-full py-4 lg:py-6 px-8 md:px-12">
        <Outlet />
      </main>

      <SetupVaultModal />
    </div>
  );
}
