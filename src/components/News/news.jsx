import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchNews, createNewsArticle, updateNewsArticle, deleteNewsArticle } from "../../redux/actions";
import { swalThemeConfig } from "../../utils/formatters";

const TAG_META = {
  Lanzamiento: "text-primary bg-primary/10 border-primary/30",
  Juegos: "text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/30",
  Promoción: "text-green-400 bg-green-400/10 border-green-400/30",
  Novedad: "text-[#4f8fe0] bg-[#4f8fe0]/10 border-[#4f8fe0]/30",
};

const TAG_ICON = {
  Lanzamiento: "rocket_launch",
  Juegos: "casino",
  Promoción: "redeem",
  Novedad: "campaign",
};

const TAG_OPTIONS = Object.keys(TAG_META);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyForm = { titulo: "", texto: "", tag: TAG_OPTIONS[0], image: null };

function NewsFormModal({ article, onClose, onSaved }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(
    article ? { titulo: article.titulo, texto: article.texto, tag: article.tag, image: null } : emptyForm,
  );
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      Swal.fire({ title: "Formato no permitido", text: "Usá JPG, PNG o WEBP.", icon: "error", ...swalThemeConfig });
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      Swal.fire({ title: "Archivo muy pesado", text: "El límite es 5MB.", icon: "error", ...swalThemeConfig });
      e.target.value = "";
      return;
    }
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.texto.trim()) {
      Swal.fire({ title: "Faltan datos", text: "Completá título y texto.", icon: "warning", ...swalThemeConfig });
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("titulo", form.titulo.trim());
      formData.append("texto", form.texto.trim());
      formData.append("tag", form.tag);
      if (form.image) formData.append("image", form.image);

      if (article) {
        await dispatch(updateNewsArticle(article.id, formData));
      } else {
        await dispatch(createNewsArticle(formData));
      }
      onSaved();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo guardar la noticia.",
        icon: "error",
        ...swalThemeConfig,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-2xl border border-outline-variant/20 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-headline-sm text-headline-sm text-white">
            {article ? "Editar Noticia" : "Crear Noticia"}
          </h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-primary bg-transparent border-0 cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">Título</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary"
            disabled={saving}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">Categoría</label>
          <select
            value={form.tag}
            onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary"
            disabled={saving}
          >
            {TAG_OPTIONS.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">Texto</label>
          <textarea
            rows={4}
            value={form.texto}
            onChange={(e) => setForm((prev) => ({ ...prev, texto: e.target.value }))}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary resize-none"
            disabled={saving}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">
            Imagen de Portada (opcional) — recomendado 1200×630px, JPG/PNG/WEBP hasta 5MB
          </label>
          {article?.imageUrl && !form.image && (
            <img src={article.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full text-on-surface-variant text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:cursor-pointer"
            disabled={saving}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-variant/30 transition-all disabled:opacity-50 cursor-pointer bg-transparent"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg gold-gradient text-black font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer border-0"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function News() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const novedades = useSelector((state) => state.news.list);
  const canManage = currentUser?.role === "admin" || currentUser?.role === "mod";

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [formState, setFormState] = useState(null); // null = closed, {} = creating, article = editing

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(novedades.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const novedadesPagina = novedades.slice(startIdx, startIdx + itemsPerPage);

  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const handleDelete = async (article) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar "${article.titulo}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      ...swalThemeConfig,
    });
    if (!confirm.isConfirmed) return;
    try {
      await dispatch(deleteNewsArticle(article.id));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo eliminar la noticia.", icon: "error", ...swalThemeConfig });
    }
  };

  return (
    <main className="max-w-3xl mx-auto w-full pt-20 md:pt-24 px-4 pb-16 text-on-surface">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-white mb-2">Noticias</h1>
          <p className="text-on-surface-variant text-sm">Todo lo nuevo en RoyalGames.</p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setFormState({})}
            className="flex-shrink-0 px-4 py-2.5 rounded-lg gold-gradient text-black font-bold text-sm hover:brightness-110 transition-all cursor-pointer border-0 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Crear Noticia
          </button>
        )}
      </div>

      {novedades.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block">newspaper</span>
          <p className="text-on-surface-variant">Todavía no hay noticias publicadas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {novedadesPagina.map((novedad) => (
            <div
              key={novedad.id}
              className="glass-card rounded-xl p-5 flex gap-4 border-l-4 border-primary relative"
            >
              {novedad.imageUrl ? (
                <img
                  src={novedad.imageUrl}
                  alt={novedad.titulo}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-primary/30"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[22px]">{TAG_ICON[novedad.tag] || "campaign"}</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-white">{novedad.titulo}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${TAG_META[novedad.tag] || ""}`}>
                    {novedad.tag}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">{novedad.texto}</p>
              </div>
              {canManage && (
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setFormState(novedad)}
                    title="Editar"
                    className="w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-primary flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(novedad)}
                    title="Eliminar"
                    className="w-7 h-7 rounded-full bg-black/30 hover:bg-error/30 border border-white/10 text-error flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {novedades.length > 0 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-5 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-variant/30 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent"
          >
            Anterior
          </button>
          <span className="text-on-surface-variant text-xs">{currentPage} / {totalPages}</span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-5 py-2 rounded-lg gold-gradient text-black font-bold text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0"
          >
            Siguiente
          </button>
        </div>
      )}

      {formState !== null && (
        <NewsFormModal
          article={formState.id ? formState : null}
          onClose={() => setFormState(null)}
          onSaved={() => setFormState(null)}
        />
      )}
    </main>
  );
}
