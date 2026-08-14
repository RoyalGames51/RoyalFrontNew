import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import API_URL from "../../api/rutaApi";
import { swalThemeConfig } from "../../utils/formatters";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export default function Careers() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validExtension = ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
      if (!validExtension) {
        Swal.fire({ title: "Formato no válido", text: "Tu CV debe ser un archivo PDF o Word (.doc, .docx).", icon: "warning", ...swalThemeConfig });
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({ title: "Archivo muy pesado", text: "Tu CV no puede pesar más de 5MB.", icon: "warning", ...swalThemeConfig });
        e.target.value = "";
        return;
      }
    }
    setCvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || !cvFile) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("message", message.trim());
      formData.append("cv", cvFile);

      await axios.post(`${API_URL}/careers/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSent(true);
    } catch (error) {
      Swal.fire({
        title: "No se pudo enviar tu postulación",
        text: error.response?.data?.message || "Intentá de nuevo más tarde.",
        icon: "error",
        ...swalThemeConfig,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <span className="material-symbols-outlined text-6xl text-primary mb-4 block">work</span>
        <h2 className="font-headline-md text-headline-md text-white mb-3">¡Postulación enviada!</h2>
        <p className="text-on-surface-variant mb-6">
          Gracias por tu interés en RoyalGames. Revisamos tu CV y, si hay un buen fit, te contactamos a{" "}
          <strong className="text-white">{email}</strong>.
        </p>
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
    <main className="w-full max-w-lg mx-auto p-6 md:p-8 my-16 pt-20 md:pt-24 text-on-surface">
      <h1 className="font-headline-lg text-headline-lg text-white mb-2">Trabaja con Nosotros</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        ¿Te gustaría formar parte de RoyalGames? Contanos por qué y dejanos tu CV.
      </p>

      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-4">
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">
            ¿Por qué querés trabajar con nosotros?
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Contanos sobre vos, tu experiencia y qué te gustaría aportar..."
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm resize-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">CV (PDF o Word, máx. 5MB)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-black file:font-bold file:cursor-pointer file:text-xs cursor-pointer"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg gold-gradient text-black font-bold uppercase tracking-wider cursor-pointer border-0 disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar Postulación"}
        </button>
      </form>
    </main>
  );
}
