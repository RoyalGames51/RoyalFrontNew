import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { CATEGORY_META, getGameBySlug } from "../../../data/gamesCatalog";
import { swalThemeConfig } from "../../../utils/formatters";

export default function GameDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const game = getGameBySlug(slug);

  if (!game) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <h2 className="text-2xl font-bold text-error mb-4">Juego no encontrado.</h2>
        <button
          onClick={() => navigate("/juegos")}
          className="px-6 py-2.5 rounded-lg gold-gradient text-[#0A0A0F] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
        >
          Ver Todos los Juegos
        </button>
      </div>
    );
  }

  const isActive = game.status === "active";
  const categoryMeta = CATEGORY_META[game.category];

  const handlePlay = () => {
    if (isActive) {
      window.open(game.playPath, "_blank", "noopener,noreferrer");
      return;
    }
    Swal.fire({
      title: game.name,
      text: "¡Este juego estará disponible muy pronto! Nuestro equipo real está trabajando para traértelo.",
      icon: "info",
      ...swalThemeConfig,
    });
  };

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full pt-20 md:pt-24 px-4 md:px-margin-desktop pb-16 text-on-surface">
      <button
        onClick={() => navigate("/juegos")}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors bg-transparent border-0 cursor-pointer mb-6 text-sm"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Ver Todos los Juegos
      </button>

      {/* Banner */}
      <div className="relative w-full h-56 md:h-80 rounded-xl overflow-hidden border border-outline-variant/20 mb-8">
        {game.image ? (
          <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container-low">
            <span className="material-symbols-outlined text-[96px] text-on-surface-variant/40">
              {game.icon}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <span className={`text-[11px] font-black uppercase tracking-widest ${categoryMeta.className}`}>
            {categoryMeta.label}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tighter">{game.name}</h1>
        </div>
        {!isActive && (
          <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-on-surface-variant text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
            Próximamente
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <h2 className="font-headline-sm text-headline-sm text-white mb-4">Sobre este juego</h2>
          <p className="text-on-surface-variant leading-relaxed">{game.description}</p>
        </div>

        <div className="lg:col-span-4">
          <div className="glass-card p-6 rounded-xl space-y-4">
            {isActive && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant uppercase tracking-wider text-[11px]">Jugando ahora</span>
                <span className="flex items-center gap-1 text-white font-bold">
                  <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                  {new Intl.NumberFormat("es-ES").format(game.players)}
                </span>
              </div>
            )}
            <button
              onClick={handlePlay}
              className={`w-full py-3.5 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? "gold-gradient text-black hover:brightness-110 active:scale-95 cursor-pointer border-0"
                  : "bg-surface-container-high text-on-surface-variant border border-outline-variant/30 cursor-pointer hover:bg-surface-variant/40"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isActive ? "play_circle" : "hourglass_top"}
              </span>
              {isActive ? "Jugar" : "Próximamente"}
            </button>
            {isActive && (
              <p className="text-on-surface-variant text-[11px] text-center">
                Se abrirá en una pestaña nueva.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
