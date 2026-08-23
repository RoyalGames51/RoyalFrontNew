import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { updateSiteContentImage } from "../../redux/actions";
import { swalThemeConfig } from "../../utils/formatters";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Renders <img> + (for admins/mods) an overlay "Editar" pencil, as siblings — assumes the
// caller's own wrapping element already has position:relative (matches every current call site,
// which are all banner/card containers that are already `relative`), so it doesn't add an extra
// wrapping div that would fight with the `className` prop's own absolute-positioning needs.
export default function EditableImage({ contentKey, fallbackSrc, alt = "", className = "", recommendedSize }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const override = useSelector((state) => state.siteContent[contentKey]);
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "mod";
  const src = override?.type === "image" && override.imageUrl ? override.imageUrl : fallbackSrc;

  const handleEdit = async (e) => {
    e.stopPropagation();
    const { value: file } = await Swal.fire({
      title: "Cambiar imagen",
      text: recommendedSize ? `Tamaño recomendado: ${recommendedSize}` : undefined,
      input: "file",
      inputAttributes: { accept: "image/jpeg,image/png,image/webp" },
      showCancelButton: true,
      confirmButtonText: "Subir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#C9A84C",
      inputValidator: (file) => {
        if (!file) return "Elegí un archivo.";
        if (!ALLOWED_TYPES.includes(file.type)) return "Formato no permitido. Usá JPG, PNG o WEBP.";
        if (file.size > MAX_FILE_SIZE) return "El archivo pesa más de 5MB.";
      },
      ...swalThemeConfig,
    });
    if (!file) return;
    try {
      await dispatch(updateSiteContentImage(contentKey, file));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo subir la imagen.", icon: "error", ...swalThemeConfig });
    }
  };

  return (
    <>
      <img src={src} alt={alt} className={className} />
      {canEdit && (
        <button
          type="button"
          onClick={handleEdit}
          title="Editar imagen"
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-primary flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
        </button>
      )}
    </>
  );
}
