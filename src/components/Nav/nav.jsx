import { useEffect } from "react";
import logo from '../../assets/logo.png';
import rgamesLogo from '../../assets/rgames.png';
import chips from '../../assets/chips.png';
import { useSelector, useDispatch } from "react-redux";
import Login from "../Login/login";
import RegistroForm from "../Register/register";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/oauthContext";
import { logout } from "../../redux/actions";
import Swal from "sweetalert2";
import API_URL from "../../api/rutaApi";

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

  const formattedChips = (() => {
    const value = typeof currentUser?.chips === 'string' ? Number(currentUser.chips) : (currentUser?.chips ?? 0);
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
  })();

  const avatarSrc = currentUser?.id
    ? `${API_URL}/user/${currentUser.id}/avatar-image`
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ";

  return (
    <header className={`sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-20 transition-all duration-300 px-1` }>
      <div className="flex justify-between items-center h-16 px-4 md:px-margin-desktop w-full">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-6">
         
          <img src={rgamesLogo} className="h-12 md:h-14 w-auto object-contain" alt="RGAMES" />
           
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
                  <h>
                  </h>
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
        <div className="flex items-center gap-4" mt-3>
          {currentUser?.id ? (
            <div className="flex items-center gap-4" mt-3>
              <div className="hidden sm:flex items-center gap-3 bg-[#222326] border border-blue-500/15 rounded-full px-3 py-2 shadow-[0_10px_25px_rgba(12,25,60,0.35)] max-w-[19rem] mt-3">
                <button
                  type="button"
                  onClick={() => navigate('/bazar')}
                  className="w-16 h-16  overflow-hidden transition-all duration-200 focus:outline-none"
                >
                  <img
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    src={avatarSrc}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = currentUser.image || "https://via.placeholder.com/150";
                    }}
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => navigate('/perfil')}
                    className="w-full text-left text-white font-semibold text-sm truncate hover:text-blue-100"
                  >
                    {currentUser.nick ? currentUser.nick.charAt(0).toUpperCase() + currentUser.nick.slice(1) : "User"}
                  </button>
                  <div className="inline-flex items-center gap-2 text-blue-100 text-[11px] tracking-[0.08em] uppercase mt-1">
                    <img src={chips} alt="Chips" className="w-3.5 h-3.5" />
                    <span>{formattedChips} fichas</span>
                  </div>
                </div>
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