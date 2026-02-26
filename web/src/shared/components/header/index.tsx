import { MainHeader } from "./main-header";
import { SubHeader } from "./sub-header";

export function Header() {
  return (
    <header className="w-full space-y-4 bg-background border-b px-8 md:px-12">
      <div className="w-full pt-8">
        <MainHeader />
      </div>

      <div className="w-full hidden md:block">
        <SubHeader />
      </div>
    </header>
  );
}
