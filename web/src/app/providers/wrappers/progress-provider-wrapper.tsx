import { ProgressProvider } from "@bprogress/react";

export function ProgressProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider
      height="6px"
      color="#192CFF"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
