import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchBannerSlides, createBannerSlide, deleteBannerSlide } from "../../redux/actions";
import { swalThemeConfig } from "../../utils/formatters";

const SLIDE_INTERVAL_MS = 6000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// The big "Bienvenida" banner on the logged-in Home dashboard. Falls back to a single static
// image (fallbackSrc) when no admin has added any real slides yet, so the banner is never blank.
export default function BannerCarousel({ fallbackSrc, className }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const canManage = currentUser?.role === "admin" || currentUser?.role === "mod";

  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManaging, setIsManaging] = useState(false);
  const fileInputRef = useRef(null);

  const loadSlides = () => {
    dispatch(fetchBannerSlides()).then(setSlides).catch(() => {});
  };

  useEffect(() => {
    loadSlides();
  }, [dispatch]);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (currentIndex >= slides.length) setCurrentIndex(0);
  }, [slides.length, currentIndex]);

  const handleAddFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      Swal.fire({ title: "Formato no permitido", text: "Usá JPG, PNG o WEBP.", icon: "error", ...swalThemeConfig });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      Swal.fire({ title: "Archivo muy pesado", text: "El límite es 5MB.", icon: "error", ...swalThemeConfig });
      return;
    }
    try {
      await dispatch(createBannerSlide(file));
      loadSlides();
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo subir la imagen.", icon: "error", ...swalThemeConfig });
    }
  };

  const handleDelete = async (slide) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar esta imagen del carrusel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      ...swalThemeConfig,
    });
    if (!confirm.isConfirmed) return;
    try {
      await dispatch(deleteBannerSlide(slide.id));
      loadSlides();
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo eliminar la imagen.", icon: "error", ...swalThemeConfig });
    }
  };

  return (
    <>
      {slides.length > 0 ? (
        slides.map((slide, i) => (
          <img
            key={slide.id}
            src={slide.imageUrl}
            alt=""
            className={`${className} transition-opacity duration-1000 ${i === currentIndex ? "opacity-100" : "opacity-0"}`}
          />
        ))
      ) : (
        <img src={fallbackSrc} alt="" className={className} />
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`w-2 h-2 rounded-full border-0 cursor-pointer transition-all ${i === currentIndex ? "bg-primary w-5" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}

      {canManage && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsManaging(true);
          }}
          title="Gestionar imágenes del banner"
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-primary flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
        </button>
      )}

      {isManaging && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsManaging(false);
          }}
        >
          <div
            className="glass-card rounded-2xl border border-outline-variant/20 max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-white">Imágenes del Banner Principal</h3>
              <button
                type="button"
                onClick={() => setIsManaging(false)}
                className="text-on-surface-variant hover:text-primary bg-transparent border-0 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-on-surface-variant text-xs">
              Se van pasando solas cada {SLIDE_INTERVAL_MS / 1000} segundos. Recomendado: 1600×700px aprox., JPG o PNG, hasta 5MB.
            </p>

            {slides.length === 0 ? (
              <p className="text-on-surface-variant text-sm py-4 text-center">Todavía no agregaste ninguna imagen — se muestra la de por defecto.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {slides.map((slide) => (
                  <div key={slide.id} className="relative rounded-lg overflow-hidden border border-outline-variant/20 aspect-video">
                    <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDelete(slide)}
                      title="Eliminar"
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-error/80 hover:bg-error text-white flex items-center justify-center cursor-pointer border-0"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-lg border-2 border-dashed border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:border-primary hover:text-primary transition-all cursor-pointer bg-transparent flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              Agregar Imagen
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAddFile}
              className="hidden"
            />
          </div>
        </div>
      )}
    </>
  );
}
