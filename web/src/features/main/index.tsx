import type { Extension } from "@/shared/schemas";
import { isValidExtension } from "@/shared/utils/extension";

import { SplashScreen } from "@/shared/components/ui/loading";

export function MainPage() {
  const params = new URLSearchParams(window.location.search);

  const extensionParam = params.get("extension");
  const extension: Extension | undefined = isValidExtension(extensionParam)
    ? extensionParam
    : undefined;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <main className="flex items-center justify-center w-full">
        <SplashScreen extension={extension} />
      </main>
    </div>
  );
}
