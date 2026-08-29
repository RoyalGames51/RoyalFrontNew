import rjImage from "../assets/rj.png";
import minasImage from "../assets/minas2.png";
import pachinkaImage from "../assets/rpachinka2.png";
import bingoImage from "../assets/bingoproxi.png";
import ruletaImage from "../assets/ruleta.png";

export const CATEGORY_META = {
  bingo: { label: "Bingo", className: "text-[#c9a84c]" },
  casino: { label: "Casino", className: "text-[#e05252]" },
  cartas: { label: "Cartas", className: "text-[#4f8fe0]" },
  otros: { label: "Otros", className: "text-[#4caf7d]" },
  slots: { label: "Slots", className: "text-[#a855f7]" },
};

export const CATEGORY_ORDER = ["bingo", "casino", "cartas", "otros", "slots"];

/**
 * Static game catalog for the lobby list on Home. Not backend-driven (there's no
 * category/description/image field on the backend Game entity, which only exists
 * today for the favorites relationship) — same hardcoded-catalog pattern already
 * used by GameGrid's GAMES array and Home's featuredGames array.
 */
export const GAMES_CATALOG = [
  {
    slug: "royal-joker",
    name: "Royal Joker",
    category: "slots",
    status: "active",
    image: rjImage,
    icon: "mood",
    players: 1476,
    playPath: "/play/royaljoker",
    description:
      "Una tragamonedas con temática de comodines llena de multiplicadores y rondas especiales. Gira los rodillos y deja que el Joker reparta la suerte.",
  },
  {
    slug: "minas",
    name: "Minas",
    category: "otros",
    status: "active",
    image: minasImage,
    icon: "grid_view",
    players: 3349,
    playPath: "/play/minas",
    // Matches the pre-existing backend Game row so favorites saved before the catalog
    // rework aren't lost.
    favoriteId: "501ffe04-71e2-44c9-a06a-f97df1babd0a",
    description:
      "Revela casillas en una grilla y evita las minas ocultas para multiplicar tu apuesta. Cuanto más avances, mayor será tu premio... si te arriesgas.",
  },
  {
    slug: "royal-pachinka",
    name: "Royal Pachinka",
    category: "otros",
    status: "active",
    image: pachinkaImage,
    icon: "casino",
    players: 2004,
    playPath: "/play/royalpachinka",
    favoriteId: "d9c2b8f0-7e6a-4c9a-9a2b-1f3e5a2b6c7d",
    description:
      "El clásico juego de pachinko con estilo Royal: deja caer la bola y observa cómo rebota entre los pines hasta encontrar tu multiplicador.",
  },
  {
    slug: "santawilds",
    name: "Santa Wilds",
    category: "slots",
    status: "active",
    icon: "ac_unit",
    players: 1820,
    playPath: "/play/santawilds",
    description:
      "Tragamonedas navideña con símbolos wild que se expanden y multiplican tus ganancias. Encontrá a Santa y desbloqueá rondas bonus llenas de regalos.",
  },
  {
    slug: "bingo",
    name: "Royal Bingo",
    category: "bingo",
    status: "active",
    image: bingoImage,
    icon: "grid_on",
    players: 2210,
    playPath: "/play/bingo",
    description:
      "El bingo de toda la vida, ahora en salas en vivo con otros jugadores de RoyalGames. Canta línea, canta bingo y gana el pozo.",
  },
  {
    slug: "video-bingo",
    name: "Video Bingo",
    category: "bingo",
    status: "soon",
    icon: "live_tv",
    description:
      "La velocidad del video bingo: cartones automáticos, rondas rápidas y bonos especiales sin esperar a que se llene la sala.",
  },
  {
    slug: "jogo-do-bicho",
    name: "Jogo do Bicho",
    category: "bingo",
    status: "soon",
    icon: "pets",
    description:
      "La tradicional lotería de animales llega a RoyalGames. Elige tu bicho de la suerte y apuesta a que sea el ganador del sorteo.",
  },
  {
    slug: "royal-ruleta",
    name: "Royal Ruleta (x500)",
    category: "casino",
    status: "soon",
    image: ruletaImage,
    icon: "donut_large",
    description:
      "Ruleta europea con multiplicador especial de hasta x500. Apuesta a tu número, color o docena favorita y deja girar la rueda.",
  },
  {
    slug: "crazy-time-royal",
    name: "Crazy Time Royal",
    category: "casino",
    status: "soon",
    icon: "celebration",
    description:
      "Nuestra rueda de la fortuna en vivo, con rondas bonus, multiplicadores gigantes y toda la energía de un game show en tiempo real.",
  },
  {
    slug: "blackjack",
    name: "Blackjack",
    category: "casino",
    status: "soon",
    icon: "style",
    description:
      "El clásico 21: vence al crupier sin pasarte de 21 puntos. Estrategia, cartas y la adrenalina de la mesa de blackjack.",
  },
  {
    slug: "uno",
    name: "UNO",
    category: "cartas",
    status: "soon",
    icon: "sports_esports",
    description:
      "El juego de cartas favorito de todos, ahora contra otros jugadores de RoyalGames. Quédate sin cartas antes que nadie y grita ¡UNO!",
  },
  {
    slug: "royal-christmas",
    name: "RoyalChristmas",
    category: "slots",
    status: "soon",
    icon: "ac_unit",
    description:
      "Tragamonedas de temporada con clima navideño, símbolos especiales y multiplicadores helados para las fiestas más doradas del año.",
  },
  {
    slug: "videoslots",
    name: "VideoSlots",
    category: "slots",
    status: "soon",
    icon: "diamond",
    description:
      "Todo nuestro catálogo de tragamonedas en un solo lugar: explora, filtra y encuentra tu próxima slot favorita.",
  },
];

export const getGameBySlug = (slug) => GAMES_CATALOG.find((game) => game.slug === slug);

export const getGameByPlayPath = (path) => GAMES_CATALOG.find((game) => game.playPath === path);

export const getGamesByCategory = (category) =>
  GAMES_CATALOG.filter((game) => game.category === category);
