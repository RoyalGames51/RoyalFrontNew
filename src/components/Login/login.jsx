import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/oauthContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserByNick } from "../../redux/actions";

// Flag a nivel de módulo: garantiza que initialize() corra solo una vez por carga de página
// (resiste React StrictMode que ejecuta efectos dos veces en desarrollo)
let gsiInitialized = false;

export default function Login({ className, children }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const auth = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const [show, setShow] = useState(false);

    const toggleLoginBox = () => setIsLoginOpen(!isLoginOpen);
    const handleClick = () => setShow(!show);

    const handleInputChange = (e) =>
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let email = input.email;

            if (!input.email.includes("@")) {
                const userDataNick = await dispatch(getUserByNick(input.email));
                const emailFromNick = userDataNick?.email;
                if (!emailFromNick) {
                    throw new Error("No se encontró el email asociado al nickname.");
                }
                await auth.login(emailFromNick, input.password);
            } else {
                await auth.login(email, input.password);
            }

            setIsLoginOpen(false); // Cierra el modal
            navigate('/');
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Inicio de sesión exitoso!",
                showConfirmButton: false,
                timer: 2500,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Contraseña incorrecta, intenta nuevamente",
            });
        }
    };

    const googleBtnRef = useRef(null);

    // 1) Inicializa GSI una sola vez al cargar la página
    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (gsiInitialized || !clientId || !window.google?.accounts?.id) return;

        gsiInitialized = true;
        window.google.accounts.id.initialize({
            client_id: clientId,
            use_fedcm_for_prompt: false,
            callback: async (response) => {
                try {
                    Swal.fire({ title: "Iniciando sesión con Google...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                    const result = await auth.loginWithGoogle(response.credential);
                    setIsLoginOpen(false);
                    navigate('/');
                    if (result?.firstChipsReceived) {
                        Swal.fire("¡Felicidades!", "¡Ganaste 1,000,000 de fichas por ser uno de los primeros 100 usuarios!", "success");
                    } else {
                        Swal.fire({ position: "center", icon: "success", title: "¡Inicio de sesión exitoso!", showConfirmButton: false, timer: 2500 });
                    }
                } catch (error) {
                    Swal.fire({ icon: "error", title: "Error con Google", text: error?.message || "No se pudo completar el inicio de sesión.", confirmButtonColor: "#C9A84C" });
                }
            },
        });
    }, []);

    // 2) Renderiza el botón oficial de Google cuando el modal abre
    //    (el div ref solo existe en el DOM cuando isLoginOpen = true)
    useEffect(() => {
        if (!isLoginOpen) return;
        
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!googleBtnRef.current || !window.google?.accounts?.id) {
            return;
        }

        window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: googleBtnRef.current.offsetWidth || 400,
            text: "continue_with",
        });
    }, [isLoginOpen]);


    const handleRegister = (e) => {
        e.preventDefault();
        setIsLoginOpen(false);
        window.dispatchEvent(new Event("open-register-modal"));
    };

    // Abre el modal desde otros componentes
    useEffect(() => {
        const handleOpen = () => setIsLoginOpen(true);
        window.addEventListener("open-login-modal", handleOpen);
        return () => window.removeEventListener("open-login-modal", handleOpen);
    }, []);

    // Efecto de paralaje del brillo de fondo
    useEffect(() => {
        if (!isLoginOpen) return;
        const handleMouseMove = (e) => {
            const spots = document.querySelectorAll('.bg-glow-spot');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            spots.forEach((spot, index) => {
                const moveX = (x - 0.5) * (index === 0 ? 50 : -50);
                const moveY = (y - 0.5) * (index === 0 ? 50 : -50);
                spot.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isLoginOpen]);

    return (
        <>
          {/* Botón para abrir el cuadro de inicio de sesión */}
          <button
            onClick={toggleLoginBox}
            type="button"
            className={className || "px-4 py-2 rounded-lg border border-primary text-primary font-label-lg text-label-lg hover:bg-primary/10 transition-all font-bold cursor-pointer"}
          >
            {children || "Iniciar sesión"}
          </button>
    
          {/* Fondo oscuro y cuadro de inicio de sesión */}
          {isLoginOpen && createPortal(
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
              onClick={toggleLoginBox} // Cierra al hacer clic en el fondo oscuro
            >
              <div
                className="glass-card rounded-xl p-8 shadow-2xl relative max-w-md w-full space-y-6 z-10 my-8 overflow-hidden select-none"
                onClick={(e) => e.stopPropagation()} // Evita que el clic cierre el cuadro
              >
                {/* Atmospheric Background elements */}
                <div className="bg-glow-spot -top-20 -left-20 pointer-events-none"></div>
                <div className="bg-glow-spot -bottom-20 -right-20 pointer-events-none"></div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={toggleLoginBox}
                  className="absolute top-4 right-4 text-outline hover:text-primary transition-colors cursor-pointer z-20"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>

                {/* Brand Identity */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-32 h-auto mb-6 transform hover:scale-105 transition-transform duration-300">
                    <img alt="Logo RGAMES" className="w-full h-auto object-contain" src={logo} />
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight text-center">
                    Bienvenido de nuevo
                  </h2>
                  <p className="mt-2 font-body-md text-body-md text-on-surface-variant text-center">
                    El lounge de juego de élite te espera.
                  </p>
                </div>

                {/* Login Form */}
                <div className="relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email / Nickname Field */}
                    <div className="space-y-2">
                      <label className="block font-label-lg text-label-lg text-on-surface-variant" htmlFor="email">
                        Correo Electrónico o Nombre de Usuario
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                        </div>
                        <input
                          autoComplete="username"
                          className="block w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md transition-all duration-200"
                          id="email"
                          name="email"
                          placeholder="Ingresa tu Nick o Email"
                          required
                          type="text"
                          value={input.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="block font-label-lg text-label-lg text-on-surface-variant" htmlFor="password">
                        Contraseña
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                        </div>
                        <input
                          autoComplete="current-password"
                          className="block w-full pl-10 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md transition-all duration-200"
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          required
                          type={show ? "text" : "password"}
                          value={input.password}
                          onChange={handleInputChange}
                        />
                        <button
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors cursor-pointer"
                          onClick={handleClick}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {show ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          className="h-4 w-4 text-primary focus:ring-primary border-outline-variant/30 rounded bg-surface-container-lowest cursor-pointer"
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                        />
                        <label className="ml-2 block font-label-md text-label-md text-on-surface-variant cursor-pointer" htmlFor="remember-me">
                          Recuerdame
                        </label>
                      </div>
                      <div className="text-sm">
                        <a
                          className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            Swal.fire({
                              title: "Recuperar Contraseña",
                              text: "Por favor, ponte en contacto con soporte técnico para restablecer tu contraseña.",
                              icon: "info",
                              confirmButtonColor: "#C9A84C",
                            });
                          }}
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        className="gold-gradient gold-glow gold-glow-hover w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg font-headline-sm text-headline-sm text-on-primary-fixed uppercase tracking-wider transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                        type="submit"
                      >
                        Entrar
                      </button>
                    </div>
                  </form>

                  {/* Social Login Divider */}
                  <div className="mt-8 relative">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-outline-variant/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#12121A] text-on-surface-variant font-label-md uppercase tracking-widest">
                        o
                      </span>
                    </div>
                  </div>

                  {/* Social Action — botón oficial de Google (renderButton) */}
                  <div className="mt-8">
                    <div
                      ref={googleBtnRef}
                      className="w-full flex justify-center"
                      style={{ colorScheme: "light" }}
                    />
                  </div>
                </div>

                {/* Footer Link */}
                <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant relative z-10">
                  ¿Nuevo por aquí?{" "}
                  <a
                    className="font-bold text-primary hover:text-primary-fixed transition-colors underline-offset-4 hover:underline"
                    href="#"
                    onClick={handleRegister}
                  >
                    Crear Cuenta
                  </a>
                </p>
              </div>
            </div>,
            document.body
          )}
        </>
    );
}