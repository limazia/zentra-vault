import { Link, useLocation } from "react-router-dom";

import { navigationLinks } from "./navigation-links";

import { Button } from "@/shared/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

export function SubHeader() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-16 justify-between gap-4">
      <div className="flex gap-2">
        <div className="flex items-center md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-8" size="icon" variant="ghost">
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem className="w-full" key={link.label}>
                      <NavigationMenuLink asChild className="py-1.5">
                        <Link to={link.to}>{link.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-6">
          <NavigationMenu className="h-full *:h-full max-md:hidden">
            <NavigationMenuList className="h-full gap-6">
              {navigationLinks.map((link) => (
                <NavigationMenuItem className="h-full" key={link.label}>
                  <NavigationMenuLink
                    asChild
                    data-active={
                      pathname.startsWith(link.to) ? "" : undefined
                    }
                    className="h-full justify-center rounded-none border-transparent border-y-2 py-1.5 font-medium text-muted-foreground hover:border-b-primary hover:bg-transparent hover:text-primary dark:hover:text-white data-active:border-b-primary data-active:text-primary dark:data-active:text-white focus:bg-transparent data-active:bg-transparent!"
                  >
                    <Link to={link.to}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}
