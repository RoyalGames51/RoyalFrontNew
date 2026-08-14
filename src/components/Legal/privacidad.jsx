import LegalPage from "./LegalPage";

const sections = [
  {
    title: "1. Qué datos recopilamos",
    content: "Al crear tu cuenta guardamos solo tu nick, correo electrónico. Si vos elegís completarlos, también guardamos tu edad, país, avatar y descripción de perfil. Si te registrás con Google, recibimos tu nombre, correo y foto de perfil desde tu cuenta de Google.",
  },
  {
    title: "2. Qué datos generamos mientras jugás",
    content: "Registramos tu saldo de fichas, tus depósitos, los movimientos de fichas (compras, regalos, ajustes de un administrador) y las fichas ganadas en cada juego, para poder mostrarte tu historial y los rankings. También guardamos la última vez que estuviste activo y qué juego estás jugando, para las funciones de \"jugadores conectados\".",
  },
  {
    title: "3. Para qué usamos tus datos",
    content: "Usamos tu información únicamente para hacer funcionar la plataforma: identificarte al iniciar sesión, calcular tu rango, mostrar tu perfil a otros jugadores, procesar tus compras de fichas y responder tus consultas de soporte. No usamos tus datos para publicidad de terceros.",
  },
  {
    title: "4. Con quién compartimos información",
    content: "No vendemos ni compartimos tus datos personales con terceros, salvo con los procesadores de pago (como PayPal o Mercado Pago) estrictamente necesarios para completar una compra de fichas, y solo la información que ellos requieren para procesar el pago.",
  },
  {
    title: "5. Qué ven otros usuarios",
    content: "Tu nick, avatar, rango y descripción de perfil son públicos para otros jugadores. Tu correo electrónico y tu contraseña nunca se muestran a nadie, incluido el equipo de soporte.",
  },
  {
    title: "6. Seguridad de tu cuenta",
    content: "Tu contraseña se encripta al momento de registrarte. El acceso a la plataforma se maneja con tokens de sesión (JWT) que expiran, y podés cambiar tu contraseña o correo en cualquier momento desde Configuración de Perfil.",
  },
  {
    title: "7. Tus derechos sobre tu información",
    content: "Podés editar tus datos de perfil (nick, edad, país, descripción, avatar, correo y contraseña) cuando quieras desde Configuración. Si querés que eliminemos tu cuenta y tus datos, escribinos por Contacto o abrí un ticket en Mesa de Ayuda.",
  },
  {
    title: "8. Consultas sobre privacidad",
    content: "Si tenés dudas sobre cómo manejamos tu información, escribinos a royalgames2025@gmail.com.",
  },
];

export default function Privacidad() {
  return (
    <LegalPage
      title="Política de Privacidad"
      updatedAt="14/08/2026"
      intro="En RoyalGames jugamos con fichas ficticias, pero nos tomamos en serio el cuidado de tus datos reales. Acá te contamos, en criollo, qué información guardamos y para qué la usamos."
      sections={sections}
    />
  );
}
