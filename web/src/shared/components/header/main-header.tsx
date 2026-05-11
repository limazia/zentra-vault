import { Link } from "react-router-dom";

import { Logo } from "@/assets";

import { UserSection } from "./user-section";
import { MobilePopover } from "./mobile-popover";

export function MainHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MobilePopover />

        <div className="flex items-center gap-6">
          <Link to={"/"} className="text-primary hover:text-primary/90">
            <Logo className="w-56 h-auto" />
          </Link>
        </div>
      </div>

      <div>
        <UserSection />
      </div>
    </div>
  );
}
