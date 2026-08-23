import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import * as THREE from 'three';

import banner1 from "../../assets/banner1.png";
import sportsBanner from "../../assets/b1.jpg";
import bannercelu from "../../assets/bannercelu.png";
import chipsImage from "../../assets/chips.png";

import Login from "../Login/login";
import RegistroForm from "../Register/register";
import { ShaderAnimation } from "../ui/shader-animation";
import { formatChips, swalThemeConfig } from "../../utils/formatters";
import GamesCatalog from "../GamesCatalog/gamesCatalog";
import EditableText from "../ui/EditableText";
import { GAMES_CATALOG, CATEGORY_META, getGameByPlayPath, getGameBySlug } from "../../data/gamesCatalog";
import { generateFakeOnlinePlayers } from "../../data/fakeOnlinePlayers";
import API_URL from "../../api/rutaApi";

const SIMULATED_ONLINE_MIN = 18;
const SIMULATED_ONLINE_MAX = 34;
const ACTIVE_GAMES = GAMES_CATALOG.filter((g) => g.status === "active");

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useSelector((state) => state);
  // "Entrar como Invitado": shows the same dashboard a logged-in user sees, but with no
  // account behind it — the nav still offers Iniciar Sesión / Registrarse.
  const isGuestPreview = !currentUser?.id && searchParams.get("vista") === "invitado";
  const particlesContainerRef = useRef(null);
  const shaderCanvasRef = useRef(null);
  const threeDChipRef = useRef(null);
  const chipSpinSpeedRef = useRef(0.015);

  const [topWinners, setTopWinners] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentWins, setRecentWins] = useState([]);
  // Target headcount for the simulated players blended into "Jugadores Conectados"
  // below (see fakeOnlinePlayers.js). Drifts slowly so the widget feels alive.
  const [simulatedOnlineTarget, setSimulatedOnlineTarget] = useState(
    () => SIMULATED_ONLINE_MIN + Math.floor(Math.random() * (SIMULATED_ONLINE_MAX - SIMULATED_ONLINE_MIN + 1))
  );

  // Real recent wins (chips actually won in games) for the guest landing page ticker.
  useEffect(() => {
    if (currentUser?.id) return;
    axios.get(`${API_URL}/leaderboard/recent-wins?limit=12`).then(({ data }) => setRecentWins(data)).catch(() => {});
  }, [currentUser?.id]);

  // WebGL shader background effect
  useEffect(() => {
    if (currentUser?.id || isGuestPreview) return;

    const canvas = shaderCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    const vertexShaderSource = `
        attribute vec2 position;
        varying vec2 v_texCoord;
        void main() {
            v_texCoord = position * 0.5 + 0.5;
            v_texCoord.y = 1.0 - v_texCoord.y;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        varying vec2 v_texCoord;

        void main() {
            vec2 uv = v_texCoord;
            vec2 mouse = u_mouse / u_resolution;
            
            float t = u_time * 0.2;
            float noise = sin(uv.x * 10.0 + t) * cos(uv.y * 10.0 - t);
            noise += sin(uv.x * 20.0 - t * 1.5) * cos(uv.y * 15.0 + t * 0.8) * 0.5;
            
            float dist = distance(uv, mouse);
            float pulse = smoothstep(0.4, 0.0, dist) * 0.2;
            
            vec3 color1 = vec3(0.04, 0.03, 0.02); // Deeper black-gold for noir feel
            vec3 color2 = vec3(0.79, 0.66, 0.30); // Royal Gold (#c9a84c)
            vec3 color3 = vec3(1.0, 0.95, 0.8);   // Highlight gold
            
            float mixFactor = smoothstep(-1.0, 1.0, noise + pulse);
            vec3 finalColor = mix(color1, color2, mixFactor * 0.4); // Subtle mix
            
            float highlight = pow(max(0.0, noise + pulse), 8.0);
            finalColor += color3 * highlight * 0.3;
            
            float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5));
            finalColor *= vignette;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;
    function render(time) {
      if (!canvas || !gl) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseX, canvas.height - mouseY);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    };
  }, [currentUser]);

  // Three.js 3D Chip Animation
  useEffect(() => {
    if (currentUser?.id || isGuestPreview) return;

    const container = threeDChipRef.current;
    if (!container) return;

    const width = container.clientWidth || 192;
    const height = container.clientHeight || 192;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xc9a84c, 2, 40);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);

    const group = new THREE.Group();
    const chipTexture = new THREE.TextureLoader().load(chipsImage);
    const geometry = new THREE.CircleGeometry(1, 64);
    const material = new THREE.MeshStandardMaterial({
      map: chipTexture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const chip = new THREE.Mesh(geometry, material);
    group.add(chip);

    scene.add(group);
    camera.position.z = 5;

    let animFrameId;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };

    const handleContainerMouseMove = (event) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const radius = Math.min(rect.width, rect.height) * 0.45;
      const dx = x - rect.width / 2;
      const dy = y - rect.height / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);

      chipSpinSpeedRef.current = distance <= radius ? 0.4 : 0.1;
    };

    const handleContainerMouseLeave = () => {
      chipSpinSpeedRef.current = 0.1;
    };

    const canvasElement = renderer.domElement;
    canvasElement.style.pointerEvents = 'auto';
    canvasElement.addEventListener('mousemove', handleContainerMouseMove);
    canvasElement.addEventListener('mouseleave', handleContainerMouseLeave);

    window.addEventListener('mousemove', handleMouseMove);

    function animate3D() {
      animFrameId = requestAnimationFrame(animate3D);
      group.rotation.y += chipSpinSpeedRef.current + mouseX * 0.02;
      group.rotation.x += (mouseY * 0.4 - group.rotation.x) * 0.06;
      group.position.y = Math.sin(Date.now() * 0.0018) * 0.18;
      renderer.render(scene, camera);
    }
    animate3D();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('mousemove', handleContainerMouseMove);
        renderer.domElement.removeEventListener('mouseleave', handleContainerMouseLeave);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      chipTexture.dispose();
      renderer.dispose();
    };
  }, [currentUser]);

  // Scroll reveal animation observer
  useEffect(() => {
    if (currentUser?.id || isGuestPreview) return;

    const observerOptions = {
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => revealObserver.observe(el));

    return () => {
      elements.forEach((el) => revealObserver.unobserve(el));
    };
  }, [currentUser]);

  // Parallax effect for cards
  useEffect(() => {
    if (currentUser?.id || isGuestPreview) return;

    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll(".glass-card-hover");
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      cards.forEach((card, index) => {
        const factor = (index + 1) * 10;
        card.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px) translateY(-8px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [currentUser]);

  // Real top-winners leaderboard (chips actually won in games) + online players list
  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchWidgets = () => {
      axios.get(`${API_URL}/leaderboard/top-winners?limit=5`).then(({ data }) => setTopWinners(data)).catch(() => {});
      axios.get(`${API_URL}/users/online`).then(({ data }) => setOnlineUsers(data)).catch(() => {});
      // Small random walk so the simulated headcount below feels like people are
      // actually coming and going instead of a static number.
      setSimulatedOnlineTarget((prev) => {
        const drifted = prev + Math.floor(Math.random() * 7) - 3;
        return Math.min(SIMULATED_ONLINE_MAX, Math.max(SIMULATED_ONLINE_MIN, drifted));
      });
    };
    fetchWidgets();
    const interval = setInterval(fetchWidgets, 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  // Real online users blended with simulated ones so the widget hits simulatedOnlineTarget.
  // Memoized so the simulated names/games only reshuffle when the target or real list
  // actually changes, not on every unrelated re-render.
  const otherOnlineUsers = useMemo(() => {
    const realOnlineUsers = onlineUsers.filter((u) => u.id !== currentUser?.id);
    const simulatedPlayers = generateFakeOnlinePlayers(
      Math.max(0, simulatedOnlineTarget - realOnlineUsers.length),
      ACTIVE_GAMES
    );
    return [...realOnlineUsers, ...simulatedPlayers];
  }, [onlineUsers, simulatedOnlineTarget, currentUser?.id]);

  // Helper alerts and navigation functions
  const handlePlayGame = (path, title) => {
    if (path) {
      navigate(path);
    } else {
      Swal.fire({
        title: `${title}`,
        text: "¡Este juego estará disponible muy pronto! Nuestro equipo real está trabajando para traértelo.",
        icon: "info",
        ...swalThemeConfig,
      });
    }
  };

  const handleClaimWelcomePackage = () => {
    Swal.fire({
      title: "Paquete de Bienvenida",
      text: "¡Tu paquete de bienvenida del 100% hasta $1,000 ya está activo en tu cuenta!",
      icon: "success",
      ...swalThemeConfig,
    });
  };

  const handleClaimDailySpin = () => {
    Swal.fire({
      title: "Giro Diario VIP",
      text: "¡Has girado la ruleta VIP y ganaste 500 fichas extra! Se han sumado a tu balance.",
      icon: "success",
      ...swalThemeConfig,
    });
  };

  const handleSoonAlert = (section) => {
    Swal.fire({
      title: section,
      text: "¡Esta promoción estará disponible muy pronto! Sigue atento a las novedades.",
      icon: "info",
      ...swalThemeConfig,
    });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- RENDERING CONFIG ---

  // 1. Authenticated User Lobby Dashboard (also shown, with no account data, for the
  // "Entrar como Invitado" preview)
  if (currentUser?.id || isGuestPreview) {
    const formattedChipsValue = formatChips(currentUser?.chips);

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
        {/* <div className="sticky top-16 z-40 bg-surface-container-low border-b border-outline-variant/10 px-4 md:px-margin-desktop py-2 flex items-center justify-between">
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1">
            <div className="flex flex-col text-left">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Balance Real</span>
              <span className="text-on-surface font-bold text-label-lg font-label-lg">{formattedChipsValue}</span>
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
        </div> */}

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
                alt="Banner de Bienvenida"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700"
                src={banner1}
              />

            </div>

            {/* Secondary promo slides/widgets */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-[320px] lg:h-full">
              <div 
                onClick={() => handleSoonAlert('Recarga Semanal')}
                className="relative flex-1 rounded-xl overflow-hidden border border-outline-variant/30 group cursor-pointer"
              >
                <img 
                  alt="Banner de Recarga Semanal"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={sportsBanner} 
                />
                {/* <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end text-left">
                  <h3 className="font-headline-sm text-headline-sm text-white">Recarga Semanal</h3>
                  <p className="text-on-surface-variant text-body-sm font-body-sm">Mejora tus fines de semana con un bono del 50%.</p>
                </div> */}
              </div>

              <div 
                onClick={() => handleSoonAlert('Premios Pragmatic')}
                className="relative flex-1 rounded-xl overflow-hidden border border-primary/40 group cursor-pointer gold-glow"
              >
                <img 
                  alt="Banner de Premios Pragmatic"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={bannercelu} 
                />
                {/* <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent p-6 flex flex-col justify-end text-left">
                  <h3 className="font-headline-sm text-headline-sm text-primary">Premios de Pragmatic</h3>
                  <p className="text-white text-body-sm font-body-sm">Ganancias diarias en todos tus favoritos.</p>
                </div> */}
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
                {GAMES_CATALOG.filter((game) => game.status === "active").map((game) => (
                  <div
                    key={game.slug}
                    className="group relative bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/50 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={game.image}
                        alt={game.name}
                      />
                    </div>
                    <div className="p-3 text-left">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${CATEGORY_META[game.category].className}`}>
                        {CATEGORY_META[game.category].label}
                      </span>
                      <h4 className="font-bold text-label-lg font-label-lg truncate text-white">{game.name}</h4>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handlePlayGame(game.playPath, game.name)}
                        className="gold-gradient w-3/4 py-2 rounded font-bold text-on-primary text-label-md cursor-pointer border-0"
                      >
                        JUGAR
                      </button>
                      <button
                        onClick={() => navigate(`/juegos/${game.slug}`)}
                        className="border border-primary bg-transparent text-primary w-3/4 py-2 rounded font-bold text-label-md hover:bg-primary/10 cursor-pointer"
                      >
                        INFO
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Games Catalog by Category, filling the leftover height next to the taller sidebar */}
              <div className="mt-10 pt-8 border-t border-outline-variant/10">
                <GamesCatalog compact />
              </div>
            </section>

            {/* Top Winners + Online Players */}
            <aside className="xl:col-span-4 flex flex-col gap-6 text-left">
              {/* Top Winners Leaderboard */}
              <div className="bg-surface-container-high rounded-xl border border-primary/30 overflow-hidden flex flex-col gold-glow">
                <div className="gold-gradient p-4 flex justify-between items-center">
                  <h3 className="text-on-primary font-bold text-headline-sm font-headline-sm">Top Ganadores</h3>
                  <span className="bg-black/20 text-on-primary px-2 py-1 rounded text-label-md font-label-md font-bold">EN VIVO</span>
                </div>
                <div className="p-6 space-y-3">
                  {topWinners.length === 0 ? (
                    <p className="text-on-surface-variant text-sm text-center py-4">
                      Todavía no hay premios registrados. ¡Sé el primero en ganar!
                    </p>
                  ) : (
                    topWinners.map((player, index) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded ${index === 0 ? "bg-surface border-l-4 border-primary" : "bg-surface/50"}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`font-bold flex-shrink-0 ${index === 0 ? "text-primary" : "text-on-surface-variant"}`}>
                            {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => navigate(`/perfil/${player.nick}`)}
                            className="font-bold text-white truncate hover:text-primary hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                          >
                            {player.nick}
                          </button>
                        </div>
                        <span className={`font-bold flex-shrink-0 ${index === 0 ? "text-primary" : "text-on-surface-variant"}`}>
                          {new Intl.NumberFormat('es-ES').format(player.totalWon)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Online Players */}
              <div className="bg-surface-container-high rounded-xl border border-outline-variant/20 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-outline-variant/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"></span>
                  <h3 className="font-bold text-headline-sm font-headline-sm text-white">
                    {otherOnlineUsers.length} {otherOnlineUsers.length === 1 ? "Jugador Conectado" : "Jugadores Conectados"}
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/10">
                  {otherOnlineUsers.length === 0 ? (
                    <p className="text-on-surface-variant text-sm text-center py-6 px-4">
                      No hay otros jugadores conectados ahora mismo.
                    </p>
                  ) : (
                    otherOnlineUsers.map((player) => {
                      const activeGame = getGameByPlayPath(player.currentActivity);
                      // Simulated players (see fakeOnlinePlayers.js) have no real profile behind
                      // them, so only real players (real DB id) link out to /perfil/:nick.
                      const isRealPlayer = !player.id.startsWith("sim-");
                      return (
                        <div key={player.id} className="flex items-center justify-between gap-3 p-3">
                          <button
                            type="button"
                            disabled={!isRealPlayer}
                            onClick={() => isRealPlayer && navigate(`/perfil/${player.nick}`)}
                            className={`flex items-center gap-3 min-w-0 bg-transparent border-0 p-0 text-left ${isRealPlayer ? "cursor-pointer group" : "cursor-default"}`}
                          >
                            <div className="w-9 h-9 rounded-full royal-gold-gradient flex items-center justify-center text-surface-container-lowest font-bold text-xs flex-shrink-0">
                              {(player.nick || "RG").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className={`font-bold text-white text-sm truncate ${isRealPlayer ? "group-hover:text-primary group-hover:underline" : ""}`}>
                                {player.nick}
                              </p>
                              <p className="text-[11px] text-on-surface-variant truncate">
                                {activeGame ? <span className="text-primary">Jugando a {activeGame.name}</span> : "En el sitio"}
                              </p>
                            </div>
                          </button>
                          {activeGame && (
                            <button
                              onClick={() => handlePlayGame(activeGame.playPath, activeGame.name)}
                              className="px-3 py-1.5 rounded gold-gradient text-black text-[11px] font-bold uppercase flex-shrink-0 cursor-pointer border-0"
                            >
                              Jugar
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Side Promo Daily Spin */}
              <div
                onClick={handleClaimDailySpin}
                className="bg-surface-container rounded-xl p-6 border border-outline-variant/20 flex items-center gap-4 relative overflow-hidden group cursor-pointer text-left"
              >
                <div className="relative z-10 flex-1">
                  <h4 className="font-bold text-headline-sm text-white">Giro Diario VIP</h4>
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
            <span className="font-label-md text-label-md">Inicio</span>
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
            onClick={() => navigate(currentUser?.nick ? `/perfil/${currentUser.nick}` : '/perfil')}
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
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden hero-section">
        <ShaderAnimation />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-[1] pointer-events-none"></div>
        <div className="relative z-10 max-w-6xl w-full px-6 flex flex-col items-center justify-center">
          <div className="text-center reveal" style={{ transitionDelay: "0.2s" }}>
            <h1 className="relative inline-block text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-[1.3] text-white overflow-visible">
              <span className="gold-shimmer italic inline-block pb-4 md:pb-6 overflow-visible" translate="no">RoyalGames</span>
              <span className="absolute top-1/2 -translate-y-1/2 -right-32 md:-right-44 w-32 h-32 md:w-40 md:h-40 pointer-events-none">
                <div ref={threeDChipRef} id="three-d-chip" className="absolute inset-0 w-full h-full pointer-events-auto" />
              </span>
            </h1>
            <EditableText
              contentKey="home.heroTagline"
              className="text-on-surface-variant text-lg md:text-xl font-light tracking-tight mb-6"
            >
              La mejor pagina de juegos
            </EditableText>
            <div className="flex flex-col items-center gap-6 relative">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <RegistroForm className="px-14 py-5 rounded-full gold-gradient text-black font-bold text-sm uppercase tracking-[0.2em] shadow-2xl btn-hover-glow transition-all cursor-pointer border-0">
                  Crear Cuenta
                </RegistroForm>

                <button
                  onClick={() => window.dispatchEvent(new Event('open-login-modal'))}
                  className="px-14 py-5 rounded-full border-2 border-primary/50 text-primary font-bold text-sm uppercase tracking-[0.2em] hover:bg-primary/5 transition-all cursor-pointer bg-transparent"
                >
                  Iniciar Sesión
                </button>
              </div>

              <button
                onClick={() => navigate('/?vista=invitado')}
                className="px-14 py-3 rounded-full text-on-surface-variant font-bold text-sm uppercase tracking-[0.2em] hover:text-primary transition-all cursor-pointer bg-transparent border-0"
              >
                Entrar como Invitado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Winners Ticker */}
      {recentWins.length > 0 && (
        <div className="bg-surface border-y border-white/5 py-5 overflow-hidden reveal">
          <div className="animate-ticker">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex gap-16 items-center px-8">
                {recentWins.map((win, i) => {
                  const gameName = getGameBySlug(win.game)?.name || "un juego";
                  return (
                    <div key={`${dup}-${win.id || i}`} className="flex items-center gap-4 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-on-surface-variant font-medium">El jugador <span className="text-primary font-bold">{win.nick}</span> ganó</span>
                      <span className="text-white font-bold bg-white/5 px-3 py-1 rounded border border-white/10">
                        {new Intl.NumberFormat('es-ES').format(win.amount)} fichas
                      </span>
                      <span className="text-on-surface-variant/80 text-xs">en {gameName}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Games Catalog by Category */}
      <GamesCatalog />

      {/* Por qué jugar con nosotros */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="text-center reveal" style={{ transitionDelay: "0.1s" }}>
            <span className="material-symbols-outlined text-primary text-5xl mb-6">casino</span>
            <EditableText contentKey="home.why1.title" as="h4" className="text-white font-bold text-xl mb-4 tracking-tight">
              Juego Limpio y Parejo
            </EditableText>
            <EditableText contentKey="home.why1.text" className="text-on-surface-variant font-light text-sm leading-relaxed">
              Los resultados son siempre al azar, iguales para todos. Acá se juega por diversión, sin trampas de la casa.
            </EditableText>
          </div>

          <div className="text-center reveal" style={{ transitionDelay: "0.2s" }}>
            <span className="material-symbols-outlined text-primary text-5xl mb-6">shield_lock</span>
            <EditableText contentKey="home.why2.title" as="h4" className="text-white font-bold text-xl mb-4 tracking-tight">
              Tu Cuenta, Segura
            </EditableText>
            <EditableText contentKey="home.why2.text" className="text-on-surface-variant font-light text-sm leading-relaxed">
              Cuidamos tus datos y tu progreso con buenas prácticas de seguridad, para que solo te preocupes por jugar.
            </EditableText>
          </div>

          <div className="text-center reveal" style={{ transitionDelay: "0.3s" }}>
            <span className="material-symbols-outlined text-primary text-5xl mb-6">support_agent</span>
            <EditableText contentKey="home.why3.title" as="h4" className="text-white font-bold text-xl mb-4 tracking-tight">
              Te Acompañamos Siempre
            </EditableText>
            <EditableText contentKey="home.why3.text" className="text-on-surface-variant font-light text-sm leading-relaxed">
              ¿Dudas o algún problema? Nuestro equipo real está a un mensaje de distancia, mandanos tu consulta y responderemos enseguida.
            </EditableText>
          </div>
        </div>
      </section>

      {/* BottomNavBar (Mobile Only for Guest) */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container dark:bg-surface-container border-t border-outline-variant/30 shadow-lg flex justify-around items-center h-16 px-4 md:hidden">
        <button
          onClick={() => scrollToSection("hero-shader-canvas")}
          className="text-primary flex flex-col items-center gap-1 text-[11px] active:scale-90 transition-transform duration-200 bg-transparent border-0 cursor-pointer"
        >
          <span className="material-symbols-outlined">home</span>
          <span>Inicio</span>
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
