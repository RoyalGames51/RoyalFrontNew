import { useState } from "react";
import { Link } from "react-router-dom";

const FAQ_ITEMS = [
  {
    q: "¿RoyalGames es un casino con dinero real?",
    a: "No. Todo lo que se juega en RoyalGames son fichas virtuales, sin ningún valor monetario real. Podés comprar paquetes de fichas para jugar más, pero las fichas en sí no se pueden retirar ni canjear por dinero.",
  },
  {
    q: "¿Necesito una cuenta para jugar?",
    a: "Sí. Para entrar a cualquier juego (Minas, Royal Pachinka, Royal Joker, etc.) primero tenés que registrarte e iniciar sesión. Podés explorar el resto de la página sin cuenta, pero jugar requiere estar logueado.",
  },
  {
    q: "¿Cómo consigo fichas?",
    a: "Los primeros 100 usuarios reciben un bono de bienvenida automático. Después de eso, podés comprar paquetes de fichas desde \"Comprar Fichas\", o recibirlas como regalo de otro jugador desde su perfil.",
  },
  {
    q: "¿Qué es el sistema de rangos (Bronce, Plata, Oro, Platino, Diamante)?",
    a: "Tu rango sube según la cantidad total de fichas que compraste a lo largo del tiempo, no según cuánto ganás jugando. Se muestra en tu perfil junto con una barra de progreso hacia el siguiente rango.",
  },
  {
    q: "¿Qué son los rankings de \"Top Ganadores\"?",
    a: "Es un ranking real de los jugadores que más fichas ganaron jugando (no depositando). Hay uno general en el inicio y uno específico dentro de la página de cada juego.",
  },
  {
    q: "¿Cómo agrego amigos o le mando un mensaje a otro jugador?",
    a: "Entrá al perfil público de ese jugador (por ejemplo desde el ranking o buscando su nick) y vas a ver las opciones \"Añadir como Amigo\" y \"Enviar Mensaje\" en el panel de acciones.",
  },
  {
    q: "¿Puedo regalarle fichas a otro jugador?",
    a: "Sí, desde el perfil de ese jugador con la opción \"Regalar Fichas\". Se descuentan de tu propio saldo al instante y quedan registradas en el historial de movimientos de ambos.",
  },
  {
    q: "¿Puedo bloquear a otro usuario?",
    a: "Sí, desde su perfil con \"Bloquear Usuario\". Una vez bloqueado, no va a poder enviarte mensajes ni solicitudes de amistad.",
  },
  {
    q: "¿Dónde veo el historial de mis fichas?",
    a: "En \"Historial de Movimientos\" (accesible desde el menú y desde Comprar Fichas). Ahí aparecen tus compras, regalos enviados/recibidos y ajustes de un administrador. No incluye las fichas ganadas o perdidas jugando.",
  },
  {
    q: "Olvidé mi contraseña, ¿qué hago?",
    a: "En la pantalla de inicio de sesión tocá \"¿Olvidaste tu contraseña?\" e ingresá tu correo. Te vamos a mandar un enlace para restablecerla. Si querés cambiarla estando logueado, podés hacerlo desde Configuración de Perfil.",
  },
  {
    q: "¿Puedo cambiar mi email o mi nick?",
    a: "Sí, ambos se editan desde el ícono de configuración (⚙) en tu perfil.",
  },
  {
    q: "¿Qué juegos están disponibles ahora mismo?",
    a: "Minas, Royal Pachinka y Royal Joker ya están activos. El resto del catálogo (Royal Bingo, Royal Ruleta, RoyalChristmas, UNO, Video Bingo, Jogo do Bicho, Crazy Time Royal, Blackjack, VideoSlots) figura como \"Próximamente\".",
  },
  {
    q: "Tengo un problema que no está en esta lista, ¿qué hago?",
    a: "Escribinos desde la sección de Contacto, o mejor todavía, abrí un ticket en Mesa de Ayuda — no hace falta tener cuenta para hacerlo.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-transparent border-0 cursor-pointer"
      >
        <span className="font-bold text-white">{item.q}</span>
        <span className={`material-symbols-outlined text-primary flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>
      {isOpen && (
        <p className="px-6 pb-5 text-on-surface-variant text-sm leading-relaxed">{item.a}</p>
      )}
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main className="w-full max-w-3xl mx-auto p-6 md:p-8 my-16 pt-20 md:pt-24 text-on-surface">
      <h1 className="font-headline-lg text-headline-lg text-white mb-2">Preguntas Frecuentes</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Lo que más nos preguntan los jugadores. Si no encontrás tu respuesta acá, escribinos por{" "}
        <Link to="/contacto" className="text-primary hover:underline">Contacto</Link> o abrí un{" "}
        <Link to="/ayuda" className="text-primary hover:underline">ticket de ayuda</Link>.
      </p>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <FaqItem
            key={item.q}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </main>
  );
}
