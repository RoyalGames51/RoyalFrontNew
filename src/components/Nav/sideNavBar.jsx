import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function SideNavBar() {
  const navigate = useNavigate();

  const handleSoonAlert = (section) => {
    Swal.fire({
      title: section,
      text: '¡Esta sección estará disponible muy pronto! Nuestro equipo está trabajando para ti.',
      icon: 'info',
      confirmButtonColor: '#C9A84C',
      background: '#16130d',
      color: '#e9e1d7',
    });
  };

  const handleSupportAlert = () => {
    Swal.fire({
      title: 'Soporte RGAMES',
      text: 'Para asistencia, contáctanos a soporte@rgames.com o a través de nuestro canal oficial.',
      icon: 'question',
      confirmButtonColor: '#C9A84C',
      background: '#16130d',
      color: '#e9e1d7',
    });
  };

  return (
    <aside className="hidden md:flex flex-col py-6 gap-4 bg-surface h-screen w-[220px] fixed left-0 top-0 overflow-y-auto overflow-x-hidden border-r border-outline-variant/20 z-[60] no-scrollbar select-none text-left">
      <div className="px-6 mb-6">
        <h1 className="text-primary font-bold text-headline-md font-headline-md tracking-tighter">RGAMES</h1>
        <p className="text-on-surface-variant font-label-md text-label-md">Casino Premium</p>
      </div>

      <nav className="flex flex-col flex-grow">
        {/* Lobby Link */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
              isActive
                ? 'text-primary border-l-4 border-primary bg-secondary-container/10 translate-x-1'
                : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
            }`
          }
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
          <span className="font-label-lg text-label-lg">Lobby</span>
        </NavLink>

        {/* Slots Link */}
        <NavLink
          to="/juegos"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
              isActive
                ? 'text-primary border-l-4 border-primary bg-secondary-container/10 translate-x-1'
                : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
            }`
          }
        >
          <span className="material-symbols-outlined">casino</span>
          <span className="font-label-lg text-label-lg">Slots</span>
        </NavLink>

        {/* Live Casino */}
        <button
          onClick={() => handleSoonAlert('Casino en Vivo')}
          className="w-full text-left text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary flex items-center gap-3 px-6 py-3 transition-all"
        >
          <span className="material-symbols-outlined">person_play</span>
          <span className="font-label-lg text-label-lg">Live Casino</span>
        </button>

        {/* Sports */}
        <button
          onClick={() => handleSoonAlert('Deportes')}
          className="w-full text-left text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary flex items-center gap-3 px-6 py-3 transition-all"
        >
          <span className="material-symbols-outlined">sports_soccer</span>
          <span className="font-label-lg text-label-lg">Sports</span>
        </button>

        {/* VIP Club */}
        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
              isActive
                ? 'text-primary border-l-4 border-primary bg-secondary-container/10 translate-x-1'
                : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
            }`
          }
        >
          <span className="material-symbols-outlined">workspace_premium</span>
          <span className="font-label-lg text-label-lg">VIP Club</span>
        </NavLink>
      </nav>

      <div className="mt-auto px-6 py-4 border-t border-outline-variant/10">
        <button
          onClick={() => navigate('/chips')}
          className="gold-gradient text-on-primary w-full py-2 rounded-lg font-bold hover:opacity-80 transition-opacity mb-4 cursor-pointer"
        >
          Depositar Ahora
        </button>
        <div className="flex flex-col gap-2">
          <NavLink
            to="/perfil"
            className="text-on-surface-variant hover:text-primary flex items-center gap-2 text-label-md font-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span> Configuración
          </NavLink>
          <button
            onClick={handleSupportAlert}
            className="text-on-surface-variant hover:text-primary flex items-center gap-2 text-label-md font-label-md bg-transparent border-0 p-0 cursor-pointer w-full text-left"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span> Soporte
          </button>
        </div>
      </div>
    </aside>
  );
}
