import { Link } from "react-router-dom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/components/ui/navigation-menu";
import { Button } from "@/shared/components/ui/button";

import { navigationLinks } from "./navigation-links";

export function MobilePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="group size-8 md:hidden" variant="ghost" size="icon">
          <svg
            className="pointer-events-none"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12L20 12"
              className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
            />
            <path
              d="M4 12H20"
              className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
            />
            <path
              d="M4 12H20"
              className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
            />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-36 p-1 md:hidden space-y-2">
        <NavigationMenu className="max-w-none *:w-full">
          <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.label} className="w-full">
                <NavigationMenuLink asChild className="py-1.5">
                  <Link to={link.to}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  );
}
