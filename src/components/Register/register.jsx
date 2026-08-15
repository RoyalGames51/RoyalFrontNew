import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/oauthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { promo1millon, getUserByEmail } from "../../redux/actions";
import { validateNick, validateEmail, validatePassword } from "./validate";
import logo from "../../assets/logo.png";

const RegistroForm = ({ className, children }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const auth = useAuth();

    const [errors, setErrors] = useState({
        nick: "",
        email: "",
        password: "",
        confirmPassword: "",
        sexo: "",
    });

    const [checking, setChecking] = useState({ nick: false, email: false });
    const nickCheckSeq = useRef(0);
    const emailCheckSeq = useRef(0);

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [input, setInput] = useState({
        nick: "",
        email: "",
        password: "",
        confirmPassword: "",
        sexo: "",
        referredByCode: "",
    });

    useEffect(() => {
        dispatch(promo1millon());
    }, [dispatch]);

    useEffect(() => {
        const handleOpen = () => setIsRegisterOpen(true);
        window.addEventListener("open-register-modal", handleOpen);
        return () => window.removeEventListener("open-register-modal", handleOpen);
    }, []);

    // Prefills the referral code from a shared link like royalgames.lat/?ref=A1B2C3D4
    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            setInput((prev) => ({ ...prev, referredByCode: ref.toUpperCase() }));
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        const property = e.target.name;
        const value = e.target.value;
        setInput({
            ...input,
            [property]: value,
        });
        // El error de nick/email queda obsoleto apenas se vuelve a escribir;
        // se recalcula al salir del campo (onBlur).
        if (property === "nick" || property === "email") {
            setErrors((prev) => ({ ...prev, [property]: "" }));
        }
    };

    // Verifica formato + disponibilidad del nick contra el backend al salir del campo.
    const runNickCheck = async (nickValue) => {
        if (!nickValue) return;
        const seq = ++nickCheckSeq.current;
        setChecking((prev) => ({ ...prev, nick: true }));
        const nickError = await validateNick(nickValue);
        if (seq !== nickCheckSeq.current) return; // el usuario ya cambió el valor, descartar
        setErrors((prev) => ({ ...prev, nick: nickError || "" }));
        setChecking((prev) => ({ ...prev, nick: false }));
    };

    // Verifica formato + coincidencia con el nick + disponibilidad del email.
    const runEmailCheck = async (emailValue, nickValue) => {
        if (!emailValue) return;
        const seq = ++emailCheckSeq.current;
        setChecking((prev) => ({ ...prev, email: true }));
        const emailError = await validateEmail(emailValue, nickValue);
        if (seq !== emailCheckSeq.current) return;
        setErrors((prev) => ({ ...prev, email: emailError || "" }));
        setChecking((prev) => ({ ...prev, email: false }));
    };

    const handleNickBlur = () => {
        runNickCheck(input.nick);
        // El nick recién validado puede cambiar si el email coincide con él.
        if (input.email) runEmailCheck(input.email, input.nick);
    };

    const handleEmailBlur = () => {
        runEmailCheck(input.email, input.nick);
    };

    const getPasswordStrength = (val) => {
        if (!val) return { text: "Débil", color: "text-red-500", bars: [false, false, false, false], barColor: "bg-surface-container-highest" };
        let score = 0;
        if (val.length > 5) score++;
        if (val.length > 8) score++;
        if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (score <= 1) {
            return { text: "Débil", color: "text-red-500", bars: [true, false, false, false], barColor: "bg-red-500" };
        } else if (score === 2) {
            return { text: "Media", color: "text-amber-500", bars: [true, true, false, false], barColor: "bg-amber-500" };
        } else if (score === 3) {
            return { text: "Fuerte", color: "text-primary", bars: [true, true, true, false], barColor: "bg-primary" };
        } else {
            return { text: "Élite", color: "text-[#F5D980]", bars: [true, true, true, true], barColor: "bg-[#F5D980]" };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nickError = await validateNick(input.nick);
        const emailError = await validateEmail(input.email, input.nick);
        const passwordError = validatePassword(input.password);
        const confirmPasswordError = input.password !== input.confirmPassword ? "Las contraseñas no coinciden" : "";

        if (nickError || emailError || passwordError || confirmPasswordError || !input.sexo) {
            setErrors({
                nick: nickError || "",
                email: emailError || "",
                password: passwordError || "",
                confirmPassword: confirmPasswordError || "",
                sexo: input.sexo ? "" : "Debe seleccionar un genero",
            });
            return;
        }

        try {
            const { signup: signupResult } = await auth.register(
                input.nick,
                input.email,
                input.password,
                input.sexo,
                input.referredByCode.trim() || undefined,
            );

            await dispatch(getUserByEmail(input.email));

            if (signupResult?.firstChipsReceived) {
                Swal.fire(
                    "¡Felicidades!",
                    "¡Ganaste 1,000,000 de fichas por ser uno de los primeros 100 usuarios!",
                    "success"
                );
            } else {
                Swal.fire("¡Éxito!", "Tu cuenta ha sido creada exitosamente", "success");
            }

            setIsRegisterOpen(false);
            navigate('/');
        } catch (error) {
            // authService.signup rechaza con el body de error del backend
            // ({ statusCode, message, error }), no con el error de axios crudo.
            if (error?.statusCode === 409) {
                const message = error.message || "";
                if (/email/i.test(message)) {
                    setErrors((prev) => ({ ...prev, email: "Este correo electrónico ya está registrado." }));
                }
                if (/nick/i.test(message)) {
                    setErrors((prev) => ({ ...prev, nick: "Ese nombre de usuario ya está en uso." }));
                }
                Swal.fire("Oops...", "Ese usuario o correo ya está en uso.", "error");
            } else {
                Swal.fire("Oops...", "Hubo un error en el registro", "error");
            }
        }
    };

    const toggleRegisterBox = () => {
        setIsRegisterOpen(!isRegisterOpen);
    };

    const strength = getPasswordStrength(input.password);

    return (
        <div className="mr-[15px]">
            <button
                onClick={toggleRegisterBox}
                type="button"
                className={className || "px-4 py-2 rounded-lg gold-gradient text-on-primary font-label-lg text-label-lg font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer"}
            >
                {children || "Registrarse"}
            </button>

            {isRegisterOpen && createPortal(
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
                    onClick={toggleRegisterBox}
                >
                    <main
                        className="relative z-10 w-full max-w-[420px] bg-[#12121A] border border-[#1A1A26] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 my-4 select-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Watermark Background */}
                        <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none select-none">
                            <div className="watermark-bg transform -rotate-12">RGAMES RGAMES</div>
                        </div>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={toggleRegisterBox}
                            className="absolute top-3 right-3 text-outline hover:text-primary transition-colors cursor-pointer z-20"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>

                        {/* Header */}
                        <div className="pt-6 px-6 flex flex-col items-center relative z-10">
                            <img alt="Logo RGAMES" className="h-12 w-auto mb-3 object-contain" src={logo} />
                            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Crea tu cuenta</h1>
                            <p className="text-[12px] text-on-surface-variant mt-0.5">Únete a la mayor comunidad de jugadores, increibles premios te esperan</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-3.5 relative z-10" id="registrationForm">
                            {/* Username / Full Name */}
                            <div className="space-y-1">
                                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Nombre de Usuario</label>
                                <input
                                    className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg py-2 px-3 text-on-surface font-body-md transition-all text-sm"
                                    placeholder="Nombre de usuario"
                                    required
                                    type="text"
                                    name="nick"
                                    value={input.nick}
                                    onChange={handleInputChange}
                                    onBlur={handleNickBlur}
                                />
                                {errors.nick ? (
                                    <p className="text-red-500 text-[11px] mt-0.5">{errors.nick}</p>
                                ) : checking.nick ? (
                                    <p className="text-on-surface-variant text-[11px] mt-0.5">Verificando disponibilidad...</p>
                                ) : null}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Correo Electrónico</label>
                                <input
                                    className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg py-2 px-3 text-on-surface font-body-md transition-all text-sm"
                                    placeholder="Correo electrónico"
                                    required
                                    type="email"
                                    name="email"
                                    value={input.email}
                                    onChange={handleInputChange}
                                    onBlur={handleEmailBlur}
                                />
                                {errors.email ? (
                                    <p className="text-red-500 text-[11px] mt-0.5">{errors.email}</p>
                                ) : checking.email ? (
                                    <p className="text-on-surface-variant text-[11px] mt-0.5">Verificando disponibilidad...</p>
                                ) : null}
                            </div>

                            {/* Password Container */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Password */}
                                <div className="space-y-1 relative">
                                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Contraseña</label>
                                    <div className="relative">
                                        <input
                                            className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg py-2 px-3 pr-8 text-on-surface font-body-md transition-all text-sm"
                                            id="password"
                                            placeholder="Contraseña"
                                            required
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={input.password}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-[11px] mt-0.5">{errors.password}</p>}
                                </div>
                                {/* Confirm Password */}
                                <div className="space-y-1 relative">
                                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Confirmar Contraseña</label>
                                    <div className="relative">
                                        <input
                                            className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg py-2 px-3 pr-8 text-on-surface font-body-md transition-all text-sm"
                                            id="confirm_password"
                                            placeholder="Confirmar"
                                            required
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={input.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                {showConfirmPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-0.5">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            {/* Password Strength Meter */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-on-surface-variant">Seguridad de la Contraseña</span>
                                    <span className={`text-[11px] font-bold ${strength.color}`}>{strength.text}</span>
                                </div>
                                <div className="flex gap-1 h-0.5 w-full">
                                    {strength.bars.map((filled, index) => (
                                        <div
                                            key={index}
                                            className={`h-full w-1/4 rounded-full transition-colors duration-300 ${
                                                filled ? strength.barColor : "bg-surface-container-highest"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Gender (Sexo) */}
                            <div className="space-y-1">
                                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Género</label>
                                <select
                                    className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg py-2 px-3 text-on-surface font-body-md transition-all cursor-pointer text-sm"
                                    required
                                    name="sexo"
                                    value={input.sexo}
                                    onChange={handleInputChange}
                                >
                                    <option disabled value="">Selecciona tu género</option>
                                    <option value="H">Hombre</option>
                                    <option value="M">Mujer</option>
                                </select>
                                {errors.sexo && <p className="text-red-500 text-[11px] mt-0.5">{errors.sexo}</p>}
                            </div>

                            {/* Referral Code (optional) */}
                            <div className="space-y-1">
                                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">
                                    Código de Referido (opcional)
                                </label>
                                <input
                                    className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg py-2 px-3 text-on-surface font-body-md transition-all text-sm uppercase"
                                    placeholder="Ej: A1B2C3D4"
                                    type="text"
                                    name="referredByCode"
                                    value={input.referredByCode}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Checkboxes */}
                            <div className="pt-1">
                                <label className="flex items-start gap-2.5 cursor-pointer group">
                                    <div className="relative flex items-center pt-0.5">
                                        <input
                                            className="peer h-4 w-4 rounded border-[#2A2A36] bg-[#0A0A0F] text-primary focus:ring-primary transition-all cursor-pointer"
                                            required
                                            type="checkbox"
                                            checked={isTermsChecked}
                                            onChange={(e) => setIsTermsChecked(e.target.checked)}
                                        />
                                    </div>
                                    <span className="font-body-sm text-[12px] text-on-surface-variant group-hover:text-on-surface transition-colors select-none">
                                        He leído y acepto los{" "}
                                        <a
                                            className="text-primary hover:underline font-bold"
                                            href="/terminos-y-condiciones"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsRegisterOpen(false);
                                                navigate("/terminos-y-condiciones");
                                            }}
                                        >
                                            términos y condiciones
                                        </a>
                                    </span>
                                </label>
                            </div>

                            {/* CTA Button */}
                            <button
                                className="royal-gold-gradient royal-gold-glow w-full py-2.5 px-4 rounded-lg text-[#0A0A0F] font-bold text-sm transition-transform active:scale-95 duration-150 uppercase tracking-wider cursor-pointer"
                                type="submit"
                            >
                                Crear Cuenta
                            </button>

                            {/* Footer Link */}
                            <p className="text-center font-body-sm text-[12px] text-on-surface-variant pt-1">
                                Ya tenes una cuenta?{" "}
                                <a
                                    className="text-primary font-bold hover:underline cursor-pointer"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsRegisterOpen(false);
                                        window.dispatchEvent(new Event("open-login-modal"));
                                    }}
                                >
                                    Entrar
                                </a>
                            </p>
                        </form>
                    </main>
                </div>,
                document.body
            )}
        </div>
    );
};

export default RegistroForm;
