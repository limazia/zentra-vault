import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";

export const AUDIT_ACTION_OPTIONS = [
  { value: "env.create", label: "Criar env" },
  { value: "env.update", label: "Atualizar env" },
  { value: "env.delete", label: "Excluir env" },
  { value: "env.view", label: "Visualizar env" },
  { value: "folder.create", label: "Criar pasta" },
  { value: "folder.delete", label: "Excluir pasta" },
  { value: "secret.verify", label: "Verificar segredo" },
] as const;

const auditFiltersParsers = {
  search: parseAsString.withDefault(""),
  action: parseAsArrayOf(parseAsString).withDefault([]),
};

export function useAuditFilters() {
  return useQueryStates(auditFiltersParsers, {
    urlKeys: {
      search: "q",
      action: "action",
    },
  });
}
