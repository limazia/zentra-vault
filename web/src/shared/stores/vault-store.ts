import { useSyncExternalStore } from "react";

type Listener = () => void;

type VaultState = {
  folderId: string | null;
  password: string | null;
};

let state: VaultState = { folderId: null, password: null };
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): VaultState {
  return state;
}

export function unlockFolder(folderId: string, password: string): void {
  state = { folderId, password };
  emitChange();
}

export function lockVault(): void {
  state = { folderId: null, password: null };
  emitChange();
}

export function getVaultPassword(): string | null {
  return state.password;
}

export function useVaultStore(folderId: string | undefined) {
  const current = useSyncExternalStore(subscribe, getSnapshot);
  const isUnlocked = !!folderId && current.folderId === folderId;

  return {
    isUnlocked,
    vaultPassword: isUnlocked ? current.password : null,
  };
}
