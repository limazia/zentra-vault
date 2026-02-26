import {
  ScrollText,
  Search,
  FileKey2,
  FolderClosed,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { mockAuditLogs } from "@/shared/mocks";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { useAuditFilters } from "./hooks/use-audit-filters";
import { AuditFilterPopover } from "./components/audit-filter-popover";

const ACTION_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    badgeClass: string;
  }
> = {
  "env.create": {
    label: "Env criado",
    icon: Plus,
    color: "text-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  "env.update": {
    label: "Env atualizado",
    icon: RefreshCw,
    color: "text-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  "env.delete": {
    label: "Env excluído",
    icon: Trash2,
    color: "text-red-500",
    badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  "env.view": {
    label: "Env visualizado",
    icon: Eye,
    color: "text-violet-500",
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  "folder.create": {
    label: "Pasta criada",
    icon: FolderClosed,
    color: "text-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  "folder.delete": {
    label: "Pasta excluída",
    icon: FolderClosed,
    color: "text-red-500",
    badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  "secret.verify": {
    label: "Segredo verificado",
    icon: ShieldCheck,
    color: "text-amber-500",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  return formatDateTime(dateStr);
}

export function AuditPage() {
  const [filters, setFilters] = useAuditFilters();

  const filteredLogs = mockAuditLogs.filter((log) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchesSearch =
        log.userName.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.folderName.toLowerCase().includes(query) ||
        log.fileName.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    if (filters.action.length > 0 && !filters.action.includes(log.action)) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Log de Auditoria</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe todas as ações nos seus ambientes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Histórico de Atividades</CardTitle>
              <CardDescription>
                {filteredLogs.length} evento{filteredLogs.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <AuditFilterPopover
                selectedActions={filters.action}
                onActionsChange={(actions) => setFilters({ action: actions })}
              />
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar logs..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <ScrollText className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-sm font-medium">Nenhum log encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente ajustar seus filtros de busca.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[220px]">Usuário</TableHead>
                  <TableHead className="w-[200px]">Evento</TableHead>
                  <TableHead className="hidden md:table-cell">Recurso</TableHead>
                  <TableHead className="hidden lg:table-cell w-[180px] text-right">
                    Data
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const config = ACTION_CONFIG[log.action];
                  const ActionIcon = config?.icon ?? ScrollText;

                  return (
                    <TableRow key={log.id} className="group">
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={log.userAvatar} alt={log.userName} />
                            <AvatarFallback className="text-xs">
                              {log.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {log.userName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground lg:hidden">
                              {formatRelativeTime(log.timestamp)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5">
                        <Badge
                          variant="outline"
                          className={`gap-1.5 font-medium ${config?.badgeClass ?? ""}`}
                        >
                          <ActionIcon className="size-3" />
                          {config?.label ?? log.action}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden py-3.5 md:table-cell">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                            {log.action.startsWith("folder") ? (
                              <FolderClosed className="size-3.5 text-muted-foreground" />
                            ) : (
                              <FileKey2 className="size-3.5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm text-foreground">
                              {log.folderName}
                            </p>
                            {log.fileName !== "—" && (
                              <p className="truncate font-mono text-xs text-muted-foreground">
                                {log.fileName}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden py-3.5 lg:table-cell">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {formatRelativeTime(log.timestamp)}
                          </p>
                          <p className="text-xs text-muted-foreground/60">
                            {formatDateTime(log.timestamp)}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
