import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import GameGrid from "./../Juegos/juegos";
import API_URL from "../../api/rutaApi";
import {
  fetchFavoriteGames,
  fetchPublicFavorites,
  viewedUserProfile,
  updateUserProfile,
  fetchRelationship,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} from "./../../redux/actions/index";
import RankBadge from "../ui/RankBadge/rankBadge";
import { getRankMeta, getNextRank } from "../../utils/rank";
import { swalThemeConfig } from "../../utils/formatters";

const countryOptions = [
  { value: "argentina", label: "Argentina (ARS)" },
  { value: "brasil", label: "Brasil (BRL)" },
  { value: "colombia", label: "Colombia (COP)" },
  { value: "Estados Unidos", label: "Estados Unidos (USD)" },
  { value: "espana", label: "España (EUR)" },
  { value: "mexico", label: "México (MXN)" },
  { value: "resto del mundo", label: "Resto del Mundo (USD)" },
];

const Perfil = ({ isPublic = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userNick } = useParams();
  
  const currentUser = useSelector((state) => state.currentUser);
  const viewedUser = useSelector((state) => state.viewedUserProfile);
  const relationship = useSelector((state) =>
    viewedUser?.id ? state.friends.relationship[viewedUser.id] : null,
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const user = isPublic ? viewedUser : currentUser;
  // Ownership is always derived from comparing IDs, never from which route/prop was used to
  // get here, so editing controls can never be exposed while looking at someone else's data.
  const isOwnProfile = !!currentUser?.id && !!user?.id && currentUser.id === user.id;

  // Form states for updates
  const [formData, setFormData] = useState({
    nick: "",
    age: "",
    description: "",
    country: "",
    image: "",
  });

  useEffect(() => {
    if (isPublic) {
      dispatch(viewedUserProfile(userNick));
    }
  }, [dispatch, userNick, isPublic]);
  
  useEffect(() => {
    if (!user?.id) return;
    if (isOwnProfile) {
      dispatch(fetchFavoriteGames(user.id));
    } else {
      dispatch(fetchPublicFavorites(user.id));
    }
  }, [dispatch, user?.id, isOwnProfile]);

  useEffect(() => {
    if (isPublic && viewedUser?.id && currentUser?.id && viewedUser.id !== currentUser.id) {
      dispatch(fetchRelationship(viewedUser.id));
    }
  }, [dispatch, isPublic, viewedUser?.id, currentUser?.id]);

  const avatarSrc = user?.id ? `${API_URL}/user/${user.id}/avatar-image` : null;

  useEffect(() => {
    if (user) {
      setFormData({
        nick: user.nick || "",
        age: user.age || "",
        description: user.description || "",
        country: user.country || "",
        image: user.image || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center my-16">
        <h2 className="text-2xl font-bold text-error mb-4">
          {isPublic ? "Perfil no encontrado." : "Debes iniciar sesión para ver tu perfil."}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded-lg gold-gradient text-[#0A0A0F] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
        >
          Ir al Lobby
        </button>
      </div>
    );
  }

  // If logged-in user is admin, show a placeholder or handle accordingly (as they will share the admin profile mockup next)
  if (isOwnProfile && user.admin) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center my-16 glass-card rounded-xl">
        <span className="material-symbols-outlined text-primary text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
          admin_panel_settings
        </span>
        <h2 className="text-2xl font-bold text-white mb-2">Panel de Administración de Élite</h2>
        <p className="text-on-surface-variant mb-6">
          Bienvenido, Administrador {user.nick}. Próximamente se aplicará el diseño de administración premium.
        </p>
        <button
          onClick={() => navigate("/panel")}
          className="px-6 py-2.5 rounded-lg gold-gradient text-[#0A0A0F] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
        >
          Ir al Panel Admin
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!user || !user.id || !isOwnProfile) {
      return;
    }
    dispatch(updateUserProfile(user.id, formData));
    setIsSettingsOpen(false);
    Swal.fire({
      icon: "success",
      title: "¡Perfil Actualizado!",
      text: "Tus datos se han guardado con éxito.",
      confirmButtonColor: "#C9A84C",
    });
  };

  const handleSendFriendRequest = async () => {
    try {
      await dispatch(sendFriendRequest(user.nick, user.id));
    } catch (error) {
      Swal.fire({
        title: "No se pudo enviar la solicitud",
        text: error.response?.data?.message || "Inténtalo de nuevo más tarde.",
        icon: "error",
        ...swalThemeConfig,
      });
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!relationship?.friendshipId) return;
    try {
      await dispatch(acceptFriendRequest(relationship.friendshipId, user.id));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo aceptar la solicitud.", icon: "error", ...swalThemeConfig });
    }
  };

  const handleRemoveFriend = async () => {
    if (!relationship?.friendshipId) return;
    const result = await Swal.fire({
      title: `¿Eliminar a ${user.nick} de tus amigos?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      ...swalThemeConfig,
    });
    if (!result.isConfirmed) return;
    try {
      await dispatch(removeFriend(relationship.friendshipId, user.id));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo eliminar la amistad.", icon: "error", ...swalThemeConfig });
    }
  };

  // Get user initials for premium avatar fallback
  const getInitials = (nickName) => {
    if (!nickName) return "RG";
    return nickName.slice(0, 2).toUpperCase();
  };

  const capitalize = (text) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const totalChips = user.chips || 0;
  const totalChipsDeposited = Number(user.totalChipsDeposited || 0);
  const rankMeta = getRankMeta(user.rank);
  const nextRank = getNextRank(user.rank);
  const rankProgressPercentage = nextRank
    ? Math.min(Math.round((totalChipsDeposited / nextRank.threshold) * 100), 100)
    : 100;

  // Get formatted member since date
  const getMemberSince = (createdAt) => {
    if (!createdAt) return "Miembro desde 2023";
    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) return "Miembro desde 2023";
      const monthNames = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ];
      return `Miembro desde ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    } catch (e) {
      return "Miembro desde 2023";
    }
  };

  return (
    <main className="flex-grow p-6 md:p-margin-desktop max-w-container-max mx-auto w-full select-none text-on-surface min-h-[85vh] pt-20 md:pt-24">
      {/* Profile Header */}
      <section className="relative mb-12">
        <div className="absolute inset-0 royal-gold-gradient opacity-5 blur-[100px] rounded-full -z-10 h-64 w-64 translate-x-1/2"></div>
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            title="Configuración de Perfil"
            className="absolute top-0 right-0 w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all cursor-pointer z-10"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        )}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          
          <div className="relative group">
            <div className="w-44 h-44 md:w-52 md:h-52 flex items-center justify-center relative bg-transparent overflow-visible">
              {avatarSrc ? (
                <img
                  alt="User Avatar"
                  className="w-full h-full object-contain"
                  src={avatarSrc}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = user.image || "https://via.placeholder.com/300";
                  }}
                />
              ) : user.image ? (
                <img
                  alt="User Avatar"
                  className="w-full h-full object-contain"
                  src={user.image}
                />
              ) : (
                <div className="w-full h-full rounded-full royal-gold-gradient flex items-center justify-center text-surface-container-lowest font-display-lg text-display-lg font-bold">
                  {getInitials(user.nick)}
                </div>
              )}
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Cambiar Foto de Perfil",
                      input: "text",
                      inputLabel: "Pega la URL de tu nueva imagen de perfil:",
                      inputValue: formData.image,
                      showCancelButton: true,
                      confirmButtonColor: "#C9A84C",
                      confirmButtonText: "Guardar",
                      cancelButtonText: "Cancelar",
                      inputValidator: (value) => {
                        if (!value) {
                          return "¡Debes escribir una URL!";
                        }
                      }
                    }).then((result) => {
                      if (result.isConfirmed) {
                        const updatedData = { ...formData, image: result.value };
                        setFormData(updatedData);
                        dispatch(updateUserProfile(user.id, updatedData));
                        Swal.fire({
                          icon: "success",
                          title: "¡Imagen actualizada!",
                          confirmButtonColor: "#C9A84C",
                        });
                      }
                    });
                  }}
                  className="absolute bottom-1 right-1 bg-surface-container-highest border border-outline-variant w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-surface-container-lowest transition-all group-hover:scale-110 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-grow text-center md:text-left pb-4">
            <h1 className="font-headline-lg text-headline-lg text-white mb-2">{capitalize(user.nick)}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              <RankBadge tier={user.rank} size="md" />
              <span className="text-on-surface-variant font-body-sm text-body-sm">
                {getMemberSince(user.createdAt || user.created_at || user.created)}
              </span>
            </div>

            {!isOwnProfile && currentUser?.id && (
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4">
                {relationship?.status === "friends" && (
                  <button
                    onClick={handleRemoveFriend}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-bold hover:bg-primary/10 transition-all cursor-pointer bg-transparent"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                    Amigos
                  </button>
                )}
                {relationship?.status === "pending-sent" && (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant text-sm font-bold cursor-default bg-transparent opacity-70"
                  >
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                    Solicitud Enviada
                  </button>
                )}
                {relationship?.status === "pending-received" && (
                  <button
                    onClick={handleAcceptFriendRequest}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient text-black text-sm font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer border-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Aceptar Solicitud
                  </button>
                )}
                {(!relationship || relationship.status === "none") && (
                  <button
                    onClick={handleSendFriendRequest}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-bold hover:bg-primary/10 transition-all cursor-pointer bg-transparent"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Agregar Amigo
                  </button>
                )}
                <button
                  onClick={() => navigate(`/mensajes/${user.nick}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-variant/40 text-sm font-bold transition-all cursor-pointer bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                  Enviar Mensaje
                </button>
              </div>
            )}
          </div>

          <div className="hidden lg:flex flex-col items-end gap-2 pb-4">
            <div className="text-right">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase block">Total Chips</span>
              <span className="font-headline-sm text-headline-sm royal-gold-text">
                {new Intl.NumberFormat('es-ES').format(totalChips)}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Left Column: Favorite Games */}
        <div className="lg:col-span-8">
          <div className="glass-card p-8 rounded-xl relative overflow-hidden">
            <h3 className="font-headline-sm text-headline-sm text-white mb-6 text-center">
              Mis Juegos Favoritos
            </h3>
            <GameGrid onlyFavorites={true} isPublicProfile={!isOwnProfile} />
          </div>
        </div>

        {/* Right Column: Secondary Info Cards */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          
          {/* Rank Card */}
          <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 royal-gold-gradient opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Rango Actual</span>
                <RankBadge tier={user.rank} size="sm" />
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase mb-2 block">
                {nextRank ? "Próximo Rango" : "Rango Máximo Alcanzado"}
              </span>
              <h4 className="font-headline-sm text-headline-sm text-white">{nextRank ? nextRank.label : rankMeta.label}</h4>
              <div className="w-full bg-surface-container-lowest h-2 rounded-full mb-2 border border-outline-variant/10 overflow-hidden">
                <div className="royal-gold-gradient h-full" style={{ width: `${rankProgressPercentage}%` }}></div>
              </div>
              <div className="flex justify-between font-label-md text-label-md">
                <span className="text-on-surface-variant">
                  {new Intl.NumberFormat('es-ES').format(totalChipsDeposited)}
                  {nextRank ? ` / ${new Intl.NumberFormat('es-ES').format(nextRank.threshold)}` : ""}
                </span>
                <span className="text-primary">{rankProgressPercentage}%</span>
              </div>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Beneficios de Rango",
                    text: `Por ser miembro rango ${rankMeta.label}, disfrutas de beneficios exclusivos que mejoran a medida que subes de nivel cargando fichas.`,
                    icon: "info",
                    confirmButtonColor: "#C9A84C",
                  });
                }}
                className="w-full mt-6 py-3 border border-primary/20 rounded-lg font-label-lg text-label-lg text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                Ver Beneficios de Rango
              </button>
            </div>
          </div>

        </div>

      </div>

      {isSettingsOpen && isOwnProfile && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="glass-card rounded-xl p-8 shadow-2xl relative max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[#1A1A26]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-white font-bold">Configuración de Perfil</h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 transition-all cursor-pointer bg-transparent border-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Username</label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                  type="text"
                  name="nick"
                  value={formData.nick}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Age / Edad</label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Country / País</label>
                <select
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona un país</option>
                  {countryOptions.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Avatar Image URL</label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Biography / Descripción</label>
                <textarea
                  rows="3"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm resize-none"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="md:col-span-2 pt-4 flex justify-end gap-4">
                <button
                  onClick={() => {
                    if (user) {
                      setFormData({
                        nick: user.nick || "",
                        age: user.age || "",
                        description: user.description || "",
                        country: user.country || "",
                        image: user.image || "",
                      });
                    }
                    setIsSettingsOpen(false);
                  }}
                  className="px-6 py-3 border border-outline-variant/30 rounded-lg font-label-lg text-label-lg hover:bg-surface-variant/50 transition-all text-on-surface cursor-pointer bg-transparent"
                  type="button"
                >
                  Descartar Cambios
                </button>
                <button
                  className="royal-gold-gradient text-surface-container-lowest px-8 py-3 rounded-lg font-bold font-label-lg text-label-lg hover:brightness-110 active:scale-95 transition-all gold-glow cursor-pointer border-0"
                  type="submit"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Perfil;
