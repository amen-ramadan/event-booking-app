import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavMenu } from "./nav-menu";
import { useContext } from "react";
import AuthContext from "@/context/auth-context";
import { useNavigate } from "react-router";

export const NavigationSheet = () => {
  const value = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        {/* <Logo /> */}
        {value.token && (
          <>
            <p className="text-2xl text-left mt-2 ml-5 text-gray-700 dark:text-gray-200">
              {value.username}
            </p>
          </>
        )}
        <NavMenu orientation="vertical" />
        {value.token ? (
          <>
            <Button
              className="rounded-full md:hidden w-1/2 mb-96 mr-2"
              onClick={() => {
                value.logout();
              }}
            >
              تسجيل خروج
            </Button>
          </>
        ) : (
          <>
            <Button
              className="rounded-full md:hidden w-1/2 mb-96 mr-2"
              onClick={() => {
                navigate("/login");
              }}
            >
              تسجيل الدخول
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
