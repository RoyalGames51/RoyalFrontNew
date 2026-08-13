import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as THREE from 'three';

import banner1 from "../../assets/banner1.png";
import rj from "../../assets/rj.png";
import rpachinka from "../../assets/rpachinka2.png";
import juegoMinas from "../../assets/minas2.png";
import sportsBanner from "../../assets/b1.jpg";
import bannercelu from "../../assets/bannercelu.png";
import chipsImage from "../../assets/chips.png";

import Login from "../Login/login";
import RegistroForm from "../Register/register";
import { ShaderAnimation } from "../ui/shader-animation";
import { formatChips, swalThemeConfig } from "../../utils/formatters";
import GamesCatalog from "../GamesCatalog/gamesCatalog";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state);
  const particlesContainerRef = useRef(null);
  const shaderCanvasRef = useRef(null);
  const threeDChipRef = useRef(null);
  const chipSpinSpeedRef = useRef(0.015);

  // Countdown timer state for the live tournament widget
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 55, seconds: 0 });

  // Ticker items for recent wins
  const tickerItems = [
    { user: "User_992", amount: "$1,240.00", game: "Sweet Bonanza" },
    { user: "VIP_King", amount: "$5,500.00", game: "Blackjack en Vivo" },
    { user: "SlotMaster", amount: "$820.50", game: "Gates of Olympus" },
    { user: "Elena_G", amount: "$12,000.00", game: "Mega Moolah" },
    { user: "PlayerOne", amount: "$450.00", game: "Ruleta" },
  ];

  // Featured games configuration matching the new design layout
  const featuredGames = [
    {
      id: "empire-roulette",
      title: "Empire Roulette",
      category: "Premium",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_XM-5gOSoZ-Nx1kEgMkizy64GDZGL-n51pbx110tNwTaaALceWNPAKH2DmbTkFmop_Av2OK236264M85GHmnhvnoJNqWGmZUGWJ0xRwql7JtvwFWeCJ7l6UEWanE7jXShjftw2_TfvOyCUfiMtBum84AibwaKyA9ezimQhliCUy-CJyxpfKOp0itrJYE6AW3sEcW-5l_4KaZHUPf8Qi5oOqnLQpe5p4dnzkV-SvdCmcbO22XaIshl",
      path: null,
      actionText: "Unirse a la Mesa",
      subActionText: "Espectar",
    },
    {
      id: "midnight-poker",
      title: "Midnight Poker",
      category: "Exclusivo",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5rNtRzJR2KsWje6yXo4bqDyBhlZ9A1Q_ts_KdpHxSGIFhxUqX9UawI2pg6yEi7BNugsGHCQ5l0eLDPPOmH3S0a6gtrEthJH9yxoYIQIqBrivGdM0n9BiY_2RtYUFOjWbcBrEUlFh_4KOIGO_UtWkAWo3jgjP7XR2mnu0KWvt-jf3fYtu8Jnf3_duMyJ9ID5r8wJQn70TBPFTt32lJQkkQB07UTe85Nk5xbQp68f7F4jJLjO73wysp",
      path: null,
      actionText: "Unirse a la Mesa",
      subActionText: "Espectar",
    },
    {
      id: "royal-baccarat",
      title: "Royal Baccarat",
      category: "Clásico",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB39KZuadJcJPpam6nUfIj5qRO-xDXqrO-ePAYczj3bvNGfH1ucEKvfr1mcz8rxjwdIhvKayjq4P5HIJp86uMT1Lsa2wn40XeAjR47spehrACItvJc_EAr2la7TrB40BxL4NI96Vk23iF9xRvnwZnKs8vs9LzLLCpSsbeaiAj2ez5CtA204-bZ76-jUFozh_iemlQcjvEJ7GiOcJ_He-mWKYxSlyBCg-pvQs1lNGfc_EM8MUHAF_3z",
      path: null,
      actionText: "Unirse a la Mesa",
      subActionText: "Espectar",
    },
    {
      id: "grand-slots",
      title: "Grand Slots",
      category: "Destacado",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8WoEOn9qEXeg8cSyJceGPMIkCSO3wS4WCtbabeF7cG7cgOUHQwI8sguXKp-RdH82oLK1Dqq9n5PgNwpUopMsxTulKNlbxk991MkyhPjc7deP80d82_HSr6NVaqsaTDax8ADKHYz9minCkrRRId-zpnvzyXBp7W-XfJ0Du5SZvSydCyebjSvhfIUGB82rs2pSXUv7XBGi3POMCx1TGVcHGed54eMBVOFTU_1vENfIJLfhmi73sTlG-",
      path: "/play/royalpachinka",
      actionText: "Girar Ahora",
      subActionText: "Juego Gratis",
    },
    {
      id: "neon-blackjack",
      title: "Neon Blackjack",
      category: "En Vivo",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNA4WUrDQGa5zpBBkrA4GuHzRMiyQ8QtktL8ImimFsM_X6GwK36SahiAVMNAmggQ-Xf9E6YPR7EcDUn6dFl4cgV_6TMkDn6_YOlu0NIPzexb_-C0-m5681ui-S7UM40qhXhovjlCtEfk9zsPFMtc5CmtPO1xT4hRu7tqIDsfnojJN63k3qyIT9djmqpMGls6tBxFFG8yPzsF3i3dB9VCOcYTVLpMayhnPIpDhBdoNuze5DFgnMlGjx",
      path: "/play/royaljoker",
      actionText: "Unirse a la Mesa",
      subActionText: "Espectar",
    },
    {
      id: "gold-dice",
      title: "Gold Dice",
      category: "Nuevo",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wuspkm5e8dzW_u5shrePV2VGwWiJ0rEdM9ZFxMi6ZXwRVkUIylGoUNKZqIFZdJH7wMqj__d9OiKb3pgzI4s-qP2T04A9GRTP0tV7xW3jtzBKoRkGqlO8IWkF-h2MnlzO0JR_GV_qq6pOiaRUlEWobz6CafYSC_FOBINc2M0w6kYmT5ucqsQUSClrrkYJzmo47tUW4cs4ENBpp4FunLui8RckkebgLKfsQU9WuElRlrT0XcxzA-qI",
      path: "/play/minas",
      actionText: "Lanzar Dados",
      subActionText: "Juego Gratis",
    },
  ];

  // WebGL shader background effect
  useEffect(() => {
    if (currentUser?.id) return;

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
    if (currentUser?.id) return;

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
    if (currentUser?.id) return;

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
    if (currentUser?.id) return;

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

  const handleJoinTournament = () => {
    Swal.fire({
      title: "Masters Cup",
      text: "¡Te has unido al torneo Masters Cup con éxito! Comienza a jugar para clasificar en el Leaderboard.",
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

  // 1. Authenticated User Lobby Dashboard
  if (currentUser?.id) {
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

          {/* Continue Playing Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">star</span>
                <h2 className="font-headline-sm text-headline-sm text-white">Ultimos juegos</h2>
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
                onClick={() => handlePlayGame('/play/royalpachinka', 'Royal Pachinka')}
                className="group relative rounded-lg overflow-hidden border border-outline-variant/20 aspect-[4/3] cursor-pointer bg-surface-container"
              >
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  src={rpachinka} 
                  alt="Royal Pachinka" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-left">
                  <p className="text-[12px] font-bold text-white truncate">Royal Pachinka</p>
                </div>
              </div>

              {/* Game Item 2: VIP Roulette */}
              {/* <div 
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
              </div> */}

              {/* Game Item 3: Bingo */}
              <div
                onClick={() => handlePlayGame('/play/royaljoker', 'Royal Joker')}
                className="group relative rounded-lg overflow-hidden border border-outline-variant/20 aspect-[4/3] cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-[#121212] to-[#1b1b1b]">
                  <img
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    src={rj}
                    alt="Royal Joker"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-left">
                  <p className="text-[12px] font-bold text-white truncate">Royal Joker</p>
                </div>
              </div>

              {/* Game Item 4: Minas */}
              <div
                onClick={() => handlePlayGame('/play/minas', 'Minas')}
                className="group relative rounded-lg overflow-hidden border border-outline-variant/20 aspect-[4/3] cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-[#0f1115] to-[#17181b]">
                  <img
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    src={juegoMinas}
                    alt="Minas"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
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
                      JUGAR
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
                      JUGAR
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
                      JUGAR
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
                      JUGAR
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
                  <span className="bg-black/20 text-on-primary px-2 py-1 rounded text-label-md font-label-md font-bold">EN VIVO</span>
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
                    <p className="text-on-surface-variant text-label-md font-label-md uppercase tracking-widest font-bold">MEJORES JUGADORES</p>
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
                    Unirse al Torneo
                  </button>
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

          {/* Games Catalog by Category */}
          <GamesCatalog />
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
            <h1 className="relative inline-block text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-normal text-white">
              <span className="gold-shimmer italic inline-block pb-2" translate="no">RoyalGames</span>
              <span className="absolute top-1/2 -translate-y-1/2 -right-32 md:-right-44 w-32 h-32 md:w-40 md:h-40 pointer-events-none">
                <div ref={threeDChipRef} id="three-d-chip" className="absolute inset-0 w-full h-full pointer-events-auto" />
              </span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl font-light tracking-tight mb-6">
              La mejor pagina de juegos
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative">
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
          </div>
        </div>
      </section>

      {/* Live Winners Ticker */}
      <div className="bg-surface border-y border-white/5 py-5 overflow-hidden reveal">
        <div className="animate-ticker">
          <div className="flex gap-16 items-center px-8">
            {tickerItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-on-surface-variant font-medium">El jugador <span className="text-primary font-bold">{item.user}</span> ganó</span>
                <span className="text-white font-bold bg-white/5 px-3 py-1 rounded border border-white/10">{item.amount}</span>
                <span className="text-on-surface-variant/80 text-xs">en {item.game}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-16 items-center px-8">
            {tickerItems.map((item, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-4 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-on-surface-variant font-medium">El jugador <span className="text-primary font-bold">{item.user}</span> ganó</span>
                <span className="text-white font-bold bg-white/5 px-3 py-1 rounded border border-white/10">{item.amount}</span>
                <span className="text-on-surface-variant/80 text-xs">en {item.game}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <section className="py-32 px-6 max-w-container-max mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            onClick={() => scrollToSection("featured-games")}
            className="glass-card glass-card-hover p-10 flex flex-col items-center text-center reveal cursor-pointer"
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="material-symbols-outlined text-black text-3xl">casino</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Tragamonedas Clásicas</h3>
            <p className="text-on-surface-variant text-sm font-light">Vive la emoción atemporal de la elegancia mecánica.</p>
          </div>

          <div
            onClick={() => scrollToSection("featured-games")}
            className="glass-card glass-card-hover p-10 flex flex-col items-center text-center reveal cursor-pointer"
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="material-symbols-outlined text-black text-3xl">person_play</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Casino en Vivo</h3>
            <p className="text-on-surface-variant text-sm font-light">Acción en tiempo real con nuestros crupieres de clase mundial.</p>
          </div>

          <div
            onClick={() => scrollToSection("featured-games")}
            className="glass-card glass-card-hover p-10 flex flex-col items-center text-center reveal cursor-pointer"
            style={{ transitionDelay: "0.3s" }}
          >
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="material-symbols-outlined text-black text-3xl">table_restaurant</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Mesas Altas</h3>
            <p className="text-on-surface-variant text-sm font-light">Apuestas exclusivas para el entusiasta exigente del póker.</p>
          </div>

          <div
            onClick={() => scrollToSection("featured-games")}
            className="glass-card glass-card-hover p-10 flex flex-col items-center text-center reveal cursor-pointer"
            style={{ transitionDelay: "0.4s" }}
          >
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="material-symbols-outlined text-black text-3xl">sports_soccer</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Royal Sports</h3>
            <p className="text-on-surface-variant text-sm font-light">Cobertura de apuestas deportivas de élite en eventos globales.</p>
          </div>
        </div>
      </section>

      {/* Games Catalog by Category */}
      <GamesCatalog />

      {/* Featured Games */}
      <section id="featured-games" className="py-32 bg-surface/30 px-6">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-16 reveal">
            <div className="text-left">
              <h2 className="text-4xl font-extrabold text-white tracking-tighter mb-2 uppercase">Favoritos Seleccionados</h2>
              <p className="text-on-surface-variant font-light">Una selección de títulos premium elegidos para nuestra comunidad de élite.</p>
            </div>
            <button
              onClick={() => navigate("/juegos")}
              className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:translate-x-2 transition-transform bg-transparent border-0 cursor-pointer"
            >
              Ver Todos los Juegos <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 reveal" style={{ transitionDelay: "0.2s" }}>
            {featuredGames.map((game) => (
              <div
                key={game.id}
                className="group relative aspect-[3/4] overflow-hidden rounded shadow-2xl border border-white/5 hover:border-primary/50 transition-all bg-surface-container-high"
              >
                <img
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  src={game.src}
                  alt={game.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full translate-y-4 group-hover:translate-y-0 transition-transform text-left">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {game.category}
                  </p>
                  <h4 className="text-white font-bold text-lg">{game.title}</h4>
                </div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 gap-3">
                  <button
                    onClick={() => handlePlayGame(game.path, game.title)}
                    className="w-full py-3 gold-gradient text-black font-black text-[10px] uppercase tracking-widest rounded-sm cursor-pointer border-0"
                  >
                    {game.actionText}
                  </button>
                  <button
                    onClick={() => handlePlayGame(game.path, game.title)}
                    className="w-full py-3 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest rounded-sm bg-transparent cursor-pointer hover:bg-white/5"
                  >
                    {game.subActionText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Licensing */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="text-center reveal" style={{ transitionDelay: "0.1s" }}>
            <span className="material-symbols-outlined text-primary text-5xl mb-6">verified_user</span>
            <h4 className="text-white font-bold text-xl mb-4 tracking-tight">Certificados Globalmente</h4>
            <p className="text-on-surface-variant font-light text-sm leading-relaxed">
              Cumplimos con los estándares internacionales más estrictos de juego justo y excelencia operativa.
            </p>
          </div>

          <div className="text-center reveal" style={{ transitionDelay: "0.2s" }}>
            <span className="material-symbols-outlined text-primary text-5xl mb-6">security</span>
            <h4 className="text-white font-bold text-xl mb-4 tracking-tight">Seguridad Fortificada</h4>
            <p className="text-on-surface-variant font-light text-sm leading-relaxed">
              Tus activos y datos están protegidos con encriptación de última generación y monitoreo continuo.
            </p>
          </div>

          <div className="text-center reveal" style={{ transitionDelay: "0.3s" }}>
            <span className="material-symbols-outlined text-primary text-5xl mb-6">workspace_premium</span>
            <h4 className="text-white font-bold text-xl mb-4 tracking-tight">Soporte de Élite</h4>
            <p className="text-on-surface-variant font-light text-sm leading-relaxed">
              Un equipo de conserjería personal disponible 24/7 para atender cada solicitud con absoluta discreción.
            </p>
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
