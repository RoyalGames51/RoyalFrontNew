import { useState } from "react";

const TAG_META = {
  Lanzamiento: "text-primary bg-primary/10 border-primary/30",
  Juegos: "text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/30",
  Promoción: "text-green-400 bg-green-400/10 border-green-400/30",
  Novedad: "text-[#4f8fe0] bg-[#4f8fe0]/10 border-[#4f8fe0]/30",
};

const novedades = [
  {
    id: 1,
    tag: "Lanzamiento",
    icon: "rocket_launch",
    titulo: "RoyalGames se lanza muy pronto",
    texto: "Estamos ultimando los últimos detalles para el gran lanzamiento de la plataforma. Prepará tu cuenta, la diversión está por comenzar.",
  },
  {
    id: 2,
    tag: "Juegos",
    icon: "casino",
    titulo: "Ya podés jugar Royal Joker, Minas y Royal Pachinka",
    texto: "Nuestros primeros tres juegos ya están activos y disponibles ahora mismo. Elegí tu favorito desde la sección Juegos y probá suerte.",
  },
  {
    id: 3,
    tag: "Promoción",
    icon: "redeem",
    titulo: "1 millón de fichas para los primeros 100 usuarios",
    texto: "Los primeros 100 jugadores en registrarse reciben 1.000.000 de fichas de regalo directo en su cuenta. ¡No te quedes afuera!",
  },
  {
    id: 4,
    tag: "Novedad",
    icon: "military_tech",
    titulo: "Nuevo sistema de rangos",
    texto: "De Bronce a Diamante: subí de rango a medida que cargás fichas y desbloqueá el prestigio de los jugadores de élite.",
  },
  {
    id: 5,
    tag: "Novedad",
    icon: "group",
    titulo: "Amigos y mensajes privados",
    texto: "Agregá amigos, visitá su perfil y mandales un mensaje privado directo desde la plataforma.",
  },
  {
    id: 6,
    tag: "Novedad",
    icon: "apps",
    titulo: "Catálogo de juegos por categoría",
    texto: "Explorá Bingo, Casino, Cartas, Slots y más, todo organizado por categoría, con la info de cada juego a un clic de distancia.",
  },
  {
    id: 7,
    tag: "Novedad",
    icon: "leaderboard",
    titulo: "Ranking de Top Ganadores",
    texto: "Mirá quién está ganando más fichas en los juegos y quién está conectado ahora mismo, directo desde el Inicio.",
  },
  {
    id: 8,
    tag: "Novedad",
    icon: "support_agent",
    titulo: "Centro de Ayuda con tickets de soporte",
    texto: "¿Tenés una consulta? Abrí un ticket desde la sección Ayuda y nuestro equipo te va a responder ahí mismo.",
  },
];

export default function News() {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(novedades.length / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const novedadesPagina = novedades.slice(startIdx, startIdx + itemsPerPage);

  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <main className="max-w-3xl mx-auto w-full pt-20 md:pt-24 px-4 pb-16 text-on-surface">
      <h1 className="font-headline-lg text-headline-lg text-white mb-2">Noticias</h1>
      <p className="text-on-surface-variant text-sm mb-8">Todo lo nuevo en RoyalGames.</p>

      <div className="space-y-4">
        {novedadesPagina.map((novedad) => (
          <div
            key={novedad.id}
            className="glass-card rounded-xl p-5 flex gap-4 border-l-4 border-primary"
          >
            <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[22px]">{novedad.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-white">{novedad.titulo}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${TAG_META[novedad.tag]}`}>
                  {novedad.tag}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">{novedad.texto}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-5 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-variant/30 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent"
        >
          Anterior
        </button>
        <span className="text-on-surface-variant text-xs">{currentPage} / {totalPages}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-5 py-2 rounded-lg gold-gradient text-black font-bold text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0"
        >
          Siguiente
        </button>
      </div>
    </main>
  );
}
