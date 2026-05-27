import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

// Import local assets for Vite bundling
import logoImg from "../../assets/logo.png";
import juegoLoteria from "../../assets/IMG_4119.png";
import juegoRuleta from "../../assets/ruleta.png";
import juegoBingo from "../../assets/bingoproxi.png";
import juegoMinas from "../../assets/minas.png";

// Import auth triggers to open login/register modals
import Login from "../Login/login";
import RegistroForm from "../Register/register";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state);
  const particlesContainerRef = useRef(null);

  // Particles animation and mouse interaction parallax
  useEffect(() => {
    const container = particlesContainerRef.current;
    if (!container) return;
    container.innerHTML = ""; // Clear existing particles

    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      const size = Math.random() * 40 + 10;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 10 + 10;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.top = `${top}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;

      const isOutline = Math.random() > 0.5;
      if (isOutline) {
        particle.style.border = `1px solid rgba(201, 168, 76, 0.3)`;
      } else {
        particle.style.background = `rgba(201, 168, 76, 0.1)`;
      }

      if (Math.random() > 0.5) {
        particle.style.borderRadius = "50%";
      } else {
        particle.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      }

      container.appendChild(particle);
    }

    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const particles = container.querySelectorAll(".particle");
      particles.forEach((p) => {
        const speed = parseFloat(p.style.width) / 100;
        const shiftX = (x - 0.5) * 50 * speed;
        const shiftY = (y - 0.5) * 50 * speed;
        p.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handlePlayGame = (path, title) => {
    if (path) {
      navigate(path);
    } else {
      Swal.fire({
        title: `${title}`,
        text: "¡Este juego estará disponible muy pronto! Nuestro equipo real está trabajando para traértelo.",
        icon: "info",
        confirmButtonColor: "#C9A84C",
      });
    }
  };

  const tickerItems = [
    { user: "User_992", amount: "$1,240.00", game: "Sweet Bonanza" },
    { user: "VIP_King", amount: "$5,500.00", game: "Live Blackjack" },
    { user: "SlotMaster", amount: "$820.50", game: "Gates of Olympus" },
    { user: "Elena_G", amount: "$12,000.00", game: "Mega Moolah" },
    { user: "PlayerOne", amount: "$450.00", game: "Roulette" },
  ];

  const featuredGames = [
    {
      id: "slot-royal",
      title: "Lotería Real",
      category: "Premium Slot",
      src: juegoLoteria,
      path: "/loteria-instantanea",
    },
    {
      id: "poker-elite",
      title: "Elite Poker",
      category: "Live Table",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ",
      path: null,
    },
    {
      id: "ruleta-vip",
      title: "VIP Roulette",
      category: "Table Games",
      src: juegoRuleta,
      path: "/ruleta",
    },
    {
      id: "bingo-royal",
      title: "Bingo",
      category: "Slots",
      src: juegoBingo,
      path: "/bingo",
    },
    {
      id: "minas-royal",
      title: "Minas",
      category: "Live Dealer",
      src: juegoMinas,
      path: "/play/minas",
    },
    {
      id: "sports-stakes",
      title: "Champion Stakes",
      category: "Sports",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ",
      path: null,
    },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-12">
        {/* Background Particles */}
        <div ref={particlesContainerRef} className="absolute inset-0 z-0" id="particles-container">
          {/* Injected programmatically by React hook */}
        </div>

        <div className="relative z-10 max-w-3xl flex flex-col items-center mt-8">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-700">
            <img
              alt="RGAMES Logo"
              className="w-48 md:w-64 h-auto drop-shadow-[0_0_30px_rgba(201,168,76,0.35)] object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHr-YQO4wKiXJtqdrnY1tLOA8UPOXYPqIbRXCK-1-vuteuSZikDVC8FBXHR-pAFuG5y3VxEBQYu7LqhUkcSfzOLn6xj3uqxHMpYnPB2TmffszrRqjue0hTy6QUwn2KWUiTRSeAdiK0QmMWKVTL2JTWmyb8yALFHLyEwpCDhYLLxX6bLA_M5RbZyzfBpiFp_0zsNFwNGXU7gYVIsYGOzdupLCs3tA_0265ckLs3QoNmrIg4DiaZajsomBZpi7IHPae0NSdNge9Csf8"
            />
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-4 text-white tracking-tight">
            Play. Win. <span className="text-primary italic">Royal.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
            Experimenta la cima del entretenimiento de altas apuestas en nuestro exclusivo salón digital.
          </p>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto z-20">
            {currentUser?.id ? (
              <button
                onClick={() => scrollToSection("featured-games")}
                className="px-10 py-4 rounded-xl gold-gradient text-on-primary font-bold text-headline-sm hover:scale-105 transition-all shadow-xl gold-glow"
              >
                Jugar Ahora
              </button>
            ) : (
              <>
                <RegistroForm className="px-10 py-4 rounded-xl gold-gradient text-on-primary font-bold text-headline-sm hover:scale-105 transition-all shadow-xl gold-glow text-center">
                  Crear Cuenta
                </RegistroForm>
                <Login className="px-10 py-4 rounded-xl border-2 border-primary text-primary font-bold text-headline-sm hover:bg-primary/10 transition-all text-center">
                  Iniciar sesión
                </Login>
              </>
            )}
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </section>

      {/* Winners Ticker */}
      <div className="bg-surface-container-low py-3 border-y border-outline-variant/10 overflow-hidden relative">
        <div className="animate-ticker">
          {/* Repeat items twice for a seamless loop */}
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex gap-12 items-center px-6">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-primary font-bold">{item.user}</span>
                <span className="text-on-surface-variant">won</span>
                <span className="text-primary">{item.amount}</span>
                <span className="text-outline text-xs">on {item.game}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome Bonus Banner */}
      <section className="px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto">
        <div className="gold-gradient rounded-full p-[1px] shadow-2xl">
          <div className="bg-surface-container rounded-full px-8 md:px-16 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
            <div className="text-center md:text-left z-10">
              <span className="text-primary font-label-lg text-label-lg uppercase tracking-widest mb-2 block">
                Oferta de Bienvenida
              </span>
              <h2 className="font-display-lg-mobile md:font-headline-lg text-white mb-2">
                100% hasta <span className="text-primary">$500</span> + 50 Giros Gratis
              </h2>
              <p className="text-on-surface-variant font-body-md">
                Comienza tu viaje real con una ventaja premium de fichas.
              </p>
            </div>
            {currentUser?.id ? (
              <button
                onClick={() =>
                  Swal.fire({
                    title: "¡Bono Reclamado!",
                    text: "Tu bono de bienvenida ya ha sido acreditado en tu balance de fichas.",
                    icon: "success",
                    confirmButtonColor: "#C9A84C",
                  })
                }
                className="z-10 px-8 py-4 bg-white text-background font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-colors duration-300 shadow-lg"
              >
                Reclamar Bono
              </button>
            ) : (
              <RegistroForm className="z-10 px-8 py-4 bg-white text-background font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-colors duration-300 shadow-lg text-center">
                Reclamar Bono
              </RegistroForm>
            )}
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <section className="px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div
            onClick={() => scrollToSection("featured-games")}
            className="bg-surface-container p-6 rounded-xl border border-outline-variant/20 hover:border-primary transition-all group text-center cursor-pointer"
          >
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-background text-3xl">casino</span>
            </div>
            <span className="font-headline-sm text-white">Slots</span>
          </div>

          <div
            onClick={() => scrollToSection("featured-games")}
            className="bg-surface-container p-6 rounded-xl border border-outline-variant/20 hover:border-primary transition-all group text-center cursor-pointer"
          >
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-background text-3xl">person_play</span>
            </div>
            <span className="font-headline-sm text-white">Casino en Vivo</span>
          </div>

          <div
            onClick={() => scrollToSection("featured-games")}
            className="bg-surface-container p-6 rounded-xl border border-outline-variant/20 hover:border-primary transition-all group text-center cursor-pointer"
          >
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-background text-3xl">table_restaurant</span>
            </div>
            <span className="font-headline-sm text-white">Juegos de Mesa</span>
          </div>

          <div
            onClick={() => scrollToSection("featured-games")}
            className="bg-surface-container p-6 rounded-xl border border-outline-variant/20 hover:border-primary transition-all group text-center cursor-pointer"
          >
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-background text-3xl">sports_soccer</span>
            </div>
            <span className="font-headline-sm text-white">Deportes</span>
          </div>
        </div>
      </section>

      {/* Featured Games Grid */}
      <section id="featured-games" className="px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-white mb-2">Juegos Destacados</h3>
            <p className="text-on-surface-variant">Títulos de primer nivel elegidos para los entusiastas de límites altos.</p>
          </div>
          <button
            onClick={() => navigate("/juegos")}
            className="text-primary font-label-lg text-label-lg flex items-center gap-2 hover:underline"
          >
            Ver Todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="relative group aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/20 flex flex-col justify-between"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={game.src}
                alt={game.title}
              />
              <div className="absolute inset-0 game-card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                <button
                  onClick={() => handlePlayGame(game.path, game.title)}
                  className="w-full py-3 gold-gradient text-background font-bold rounded-lg text-label-lg uppercase hover:opacity-90 transition-opacity"
                >
                  Jugar Ahora
                </button>
                <button
                  onClick={() => handlePlayGame(game.path, game.title)}
                  className="w-full py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg text-label-lg uppercase border border-white/20 hover:bg-white/20 transition-all"
                >
                  Demo
                </button>
              </div>
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <p className="text-white font-bold text-label-lg">{game.title}</p>
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{game.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Row */}
      <section className="bg-surface-container-lowest py-16">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl">verified_user</span>
              </div>
              <h4 className="font-headline-sm text-white">Licencia Oficial & Regulado</h4>
              <p className="text-on-surface-variant body-sm">
                Operando bajo los estándares globales más estrictos para garantizar un juego transparente.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl">lock</span>
              </div>
              <h4 className="font-headline-sm text-white">Conexión SSL Segura</h4>
              <p className="text-on-surface-variant body-sm">
                Tus datos y transacciones están totalmente encriptados con seguridad de grado militar.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl">support_agent</span>
              </div>
              <h4 className="font-headline-sm text-white">Soporte 24/7 de Élite</h4>
              <p className="text-on-surface-variant body-sm">
                Un conserje real dedicado y disponible las 24 horas del día para ayudarte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container dark:bg-surface-container border-t border-outline-variant/30 shadow-lg flex justify-around items-center h-16 px-4 md:hidden">
        <button
          onClick={() => scrollToSection("particles-container")}
          className="text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200"
        >
          <span className="material-symbols-outlined">home</span>
          <span>Lobby</span>
        </button>

        <button
          onClick={() => navigate("/juegos")}
          className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200"
        >
          <span className="material-symbols-outlined">casino</span>
          <span>Juegos</span>
        </button>

        <button
          onClick={() => navigate("/juegos")}
          className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200"
        >
          <span className="material-symbols-outlined">search</span>
          <span>Buscar</span>
        </button>

        {currentUser?.id ? (
          <button
            onClick={() => navigate("/perfil")}
            className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200"
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span>Perfil</span>
          </button>
        ) : (
          <Login className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200 bg-transparent border-0 p-0 font-normal">
            <span className="material-symbols-outlined">login</span>
            <span>Acceder</span>
          </Login>
        )}
      </nav>
    </div>
  );
}
