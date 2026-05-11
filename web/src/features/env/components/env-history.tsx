import { Clock, History } from "lucide-react";

import type { FileHistory } from "@/shared/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

interface FileHistoryListProps {
  history: FileHistory[];
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FileHistoryList({ history }: FileHistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <History className="size-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          Nenhum histórico disponível ainda.
        </p>
      </div>
    );
  }

  return (
    <div>
      {history.map((entry, index) => {
        const isLast = index === history.length - 1;

        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center self-stretch">
              <Avatar size="sm" className="shrink-0">
                <AvatarImage src={entry.authorAvatar} alt={entry.author} />
                <AvatarFallback>{entry.author.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isLast && <div className="w-px flex-1 bg-border" />}
            </div>

            <div
              className={`flex flex-1 items-center justify-between gap-2 ${!isLast ? "pb-6" : ""}`}
            >
              <span className="text-sm font-medium">{entry.author}</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {formatDateTime(entry.editedAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
