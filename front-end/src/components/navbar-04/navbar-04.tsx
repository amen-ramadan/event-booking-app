import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { Link, Outlet, useNavigate } from "react-router";
import { useContext } from "react";
import AuthContext from "@/context/auth-context";

const Navbar04Page = () => {
  const value = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      <nav className=" h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-3 md:mx-10 m-3 rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>

            {value.token ? (
              // Render something when the user is authenticated, e.g. a logout button or user menu
              <>
                <Button
                  className="rounded-full md:block hidden"
                  onClick={() => {
                    value.logout();
                    navigate("/");
                  }}
                >
                  تسجيل خروج
                </Button>
                <p className="hidden sm:inline-flex">{value.username}</p>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full"
                >
                  <Link to="/register">انشاء حساب</Link>
                </Button>
                <Button className="rounded-full">
                  <Link to="/login">تسجيل دخول</Link>
                </Button>
              </>
            )}
          </div>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <Logo />
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar04Page;
