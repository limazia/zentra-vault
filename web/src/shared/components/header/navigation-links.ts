import { LayoutDashboard, FolderClosed, ScrollText } from "lucide-react";

export const navigationLinks = [
  { to: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { to: "/folders", label: "Pastas", icon: FolderClosed },
  { to: "/audit", label: "Auditoria", icon: ScrollText },
];
