import { useNavigate } from "react-router-dom";
import { CATEGORY_META, CATEGORY_ORDER, getGamesByCategory } from "../../data/gamesCatalog";

function GameRow({ game }) {
  const navigate = useNavigate();
  const isActive = game.status === "active";

  return (
    <button
      type="button"
      onClick={() => navigate(`/juegos/${game.slug}`)}
      className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl text-left cursor-pointer transition-all bg-transparent border-0 hover:bg-surface-variant/30 ${
        isActive ? "" : "opacity-60 hover:opacity-90"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border ${
          isActive ? "border-primary/40 bg-primary/10" : "border-outline-variant/30 bg-surface-container-high grayscale"
        }`}
      >
        {game.image ? (
          <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
        ) : (
          <span className={`material-symbols-outlined text-[16px] ${isActive ? "text-primary" : "text-on-surface-variant"}`}>
            {game.icon}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-label-md text-label-md leading-tight ${isActive ? "text-white" : "text-on-surface-variant"}`}>
          {game.name}
        </p>
        {isActive ? (
          <span className="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[12px]">person</span>
            {new Intl.NumberFormat("es-ES").format(game.players)}
          </span>
        ) : (
          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            Próximamente
          </span>
        )}
      </div>
    </button>
  );
}

export default function GamesCatalog() {
  return (
    <section className="py-8 px-6 max-w-container-max mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter uppercase mb-1">
          Catálogo de Juegos
        </h2>
        <p className="text-on-surface-variant font-light text-sm">
          Explora todos nuestros juegos por categoría. Los que ya están activos, ¡se juegan ahora mismo!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-6">
        {CATEGORY_ORDER.map((categoryKey) => {
          const meta = CATEGORY_META[categoryKey];
          const games = getGamesByCategory(categoryKey);
          if (games.length === 0) return null;

          return (
            <div key={categoryKey}>
              <h3 className={`text-xs font-black uppercase tracking-widest mb-2 ${meta.className}`}>
                {meta.label}
              </h3>
              <div className="space-y-0.5">
                {games.map((game) => (
                  <GameRow key={game.slug} game={game} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
