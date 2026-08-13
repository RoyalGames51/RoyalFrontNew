import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";
import API_URL from "../../api/rutaApi";
import { swalThemeConfig } from "../../utils/formatters";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      Swal.fire({ title: "Contraseña muy corta", text: "Debe tener al menos 6 caracteres.", icon: "warning", ...swalThemeConfig });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({ title: "Las contraseñas no coinciden", icon: "warning", ...swalThemeConfig });
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword: password });
      setDone(true);
    } catch (error) {
      Swal.fire({
        title: "No se pudo restablecer la contraseña",
        text: error.response?.data?.message || "El enlace es inválido o expiró. Solicitá uno nuevo desde la pantalla de inicio de sesión.",
        icon: "error",
        ...swalThemeConfig,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto p-8 text-center my-24 pt-20 md:pt-24">
        <h2 className="text-2xl font-bold text-error mb-4">Enlace inválido</h2>
        <p className="text-on-surface-variant mb-6">Este enlace de recuperación no es válido. Solicitá uno nuevo desde la pantalla de inicio de sesión.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded-lg gold-gradient text-[#0A0A0F] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
        >
          Ir al Lobby
        </button>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[85vh] pt-20 md:pt-24 px-4">
      <div className="glass-card rounded-xl p-8 shadow-2xl relative max-w-md w-full space-y-6 select-none">
        <div className="flex flex-col items-center">
          <img alt="Logo RGAMES" className="h-12 w-auto object-contain mb-4" src={logo} />
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight text-center">
            {done ? "¡Contraseña Actualizada!" : "Restablecer Contraseña"}
          </h2>
        </div>

        {done ? (
          <div className="text-center space-y-6">
            <p className="text-on-surface-variant">Tu contraseña se cambió correctamente. Ya podés iniciar sesión con tu nueva contraseña.</p>
            <button
              onClick={() => navigate("/")}
              className="w-full gold-gradient gold-glow py-3.5 px-4 rounded-lg font-headline-sm text-headline-sm text-on-primary-fixed uppercase tracking-wider transition-all cursor-pointer border-0"
            >
              Ir al Inicio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block font-label-lg text-label-lg text-on-surface-variant">Nueva Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-label-lg text-label-lg text-on-surface-variant">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full gold-gradient gold-glow py-3.5 px-4 rounded-lg font-headline-sm text-headline-sm text-on-primary-fixed uppercase tracking-wider transition-all cursor-pointer border-0 disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Restablecer Contraseña"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
