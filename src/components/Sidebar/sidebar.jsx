import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { fetchConversations } from "../../redux/actions/index";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { currentUser, messages } = useSelector((state) => state);
  const location = useLocation();

  // Mods ven el panel de admin igual que los admins (todo excepto gestión de roles).
  const canAccessAdminPanel = currentUser?.role === "admin" || currentUser?.role === "mod";
  const unreadTotal = (messages?.conversations || []).reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchConversations());
    }
  }, [dispatch, currentUser?.id]);

  const accountItems = [
    { to: "/chips", icon: "paid", label: "Comprar Fichas" },
    { to: "/chips?tab=history", icon: "receipt_long", label: "Historial de Movimientos" },
  ];

  const socialItems = [
    { to: "/amigos", icon: "group", label: "Amigos" },
    { to: "/mensajes", icon: "forum", label: "Mensajes", badge: unreadTotal },
    { to: "/ayuda", icon: "support_agent", label: "Ayuda" },
  ];

  // "Cargas" es el listado global de depósitos de toda la plataforma (un resumen de dinero) —
  // queda admin-only, igual que el backend. Los mods igual pueden ver los depósitos de UN
  // cliente puntual, pero desde la sección "Actividad" del detalle de ese usuario, no acá.
  const adminItems = [
    { to: "/admin/dashboard", icon: "dashboard", label: "Panel Admin" },
    { to: "/admin/users", icon: "manage_accounts", label: "Usuarios" },
    { to: "/admin/tickets", icon: "support_agent", label: "Tickets" },
    ...(currentUser?.role === "admin" ? [{ to: "/admin/deposits", icon: "payments", label: "Cargas" }] : []),
    { to: "/admin/prizes", icon: "emoji_events", label: "Premios" },
    { to: "/admin/referrals", icon: "diversity_3", label: "Referidos" },
  ];

  if (!currentUser?.id || location.pathname.includes("/play")) {
    return null;
  }

  const renderLink = ({ to, icon, label, badge }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center justify-center lg:justify-start gap-3 w-12 h-12 lg:w-full lg:h-auto lg:px-3 lg:py-2.5 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-on-surface-variant hover:bg-surface-variant/40 hover:text-primary"
        }`
      }
    >
      <span className="relative material-symbols-outlined text-[22px]">
        {icon}
        {!!badge && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface" />
        )}
      </span>
      <span className="hidden lg:inline font-body-sm text-body-sm whitespace-nowrap">
        {label}
      </span>
      {!!badge && (
        <span className="hidden lg:inline-flex ml-auto bg-primary text-black text-[10px] font-bold rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          {badge}
        </span>
      )}
      {/* Tooltip for collapsed (icon-only) state */}
      <span className="lg:hidden pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded bg-surface-container-high border border-outline-variant/30 px-2 py-1 text-xs text-on-surface opacity-0 group-hover:opacity-100 transition-opacity z-50">
        {label}
      </span>
    </NavLink>
  );

  return (
    <aside className="hidden md:flex fixed left-0 top-20 bottom-0 z-40 w-16 lg:w-56 flex-col gap-6 bg-surface/80 backdrop-blur-md border-r border-outline-variant/30 px-2 lg:px-4 py-6 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <p className="hidden lg:block px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
          Cuenta
        </p>
        {accountItems.map(renderLink)}
      </div>

      <div className="flex flex-col gap-1">
        <p className="hidden lg:block px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
          Social
        </p>
        {socialItems.map(renderLink)}
      </div>

      {canAccessAdminPanel && (
        <div className="flex flex-col gap-1">
          <p className="hidden lg:block px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
            Administración
          </p>
          {adminItems.map(renderLink)}
        </div>
      )}
    </aside>
  );
}
