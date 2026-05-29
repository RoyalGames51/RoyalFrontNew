import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

// Import local assets for Vite bundling
import logoImg from "../../assets/logo.png";
import juegoLoteria from "../../assets/IMG_4119.png";
import juegoRuleta from "../../assets/ruleta.png";
import juegoBingo from "../../assets/bingoproxi.png";
import juegoMinas from "../../assets/minas.png";

// Generated Banners
import casinoBanner from "../../assets/casino_banner.png";
import sportsBanner from "../../assets/sports_banner.png";
import tournamentBanner from "../../assets/tournament_banner.png";

// Import auth triggers to open login/register modals
import Login from "../Login/login";
import RegistroForm from "../Register/register";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state);
  const particlesContainerRef = useRef(null);

  // Countdown timer state for the live tournament widget
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 55, seconds: 0 });

  // Ticker items for recent wins
  const tickerItems = [
    { user: "User_992", amount: "$1,240.00", game: "Sweet Bonanza" },
    { user: "VIP_King", amount: "$5,500.00", game: "Live Blackjack" },
    { user: "SlotMaster", amount: "$820.50", game: "Gates of Olympus" },
    { user: "Elena_G", amount: "$12,000.00", game: "Mega Moolah" },
    { user: "PlayerOne", amount: "$450.00", game: "Roulette" },
  ];

  // Featured games configuration
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

  // Unauthenticated particles effect
  useEffect(() => {
    if (currentUser?.id) return; // Only run on guest landing

    const container = particlesContainerRef.current;
    if (!container) return;
    container.innerHTML = "";

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
  }, [currentUser]);

  // Tournament countdown ticker
  useEffect(() => {
    if (!currentUser?.id) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                clearInterval(interval);
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Helper alerts and navigation functions
  const handlePlayGame = (path, title) => {
    if (path) {
      navigate(path);
    } else {
      Swal.fire({
        title: `${title}`,
        text: "¡Este juego estará disponible muy pronto! Nuestro equipo real está trabajando para traértelo.",
        icon: "info",
        confirmButtonColor: "#C9A84C",
        background: '#16130d',
        color: '#e9e1d7',
      });
    }
  };

  const handleClaimWelcomePackage = () => {
    Swal.fire({
      title: "Paquete de Bienvenida",
      text: "¡Tu paquete de bienvenida del 100% hasta $1,000 ya está activo en tu cuenta!",
      icon: "success",
      confirmButtonColor: "#C9A84C",
      background: '#16130d',
      color: '#e9e1d7',
    });
  };

  const handleClaimDailySpin = () => {
    Swal.fire({
      title: "Giro Diario VIP",
      text: "¡Has girado la ruleta VIP y ganaste 500 fichas extra! Se han sumado a tu balance.",
      icon: "success",
      confirmButtonColor: "#C9A84C",
      background: '#16130d',
      color: '#e9e1d7',
    });
  };

  const handleJoinTournament = () => {
    Swal.fire({
      title: "Masters Cup",
      text: "¡Te has unido al torneo Masters Cup con éxito! Comienza a jugar para clasificar en el Leaderboard.",
      icon: "success",
      confirmButtonColor: "#C9A84C",
      background: '#16130d',
      color: '#e9e1d7',
    });
  };

  const handleSoonAlert = (section) => {
    Swal.fire({
      title: section,
      text: "¡Esta promoción estará disponible muy pronto! Sigue atento a las novedades.",
      icon: "info",
      confirmButtonColor: "#C9A84C",
      background: '#16130d',
      color: '#e9e1d7',
    });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- RENDERING CONFIG ---

  // 1. Authenticated User Lobby Dashboard
  if (currentUser?.id) {
    const formattedChips = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(currentUser?.chips ?? 0);

    let vipLevel = "Bronce I";
    if (currentUser?.chips >= 1000000) {
      vipLevel = "VIP Platino I";
    } else if (currentUser?.chips >= 100000) {
      vipLevel = "Oro IV";
    } else if (currentUser?.chips >= 10000) {
      vipLevel = "Plata II";
    } else if (currentUser?.chips > 0) {
      vipLevel = "Bronce IV";
    }

    return (
      <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen select-none pb-24 md:pb-12">
        {/* Sticky Balance Bar (Below Navbar) */}
        <div className="sticky top-16 z-40 bg-surface-container-low border-b border-outline-variant/10 px-4 md:px-margin-desktop py-2 flex items-center justify-between">
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1">
            <div className="flex flex-col text-left">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Balance Real</span>
              <span className="text-on-surface font-bold text-label-lg font-label-lg">{formattedChips}</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Crédito de Bono</span>
              <span className="text-primary font-bold text-label-lg font-label-lg">$250.00</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Nivel VIP</span>
              <span className="text-secondary font-bold text-label-lg font-label-lg">{vipLevel}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/chips')}
            className="gold-gradient px-6 py-2 rounded-lg text-on-primary font-bold text-label-lg font-label-lg hover:scale-105 active:scale-95 transition-transform gold-glow cursor-pointer border-0"
          >
            Depositar
          </button>
        </div>

        {/* Dashboard Main Content */}
        <main className="pt-6 px-4 md:px-margin-desktop max-w-container-max mx-auto space-y-12 pb-16">
          {/* Promo Carousel Bento Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[400px]">
            {/* Main Slide */}
            <div 
              onClick={handleClaimWelcomePackage}
              className="lg:col-span-8 relative rounded-xl overflow-hidden border border-outline-variant/30 group cursor-pointer h-[320px] lg:h-full"
            >
              <img 
                alt="Banner Welcome" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={casinoBanner} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end text-left">
                <span className="bg-primary text-on-primary px-3 py-1 rounded text-label-md font-label-md w-max mb-3">PAQUETE DE BIENVENIDA</span>
                <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-2 leading-tight">100% Hasta $1,000</h2>
                <p className="text-on-surface-variant max-w-md font-body-md text-body-md mb-6 hidden sm:block">Únete al rango élite de jugadores de RGAMES hoy mismo. Comienza tu viaje con un gran impulso en tus tres primeros depósitos.</p>
                <button className="gold-gradient w-max px-8 py-3 rounded-lg text-on-primary font-bold hover:scale-105 transition-transform cursor-pointer border-0">Claim Now</button>
              </div>
            </div>

            {/* Secondary promo slides/widgets */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-[320px] lg:h-full">
              <div 
                onClick={() => handleSoonAlert('Recarga Semanal')}
                className="relative flex-1 rounded-xl overflow-hidden border border-outline-variant/30 group cursor-pointer"
              >
                <img 
                  alt="Weekly Reload Banner" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={sportsBanner} 
                />
                <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end text-left">
                  <h3 className="font-headline-sm text-headline-sm text-white">Recarga Semanal</h3>
                  <p className="text-on-surface-variant text-body-sm font-body-sm">Mejora tus fines de semana con un bono del 50%.</p>
                </div>
              </div>

              <div 
                onClick={() => handleSoonAlert('Premios Pragmatic')}
                className="relative flex-1 rounded-xl overflow-hidden border border-primary/40 group cursor-pointer gold-glow"
              >
                <img 
                  alt="Pragmatic Drops Banner" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={tournamentBanner} 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent p-6 flex flex-col justify-end text-left">
                  <h3 className="font-headline-sm text-headline-sm text-primary">Premios de Pragmatic</h3>
                  <p className="text-white text-body-sm font-body-sm">Ganancias diarias en todos tus favoritos.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Continue Playing Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                <h2 className="font-headline-sm text-headline-sm text-white">Seguir Jugando</h2>
              </div>
              <button 
                onClick={() => navigate('/juegos')}
                className="text-primary text-label-md font-label-md hover:underline bg-transparent border-0 cursor-pointer"
              >
                Ver Todos
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Game Item 1: Lotería Real */}
              <div 
                onClick={() => handlePlayGame('/loteria-instantanea', 'Lotería Real')}
                className="group relative rounded-lg overflow-hidden border border-outline-variant/20 aspect-[4/3] cursor-pointer bg-surface-container"
              >
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  src={juegoLoteria} 
                  alt="Lotería Real" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-left">
                  <p className="text-[12px] font-bold text-white truncate">Lotería Real</p>
                </div>
              </div>

              {/* Game Item 2: VIP Roulette */}
              <div 
                onClick={() => handlePlayGame('/ruleta', 'VIP Roulette')}
                className="group relative rounded-lg overflow-hidden border border-outline-variant/20 aspect-[4/3] cursor-pointer bg-surface-container"
              >
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  src={juegoRuleta} 
                  alt="VIP Roulette" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-left">
                  <p className="text-[12px] font-bold text-white truncate">VIP Roulette</p>
                </div>
              </div>

              {/* Game Item 3: Bingo */}
              <div 
                onClick={() => handlePlayGame('/bingo', 'Bingo')}
                className="group relative rounded-lg overflow-hidden border border-outline-variant/20 aspect-[4/3] cursor-pointer bg-surface-container"
              >
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  src={juegoBingo} 
                  alt="Bingo" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-left">
                  <p className="text-[12px] font-bold text-white truncate">Bingo</p>
                </div>
              </div>

              {/* Game Item 4: Minas */}
              <div 
                onClick={() => handlePlayGame('/play/minas', 'Minas')}
                className="group relative rounded-lg overflow-hidden border border-outline-variant/20 aspect-[4/3] cursor-pointer bg-surface-container"
              >
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  src={juegoMinas} 
                  alt="Minas" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-left">
                  <p className="text-[12px] font-bold text-white truncate">Minas</p>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Games & Active Tournament */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Popular Games List */}
            <section className="xl:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline-sm text-headline-sm flex items-center gap-2 text-white">
                  <span className="material-symbols-outlined text-primary">star</span> Juegos Populares
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate('/juegos')}
                    className="w-8 h-8 rounded bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button 
                    onClick={() => navigate('/juegos')}
                    className="w-8 h-8 rounded bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-surface-variant transition-colors text-primary cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Popular Card 1 */}
                <div className="group relative bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ" 
                      alt="Sweet Bonanza" 
                    />
                  </div>
                  <div className="p-3 text-left">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">PRAGMATIC</span>
                    <h4 className="font-bold text-label-lg font-label-lg truncate text-white">Sweet Bonanza</h4>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate('/juegos')}
                      className="gold-gradient w-3/4 py-2 rounded font-bold text-on-primary text-label-md cursor-pointer border-0"
                    >
                      PLAY
                    </button>
                    <button 
                      onClick={() => navigate('/juegos')}
                      className="border border-primary bg-transparent text-primary w-3/4 py-2 rounded font-bold text-label-md hover:bg-primary/10 cursor-pointer"
                    >
                      DEMO
                    </button>
                  </div>
                </div>

                {/* Popular Card 2 */}
                <div className="group relative bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ" 
                      alt="Poker Stars" 
                    />
                  </div>
                  <div className="p-3 text-left">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">EVOLUTION</span>
                    <h4 className="font-bold text-label-lg font-label-lg truncate text-white">Poker Stars</h4>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate('/juegos')}
                      className="gold-gradient w-3/4 py-2 rounded font-bold text-on-primary text-label-md cursor-pointer border-0"
                    >
                      PLAY
                    </button>
                    <button 
                      onClick={() => navigate('/juegos')}
                      className="border border-primary bg-transparent text-primary w-3/4 py-2 rounded font-bold text-label-md hover:bg-primary/10 cursor-pointer"
                    >
                      DEMO
                    </button>
                  </div>
                </div>

                {/* Popular Card 3 */}
                <div className="group relative bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ" 
                      alt="Wanted Dead or Alive" 
                    />
                  </div>
                  <div className="p-3 text-left">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">HACKSAW</span>
                    <h4 className="font-bold text-label-lg font-label-lg truncate text-white">Wanted Dead or Alive</h4>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate('/juegos')}
                      className="gold-gradient w-3/4 py-2 rounded font-bold text-on-primary text-label-md cursor-pointer border-0"
                    >
                      PLAY
                    </button>
                    <button 
                      onClick={() => navigate('/juegos')}
                      className="border border-primary bg-transparent text-primary w-3/4 py-2 rounded font-bold text-label-md hover:bg-primary/10 cursor-pointer"
                    >
                      DEMO
                    </button>
                  </div>
                </div>

                {/* Popular Card 4 */}
                <div className="group relative bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpCcNDDLhupT0iOwy1efwVKGf6ATUKCy6U7q50kyjk86DZ0ESSWDYB3IrG_VbQ2nLajCDmLvXOct59w89ERq7kJydta4x2rtj18hF3ffoEPNHFxRiAJHXOp4-joRLAss2GIpXRWXEpfCcn17eLUjcdKtMQDo4p-lNCzppHIIyPmM_WXToorkNt3NbXKLAfPkWDm4ln0gxkOhUv8fxWHOTdBFnPxsnTABAi2RPFBg9hCCwRzQGJ6YIBJ6Bvk8_pA9vPVUZpUJk60PQ" 
                      alt="Dice Roller" 
                    />
                  </div>
                  <div className="p-3 text-left">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">RG ORIGINALS</span>
                    <h4 className="font-bold text-label-lg font-label-lg truncate text-white">Dice Roller</h4>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate('/juegos')}
                      className="gold-gradient w-3/4 py-2 rounded font-bold text-on-primary text-label-md cursor-pointer border-0"
                    >
                      PLAY
                    </button>
                    <button 
                      onClick={() => navigate('/juegos')}
                      className="border border-primary bg-transparent text-primary w-3/4 py-2 rounded font-bold text-label-md hover:bg-primary/10 cursor-pointer"
                    >
                      DEMO
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Active Tournament Widget */}
            <aside className="xl:col-span-4 flex flex-col gap-6 text-left">
              <div className="bg-surface-container-high rounded-xl border border-primary/30 overflow-hidden flex flex-col gold-glow">
                <div className="gold-gradient p-4 flex justify-between items-center">
                  <h3 className="text-on-primary font-bold text-headline-sm font-headline-sm">Masters Cup</h3>
                  <span className="bg-black/20 text-on-primary px-2 py-1 rounded text-label-md font-label-md font-bold">LIVE</span>
                </div>
                <div className="p-6 space-y-6">
                  {/* Prize Pool */}
                  <div className="text-center">
                    <p className="text-on-surface-variant text-label-md font-label-md mb-1 uppercase tracking-widest font-bold">POZO TOTAL ACTUAL</p>
                    <p className="text-primary font-display-lg text-[40px] leading-none font-bold">$50,000.00</p>
                  </div>

                  {/* Countdown Ticker */}
                  <div className="flex justify-center gap-4">
                    <div className="bg-surface p-2 rounded border border-outline-variant/20 w-16 text-center">
                      <p className="text-primary font-bold text-xl">{String(timeLeft.days).padStart(2, '0')}</p>
                      <p className="text-on-surface-variant text-[10px] font-bold">DÍAS</p>
                    </div>
                    <div className="bg-surface p-2 rounded border border-outline-variant/20 w-16 text-center">
                      <p className="text-primary font-bold text-xl">{String(timeLeft.hours).padStart(2, '0')}</p>
                      <p className="text-on-surface-variant text-[10px] font-bold">HORAS</p>
                    </div>
                    <div className="bg-surface p-2 rounded border border-outline-variant/20 w-16 text-center">
                      <p className="text-primary font-bold text-xl">{String(timeLeft.minutes).padStart(2, '0')}</p>
                      <p className="text-on-surface-variant text-[10px] font-bold">MIN</p>
                    </div>
                    <div className="bg-surface p-2 rounded border border-outline-variant/20 w-16 text-center">
                      <p className="text-primary font-bold text-xl">{String(timeLeft.seconds).padStart(2, '0')}</p>
                      <p className="text-on-surface-variant text-[10px] font-bold">SEG</p>
                    </div>
                  </div>

                  {/* Leaderboard list */}
                  <div className="space-y-3">
                    <p className="text-on-surface-variant text-label-md font-label-md uppercase tracking-widest font-bold">TOP PLAYERS</p>
                    <div className="flex items-center justify-between p-3 rounded bg-surface border-l-4 border-primary">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">1</span>
                        <span className="font-bold text-white">LuckyWhale99</span>
                      </div>
                      <span className="text-primary font-bold">$12,400</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded bg-surface/50">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-on-surface-variant">2</span>
                        <span className="font-bold text-white">VegasKing_01</span>
                      </div>
                      <span className="text-on-surface-variant font-bold">$9,250</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded bg-surface/50">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-on-surface-variant">3</span>
                        <span className="font-bold text-white">HighRoller_X</span>
                      </div>
                      <span className="text-on-surface-variant font-bold">$7,800</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleJoinTournament}
                    className="w-full border border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary/10 transition-colors bg-transparent cursor-pointer"
                  >
                    Join Tournament
                  </button>
                </div>
              </div>

              {/* Side Promo Daily Spin */}
              <div 
                onClick={handleClaimDailySpin}
                className="bg-surface-container rounded-xl p-6 border border-outline-variant/20 flex items-center gap-4 relative overflow-hidden group cursor-pointer text-left"
              >
                <div className="relative z-10 flex-1">
                  <h4 className="font-bold text-headline-sm text-headline-sm text-white">VIP Daily Spin</h4>
                  <p className="text-on-surface-variant text-body-sm font-body-sm">Tu regalo diario está listo para reclamar.</p>
                </div>
                <span className="material-symbols-outlined text-primary text-5xl relative z-10 group-hover:scale-110 transition-transform">redeem</span>
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <span className="material-symbols-outlined text-9xl">redeem</span>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* BottomNavBar (Mobile Only) */}
        <nav className="flex justify-around items-center h-16 px-4 md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container border-t border-outline-variant/30 shadow-lg">
          <button 
            onClick={() => navigate('/')}
            className="text-primary flex flex-col items-center gap-1 transition-transform active:scale-90 duration-200 bg-transparent border-0 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="font-label-md text-label-md">Lobby</span>
          </button>
          <button 
            onClick={() => navigate('/juegos')}
            className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 transition-transform active:scale-90 duration-200 bg-transparent border-0 cursor-pointer"
          >
            <span className="material-symbols-outlined">casino</span>
            <span className="font-label-md text-label-md">Juegos</span>
          </button>
          <button 
            onClick={() => navigate('/juegos')}
            className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 transition-transform active:scale-90 duration-200 bg-transparent border-0 cursor-pointer"
          >
            <span className="material-symbols-outlined">search</span>
            <span className="font-label-md text-label-md">Buscar</span>
          </button>
          <button 
            onClick={() => navigate('/perfil')}
            className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 transition-transform active:scale-90 duration-200 bg-transparent border-0 cursor-pointer"
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span className="font-label-md text-label-md">Perfil</span>
          </button>
        </nav>
      </div>
    );
  }

  // 2. Unauthenticated Guest Landing Page
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
            <RegistroForm className="px-10 py-4 rounded-xl gold-gradient text-on-primary font-bold text-headline-sm hover:scale-105 transition-all shadow-xl gold-glow text-center cursor-pointer border-0">
              Crear Cuenta
            </RegistroForm>
            <Login className="px-10 py-4 rounded-xl border-2 border-primary text-primary font-bold text-headline-sm hover:bg-primary/10 transition-all text-center cursor-pointer bg-transparent">
              Iniciar sesión
            </Login>
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
                <span className="text-on-surface-variant font-bold">won</span>
                <span className="text-primary font-bold">{item.amount}</span>
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
              <span className="text-primary font-label-lg text-label-lg uppercase tracking-widest mb-2 block font-bold">
                Oferta de Bienvenida
              </span>
              <h2 className="font-display-lg-mobile md:font-headline-lg text-white mb-2">
                100% hasta <span className="text-primary">$500</span> + 50 Giros Gratis
              </h2>
              <p className="text-on-surface-variant font-body-md">
                Comienza tu viaje real con una ventaja premium de fichas.
              </p>
            </div>
            <RegistroForm className="z-10 px-8 py-4 bg-white text-background font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-colors duration-300 shadow-lg text-center cursor-pointer border-0">
              Reclamar Bono
            </RegistroForm>
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
          <div className="text-left">
            <h3 className="font-headline-lg text-headline-lg text-white mb-2">Juegos Destacados</h3>
            <p className="text-on-surface-variant">Títulos de primer nivel elegidos para los entusiastas de límites altos.</p>
          </div>
          <button
            onClick={() => navigate("/juegos")}
            className="text-primary font-label-lg text-label-lg flex items-center gap-2 hover:underline bg-transparent border-0 cursor-pointer"
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
                  className="w-full py-3 gold-gradient text-[#0A0A0F] font-bold rounded-lg text-label-lg uppercase hover:opacity-90 transition-opacity cursor-pointer border-0"
                >
                  Jugar Ahora
                </button>
                <button
                  onClick={() => handlePlayGame(game.path, game.title)}
                  className="w-full py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg text-label-lg uppercase border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                >
                  Demo
                </button>
              </div>
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-left">
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
              <p className="text-on-surface-variant text-body-sm font-body-sm">
                Operando bajo los estándares globales más estrictos para garantizar un juego transparente.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl">lock</span>
              </div>
              <h4 className="font-headline-sm text-white">Conexión SSL Segura</h4>
              <p className="text-on-surface-variant text-body-sm font-body-sm">
                Tus datos y transacciones están totalmente encriptados con seguridad de grado militar.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl">support_agent</span>
              </div>
              <h4 className="font-headline-sm text-white">Soporte 24/7 de Élite</h4>
              <p className="text-on-surface-variant text-body-sm font-body-sm">
                Un conserje real dedicado y disponible las 24 horas del día para ayudarte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BottomNavBar (Mobile Only for Guest) */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container dark:bg-surface-container border-t border-outline-variant/30 shadow-lg flex justify-around items-center h-16 px-4 md:hidden">
        <button
          onClick={() => scrollToSection("particles-container")}
          className="text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200 bg-transparent border-0 cursor-pointer"
        >
          <span className="material-symbols-outlined">home</span>
          <span>Lobby</span>
        </button>

        <button
          onClick={() => navigate("/juegos")}
          className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200 bg-transparent border-0 cursor-pointer"
        >
          <span className="material-symbols-outlined">casino</span>
          <span>Juegos</span>
        </button>

        <button
          onClick={() => navigate("/juegos")}
          className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200 bg-transparent border-0 cursor-pointer"
        >
          <span className="material-symbols-outlined">search</span>
          <span>Buscar</span>
        </button>

        <Login className="text-on-surface-variant hover:text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200 bg-transparent border-0 p-0 font-normal cursor-pointer">
          <span className="material-symbols-outlined">login</span>
          <span>Acceder</span>
        </Login>
      </nav>
    </div>
  );
}
