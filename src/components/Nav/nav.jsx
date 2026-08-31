import logo from '../../assets/logo.png';
import rgamesLogo from '../../assets/rgames.png';
import chips from '../../assets/chips.png';
import { useSelector, useDispatch } from "react-redux";
import Login from "../Login/login";
import RegistroForm from "../Register/register";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/oauthContext";
import { logout } from "../../redux/actions";
import Swal from "sweetalert2";
import API_URL from "../../api/rutaApi";
import { formatChips, swalThemeConfig } from "../../utils/formatters";
import RankBadge from "../ui/RankBadge/rankBadge";

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
        ...swalThemeConfig,
      }).then(() => {
        window.location.href = '/';
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un error al cerrar sesión",
        icon: "error",
        ...swalThemeConfig,
      });
    }
  };

  const handleNotificationAlert = () => {
    Swal.fire({
      title: "Notificaciones",
      text: "No tienes notificaciones pendientes en este momento.",
      icon: "info",
      ...swalThemeConfig,
    });
  };

  const formattedChips = formatChips(currentUser?.chips);

  const avatarSrc = currentUser?.id
    ? `${API_URL}/user/${currentUser.id}/avatar-image`
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ";

  return (
    <header className={`sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-20 transition-all duration-300 pt-1` }>
      <div className="flex justify-between items-center h-16 pl-0 pr-4 md:pr-margin-desktop w-full">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img src={rgamesLogo} className="h-12 md:h-14 w-auto object-contain pl-4 md:pl-6" alt="RGAMES" />
          </Link>
           
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
                  Inicio
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
              </nav>
            </>
          ) : (
            <>
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
                  Inicio
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
              </nav>
            </>
          )}
        </div>

        {/* Right Section: Notification, Buy Chips / User Profile / Login */}
            <div className="flex items-center gap-4">
          {currentUser?.id ? (
        <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-[#222326] border border-blue-500/15 rounded-full px-3 py-2 shadow-[0_10px_25px_rgba(12,25,60,0.35)] max-w-[15.2rem] mt-3">
                <button
                  type="button"
                  onClick={() => navigate('/bazar')}
                  className="w-16 h-16 overflow-hidden transition-all duration-200 focus:outline-none"
                  style={{ width: '3.2rem', height: '3.2rem' }}
                >
                  <img
                    alt="Avatar de Usuario"
                    className="w-full h-full object-cover object-top"
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
                    onClick={() => navigate(currentUser.nick ? `/perfil/${currentUser.nick}` : '/perfil')}
                    className="w-full text-left text-white font-semibold text-sm truncate hover:text-blue-100 flex items-center gap-1.5"
                  >
                    <span className="truncate">
                      {currentUser.nick ? currentUser.nick.charAt(0).toUpperCase() + currentUser.nick.slice(1) : "Usuario"}
                    </span>
                    <RankBadge tier={currentUser.rank} size="sm" />
                  </button>
                  <div className="inline-flex items-center gap-2 text-blue-100 text-[11px] tracking-[0.08em] uppercase mt-1">
                    <img src={chips} alt="Fichas" className="w-3.5 h-3.5" />
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
            <div className="flex gap-3">
              <Login className="px-6 py-2.5 rounded-sm border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all btn-hover-glow cursor-pointer bg-transparent">
                Entrar
              </Login>
              <RegistroForm className="px-6 py-2.5 rounded-sm gold-gradient text-black text-xs font-bold uppercase tracking-widest transition-all btn-hover-glow cursor-pointer border-0">
                Registrarse
              </RegistroForm>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}