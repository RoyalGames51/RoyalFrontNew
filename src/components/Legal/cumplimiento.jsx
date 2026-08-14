import LegalPage from "./LegalPage";

const sections = [
  {
    title: "1. Solo fichas ficticias, sin dinero real",
    content: "Todo lo que se juega en RoyalGames son fichas virtuales sin valor monetario. No se pueden retirar, canjear ni convertir a dinero real ni a ningún otro bien. Comprar fichas es una forma de seguir jugando, no una inversión.",
  },
  {
    title: "2. Edad recomendada",
    content: "RoyalGames está pensado como entretenimiento y recomendamos su uso a mayores de 18 años. Si sos menor, te pedimos jugar con la supervisión de un adulto responsable.",
  },
  {
    title: "3. Juego limpio",
    content: "Los resultados de los juegos son aleatorios e iguales para todos los jugadores. No se otorgan ventajas ocultas a nadie. Si detectamos el uso de bots, exploits o cualquier forma de trampa, la cuenta puede ser suspendida.",
  },
  {
    title: "4. Una cuenta por persona",
    content: "Cada jugador debe usar una sola cuenta. Crear cuentas múltiples para abusar de bonos de bienvenida, del sistema de regalo de fichas entre usuarios o de los rankings de premios está prohibido y puede derivar en la suspensión de todas las cuentas involucradas.",
  },
  {
    title: "5. Convivencia entre jugadores",
    content: "Mensajes, solicitudes de amistad y perfiles públicos están para disfrutar la comunidad, no para acosar a otros jugadores. Podés bloquear a cualquier usuario desde su perfil, y reportar comportamiento abusivo desde Mesa de Ayuda.",
  },
  {
    title: "6. Consecuencias por incumplimiento",
    content: "Según la gravedad, un incumplimiento de estas normas puede resultar en la advertencia, inactivación temporal o baneo definitivo de la cuenta, a criterio del equipo de RoyalGames.",
  },
  {
    title: "7. Cómo reportar un problema",
    content: "Si viste algo que rompe estas normas, o tenés dudas sobre si algo está permitido, escribinos por Contacto o abrí un ticket en Mesa de Ayuda.",
  },
];

export default function Cumplimiento() {
  return (
    <LegalPage
      title="Cumplimiento"
      updatedAt="14/08/2026"
      intro="Estas son las reglas básicas para que jugar en RoyalGames sea justo y agradable para todos. Se suman a nuestros Términos y Condiciones y a la Política de Privacidad."
      sections={sections}
    />
  );
}
