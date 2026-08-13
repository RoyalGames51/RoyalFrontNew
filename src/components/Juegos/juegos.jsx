import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FavoriteButton from "./FavoriteButton";
import { fetchFavoriteGames } from "../../redux/actions";
import { GAMES_CATALOG, CATEGORY_META, CATEGORY_ORDER } from "../../data/gamesCatalog";

export default function GameGrid() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, favoriteGames } = useSelector((state) => state);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchFavoriteGames(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  const games = activeCategory === "all"
    ? GAMES_CATALOG
    : GAMES_CATALOG.filter((game) => game.category === activeCategory);

  const availableCategories = CATEGORY_ORDER.filter((key) =>
    GAMES_CATALOG.some((game) => game.category === key)
  );

  return (
    <div className="w-full max-w-container-max mx-auto px-4 md:px-margin-desktop py-6">
      <h1 className="font-headline-lg text-headline-lg text-white mb-2 text-center md:text-left">
        Todos los Juegos
      </h1>
      <p className="text-on-surface-variant text-sm mb-6 text-center md:text-left">
        Explorá nuestro catálogo completo. Tocá un juego para ver sus detalles.
      </p>

      {availableCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              activeCategory === "all"
                ? "gold-gradient text-black border-transparent"
                : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant/30 bg-transparent"
            }`}
          >
            Todos
          </button>
          {availableCategories.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                activeCategory === key
                  ? "gold-gradient text-black border-transparent"
                  : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant/30 bg-transparent"
              }`}
            >
              {CATEGORY_META[key].label}
            </button>
          ))}
        </div>
      )}

      {games.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block">
            casino
          </span>
          <p className="text-on-surface-variant">No hay juegos en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {games.map((game) => {
            const isActive = game.status === "active";
            return (
              <div
                key={game.slug}
                onClick={() => navigate(`/juegos/${game.slug}`)}
                className={`group relative rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/50 transition-all cursor-pointer bg-surface-container-high ${
                  isActive ? "" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div className={`aspect-square overflow-hidden flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container-low ${!isActive ? "grayscale" : ""}`}>
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40">
                      {game.icon}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black via-black/70 to-transparent text-left">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${CATEGORY_META[game.category].className}`}>
                    {CATEGORY_META[game.category].label}
                  </span>
                  <p className="text-white font-bold text-sm truncate">{game.name}</p>
                </div>

                {!isActive && (
                  <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-on-surface-variant text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-white/10">
                    Próximamente
                  </span>
                )}

                {game.favoriteId && (
                  <FavoriteButton
                    gameId={game.favoriteId}
                    isFavorite={!!favoriteGames?.includes(game.favoriteId)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
