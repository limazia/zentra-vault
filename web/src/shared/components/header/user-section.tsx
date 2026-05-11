import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { cn } from "@/shared/utils/cn";
import { initials } from "@/shared/utils/initials";
import { useAuth } from "@/shared/hooks/use-auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export function UserSection() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/50 data-[state=open]:bg-accent/50 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatarUrl || "/placeholder.svg"}
              alt={user?.name || ""}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials(user?.name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-medium truncate max-w-[120px]">
              {user?.name}
            </span>
            {user?.email && (
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {user.email}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-lg w-72 p-0">
        <DropdownMenuGroup className="p-0">
          <DropdownMenuItem asChild>
            <Link
              to={"/settings"}
              className="flex items-center gap-3 px-3 py-3 text-sm cursor-pointer rounded-none focus:bg-accent focus:text-accent-foreground outline-none"
            >
              <User className="size-4 shrink-0" />
              <span>Minha Conta</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-0" />

          <DropdownMenuItem
            variant="destructive"
            className="flex items-center gap-3 px-3 py-3 text-sm cursor-pointer rounded-none"
            onClick={handleLogout}
          >
            <LogOut className="size-4 shrink-0 text-inherit" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
