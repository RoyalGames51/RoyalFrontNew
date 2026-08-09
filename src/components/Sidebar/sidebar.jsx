import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { currentUser } = useSelector((state) => state);
  const location = useLocation();

  const isAdmin = currentUser?.role === "admin";

  const accountItems = [
    { to: "/chips", icon: "paid", label: "Comprar Fichas" },
  ];

  const adminItems = [
    { to: "/admin/dashboard", icon: "dashboard", label: "Panel Admin" },
    { to: "/admin/users", icon: "manage_accounts", label: "Usuarios" },
  ];

  if (!currentUser?.id || location.pathname.includes("/play")) {
    return null;
  }

  const renderLink = ({ to, icon, label }) => (
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
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span className="hidden lg:inline font-body-sm text-body-sm whitespace-nowrap">
        {label}
      </span>
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

      {isAdmin && (
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
