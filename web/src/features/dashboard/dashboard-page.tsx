import { Link } from "react-router-dom";
import {
  FolderClosed,
  FileKey2,
  Users,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "@/shared/hooks/use-auth";
import { mockFolders, mockVaultFiles, mockAuditLogs } from "@/shared/mocks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

const stats = [
  {
    label: "Total de Pastas",
    value: mockFolders.length,
    icon: FolderClosed,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Arquivos",
    value: mockVaultFiles.length,
    icon: FileKey2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Membros do Time",
    value: 3,
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Eventos de Auditoria",
    value: mockAuditLogs.length,
    icon: Activity,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

export function DashboardPage() {
  const { user } = useAuth();

  const recentAudit = mockAuditLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bem-vindo de volta, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aqui está uma visão geral dos seus ambientes seguros.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardContent className="flex items-center gap-4">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pastas Recentes
              <Link
                to="/folders"
                className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver tudo
                <ArrowUpRight className="size-3" />
              </Link>
            </CardTitle>
            <CardDescription>Suas pastas atualizadas mais recentemente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockFolders.slice(0, 4).map((folder) => (
              <Link
                key={folder.id}
                to={`/folders/${folder.id}`}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <FolderClosed className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {folder.envCount} arquivos env
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(folder.lastUpdatedAt)}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Atividade Recente
              <Link
                to="/audit"
                className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver tudo
                <ArrowUpRight className="size-3" />
              </Link>
            </CardTitle>
            <CardDescription>Últimas ações em todos os ambientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAudit.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
              >
                <Avatar size="sm">
                  <AvatarImage src={log.userAvatar} alt={log.userName} />
                  <AvatarFallback>
                    {log.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {log.userName}
                    </span>
                    <Badge variant="secondary" className="shrink-0">
                      {log.action}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {log.folderName}
                    {log.fileName !== "—" && ` / ${log.fileName}`}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(log.timestamp)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
