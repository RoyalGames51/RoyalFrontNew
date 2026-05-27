import { useEffect } from "react";
import logo from '../../assets/logo.png';
import { useSelector } from "react-redux";
import Login from "../Login/login";
import RegistroForm from "../Register/register";
import LogOut from "../Logout/logout";
import { Link, NavLink, useLocation } from "react-router-dom";
import UserZone from "../UserZone/userZone";

export default function Navbar() {
  const { currentUser } = useSelector((state) => state);
  const location = useLocation();

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop w-full mx-auto max-w-container-max">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            {logo ? (
              <img src={logo} className="h-8 md:h-10 w-auto object-contain" alt="RGAMES" />
            ) : (
              <span className="text-headline-md font-headline-md font-bold text-primary tracking-tighter">RGAMES</span>
            )}
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-label-lg text-label-lg transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              Lobby
            </NavLink>

            <NavLink
              to="/juegos"
              className={({ isActive }) =>
                `font-label-lg text-label-lg transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              Juegos
            </NavLink>

            <NavLink
              to="/noticias"
              className={({ isActive }) =>
                `font-label-lg text-label-lg transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              Noticias
            </NavLink>

            {currentUser?.admin && (
              <NavLink
                to="/panel"
                className={({ isActive }) =>
                  `font-label-lg text-label-lg transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-bold border-b-2 border-primary pb-1"
                      : "text-on-surface-variant hover:text-primary"
                  }`
                }
              >
                Panel
              </NavLink>
            )}
          </nav>
        </div>

        {/* Right Section: Notification, Buy Chips / User Profile / Login */}
        <div className="flex items-center gap-4">
          {currentUser?.id ? (
            <div className="flex items-center gap-4">
              {/* User Dashboard / profile zone */}
              <UserZone />

              {/* Buy Chips Button */}
              <Link
                to="/chips"
                className="px-4 py-2 rounded-lg gold-gradient text-on-primary font-label-lg text-label-lg font-bold hover:opacity-90 transition-all shadow-sm text-center"
              >
                Comprar Fichas
              </Link>
              
              {currentUser?.admin && <LogOut />}
            </div>
          ) : (
            <div className="flex gap-2">
              <Login />
              <RegistroForm />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}