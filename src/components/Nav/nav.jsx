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

  const formattedChips = formatChips(currentUser?.chips);

  // The avatar bytes live behind a plain, unversioned URL — without a cache-buster the browser
  // (and even React, since the `src` string never changes) would keep showing the old image
  // forever after an edit. `lastSeen` already refreshes on every navigation (heartbeat effect
  // in App.jsx), so it doubles as a free "did anything change" signal here.
  const avatarSrc = currentUser?.id
    ? `${API_URL}/user/${currentUser.id}/avatar-image?v=${currentUser.lastSeen ? new Date(currentUser.lastSeen).getTime() : 0}`
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ";

  return (
    <header className={`sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-20 transition-all duration-300 pt-1` }>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 pl-0 pr-4 md:pr-margin-desktop w-full gap-2">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-6 justify-self-start min-w-0">
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

        {/* Center Section: User chip (avatar + nick/rank + fichas), centered on the whole bar */}
        <div className="flex items-center justify-self-center">
          {currentUser?.id && (
            <div className="hidden sm:flex items-center gap-2.5 bg-surface-container-high border border-primary/20 rounded-full pl-1.5 pr-4 py-1.5 max-w-[15.5rem] hover:border-primary/40 transition-colors">
              <button
                type="button"
                onClick={() => navigate('/bazar')}
                title="Cambiar avatar"
                className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/60 flex-shrink-0 bg-surface-container-lowest transition-transform hover:scale-105 focus:outline-none cursor-pointer p-0"
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
              <button
                type="button"
                onClick={() => navigate(currentUser.nick ? `/perfil/${currentUser.nick}` : '/perfil')}
                className="flex flex-col items-start min-w-0 flex-1 bg-transparent border-0 cursor-pointer p-0 text-left"
              >
                <span className="flex items-center gap-1.5 min-w-0 max-w-full">
                  <span className="text-on-surface font-bold text-sm truncate">
                    {currentUser.nick ? currentUser.nick.charAt(0).toUpperCase() + currentUser.nick.slice(1) : "Usuario"}
                  </span>
                  <RankBadge tier={currentUser.rank} size="sm" />
                </span>
                <span className="flex items-center gap-1 text-primary text-[11px] font-bold tracking-wide mt-0.5">
                  <img src={chips} alt="Fichas" className="w-3.5 h-3.5" />
                  {formattedChips}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Logout / Login-Registrarse */}
        <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
          {currentUser?.id ? (
            <button
              onClick={handleLogOut}
              title="Cerrar Sesión"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors bg-transparent border-0 cursor-pointer flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
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