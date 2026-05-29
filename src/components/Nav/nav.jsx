import { useEffect } from "react";
import logo from '../../assets/logo.png';
import { useSelector, useDispatch } from "react-redux";
import Login from "../Login/login";
import RegistroForm from "../Register/register";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/oauthContext";
import { logout } from "../../redux/actions";
import Swal from "sweetalert2";

export default function Navbar() {
  const { currentUser } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAuth();

  const handleLogOut = async () => {
    try {
      await auth.logOut();
      dispatch(logout());
      Swal.fire({
        title: "¡Sesión cerrada con éxito!",
        icon: "success",
        confirmButtonColor: "#C9A84C",
        background: '#16130d',
        color: '#e9e1d7',
      }).then(() => {
        window.location.href = '/';
      });
    } catch (error) {
      console.error(`Error al cerrar sesión: ${error.message}`);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al cerrar sesión",
        icon: "error",
        confirmButtonColor: "#C9A84C",
        background: '#16130d',
        color: '#e9e1d7',
      });
    }
  };

  const handleNotificationAlert = () => {
    Swal.fire({
      title: "Notificaciones",
      text: "No tienes notificaciones pendientes en este momento.",
      icon: "info",
      confirmButtonColor: "#C9A84C",
      background: '#16130d',
      color: '#e9e1d7',
    });
  };

  const formattedChips = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(currentUser?.chips ?? 0);

  return (
    <header className={`fixed top-0 right-0 left-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-16 transition-all duration-300 ${
      currentUser?.id ? 'md:left-[220px]' : 'left-0'
    }`}>
      <div className="flex justify-between items-center h-16 px-4 md:px-margin-desktop w-full">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-6">
          {currentUser?.id ? (
            <>
              {/* Mobile Logo Only when Logged In */}
              <h1 className="md:hidden text-headline-md font-headline-md font-bold text-primary tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                RGAMES
              </h1>
              <nav className="hidden lg:flex gap-6 items-center">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `font-body-md text-body-md transition-colors duration-200 ${
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
                    `font-body-md text-body-md transition-colors duration-200 ${
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
                    `font-body-md text-body-md transition-colors duration-200 ${
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
                      `font-body-md text-body-md transition-colors duration-200 ${
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
            </>
          ) : (
            <>
              {/* Logo & Nav Links when Not Logged In */}
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
                  end
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
            </>
          )}
        </div>

        {/* Right Section: Notification, Buy Chips / User Profile / Login */}
        <div className="flex items-center gap-4">
          {currentUser?.id ? (
            <div className="flex items-center gap-4">
              {/* Balance Pill */}
              <div className="hidden sm:flex items-center bg-surface-container rounded-full px-4 py-1.5 border border-outline-variant/20">
                <span className="text-primary font-bold text-label-lg font-label-lg">{formattedChips}</span>
              </div>

              {/* Notification Bell */}
              <button
                onClick={handleNotificationAlert}
                className="text-on-surface-variant hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer flex items-center p-1"
              >
                <span className="material-symbols-outlined">notifications</span>
              </button>

              {/* User Avatar */}
              <div
                className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate('/perfil')}
              >
                <img
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  src={currentUser.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ"}
                />
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogOut}
                className="text-on-surface-variant hover:text-primary transition-colors bg-transparent border-0 cursor-pointer flex items-center p-1"
                title="Cerrar Sesión"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
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