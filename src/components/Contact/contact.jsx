import { Link } from "react-router-dom";

export default function Contact() {
  const channels = [
    {
      icon: "mail",
      label: "Correo Electrónico",
      value: "royalgames2025@gmail.com",
      href: "mailto:royalgames2025@gmail.com",
    },
    {
      icon: "photo_camera",
      label: "Instagram",
      value: "@RoyalGames",
      href: "https://instagram.com",
    },
    {
      icon: "thumb_up",
      label: "Facebook",
      value: "RoyalGames",
      href: "https://facebook.com",
    },
  ];

  return (
    <main className="w-full max-w-3xl mx-auto p-6 md:p-8 my-16 pt-20 md:pt-24 text-on-surface">
      <h1 className="font-headline-lg text-headline-lg text-white mb-2">Contacto</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        ¿Preferís escribirnos directo? Elegí el canal que más te acomode.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-xl p-6 flex flex-col items-center text-center gap-3 hover:border-primary/40 transition-all border border-transparent"
          >
            <span className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
              <span className="material-symbols-outlined text-black text-2xl">{channel.icon}</span>
            </span>
            <div>
              <p className="text-white font-bold">{channel.label}</p>
              <p className="text-on-surface-variant text-sm">{channel.value}</p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-on-surface-variant text-xs mt-8 text-center">
        ¿Tenés un problema con tu cuenta o una consulta puntual? Es más rápido si abrís un{" "}
        <Link to="/ayuda" className="text-primary hover:underline">ticket de ayuda</Link>.
      </p>
    </main>
  );
}
