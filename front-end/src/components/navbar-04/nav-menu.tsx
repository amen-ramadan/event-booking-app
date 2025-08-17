import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";
import { ModeToggle } from "../mode-toggle";
import { useContext } from "react";
import AuthContext from "@/context/auth-context";

export const NavMenu = (props: React.ComponentProps<typeof NavigationMenu>) => {
  const value = useContext(AuthContext);

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {value.token && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/booking">حجوزاتي</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/event">المناسبات</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
