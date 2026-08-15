import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../../api/rutaApi";
import axios from "axios";
import chipsIcon from "../../assets/chips.png";
import bannerPerfil from "../../assets/bannerperfil.png";
import bannerPerfilDorado from "../../assets/BannerPerfilDorado.png";
import bannerPerfilVerde from "../../assets/BannerPerfilVerde.png";
import insigniaAdmin from "../../assets/InsigniaAdmin.png";
import insigniaMod from "../../assets/InsigniaMod.png";
import {
  viewedUserProfile,
  updateUserProfile,
  fetchRelationship,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  fetchBlockStatus,
  blockUser,
  unblockUser,
  giftChips,
} from "./../../redux/actions/index";
import RankBadge from "../ui/RankBadge/rankBadge";
import { getRankMeta, getNextRank } from "../../utils/rank";
import { swalThemeConfig } from "../../utils/formatters";
import { getGameByPlayPath } from "../../data/gamesCatalog";

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
  const blockStatus = useSelector((state) =>
    viewedUser?.id ? state.blocks.status[viewedUser.id] : null,
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Only meaningful for public profiles (isPublic=true) — tracks whether the nick lookup is
  // still in flight, failed (no such user), or resolved, since redux's viewedUserProfile
  // starts as an empty array (truthy!) so a plain `!user` check can't tell "not found" apart
  // from "not loaded yet".
  const [viewStatus, setViewStatus] = useState(isPublic ? "loading" : "ready");

  const user = isPublic ? viewedUser : currentUser;
  // Ownership is always derived from comparing IDs, never from which route/prop was used to
  // get here, so editing controls can never be exposed while looking at someone else's data.
  const isOwnProfile = !!currentUser?.id && !!user?.id && currentUser.id === user.id;

  // Form states for updates
  const [formData, setFormData] = useState({
    nick: "",
    email: "",
    age: "",
    description: "",
    country: "",
    image: "",
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!isPublic) {
      setViewStatus("ready");
      return;
    }
    let cancelled = false;
    setViewStatus("loading");
    dispatch(viewedUserProfile(userNick))
      .then(() => {
        if (!cancelled) setViewStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setViewStatus("not-found");
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, userNick, isPublic]);

  useEffect(() => {
    if (isPublic && viewedUser?.id && currentUser?.id && viewedUser.id !== currentUser.id) {
      dispatch(fetchRelationship(viewedUser.id));
      dispatch(fetchBlockStatus(viewedUser.id));
    }
  }, [dispatch, isPublic, viewedUser?.id, currentUser?.id]);

  const avatarSrc = user?.id ? `${API_URL}/user/${user.id}/avatar-image` : null;

  useEffect(() => {
    if (user) {
      setFormData({
        nick: user.nick || "",
        email: user.email || "",
        age: user.age || "",
        description: user.description || "",
        country: user.country || "",
        image: user.image || "",
      });
    }
  }, [user]);

  if (isPublic && viewStatus === "loading") {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (isPublic && viewStatus === "not-found") {
    return (
      <div className="w-full max-w-lg mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">person_search</span>
        <h2 className="font-headline-md text-headline-md text-white mb-3">Usuario Inexistente</h2>
        <p className="text-on-surface-variant mb-6">
          El nick <strong className="text-white">{userNick}</strong> no corresponde a ningún jugador registrado en RoyalGames.
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

  if (viewStatus === "ready" && user?.banned) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <span className="material-symbols-outlined text-6xl text-error mb-4 block">block</span>
        <h2 className="font-headline-md text-headline-md text-white mb-3">Usuario Baneado</h2>
        <p className="text-on-surface-variant mb-6">
          {isOwnProfile
            ? "Tu cuenta fue suspendida. Si creés que es un error, contactá a soporte."
            : <>La cuenta <strong className="text-white">{capitalize(user.nick)}</strong> fue suspendida por incumplir las normas de la plataforma.</>}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-lg gold-gradient text-[#0A0A0F] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
          >
            Ir al Lobby
          </button>
          {isOwnProfile && (
            <button
              onClick={() => navigate("/contacto")}
              className="px-6 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface font-bold uppercase tracking-wider hover:bg-surface-variant/20 transition-all"
            >
              Contactar Soporte
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!user || (isPublic && !user?.id)) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <h2 className="text-2xl font-bold text-error mb-4">
          {isPublic ? "Usuario Inexistente" : "Debes iniciar sesión para ver tu perfil."}
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

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    if (passwordForm.newPassword.length < 6) {
      Swal.fire({ title: "Contraseña muy corta", text: "Debe tener al menos 6 caracteres.", icon: "warning", ...swalThemeConfig });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({ title: "Las contraseñas no coinciden", icon: "warning", ...swalThemeConfig });
      return;
    }
    setIsChangingPassword(true);
    try {
      await axios.patch(`${API_URL}/users/${user.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      Swal.fire({ icon: "success", title: "¡Contraseña actualizada!", confirmButtonColor: "#C9A84C" });
    } catch (error) {
      Swal.fire({
        title: "No se pudo cambiar la contraseña",
        text: error.response?.data?.message || "Verificá tu contraseña actual e inténtalo de nuevo.",
        icon: "error",
        ...swalThemeConfig,
      });
    } finally {
      setIsChangingPassword(false);
    }
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

  const handleGiftChips = async () => {
    const { value: amount } = await Swal.fire({
      title: `Regalar fichas a ${capitalize(user.nick)}`,
      input: "number",
      inputLabel: "Cantidad de fichas",
      inputAttributes: { min: 1, step: 1 },
      showCancelButton: true,
      confirmButtonText: "Regalar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#C9A84C",
      ...swalThemeConfig,
      inputValidator: (value) => {
        if (!value || Number(value) < 1) return "Ingresá una cantidad válida.";
        if (Number(value) > (currentUser?.chips || 0)) return "No tenés fichas suficientes.";
      },
    });
    if (!amount) return;
    try {
      await dispatch(giftChips(user.id, Number(amount)));
      Swal.fire({
        icon: "success",
        title: "¡Fichas enviadas!",
        text: `Le regalaste ${new Intl.NumberFormat('es-ES').format(Number(amount))} fichas a ${capitalize(user.nick)}.`,
        confirmButtonColor: "#C9A84C",
      });
    } catch (error) {
      Swal.fire({
        title: "No se pudo completar el regalo",
        text: error.response?.data?.message || "Inténtalo de nuevo más tarde.",
        icon: "error",
        ...swalThemeConfig,
      });
    }
  };

  const handleBlockToggle = async () => {
    const isBlocked = !!blockStatus?.blockedByMe;
    if (isBlocked) {
      try {
        await dispatch(unblockUser(user.id));
      } catch (error) {
        Swal.fire({ title: "Error", text: "No se pudo desbloquear al usuario.", icon: "error", ...swalThemeConfig });
      }
      return;
    }
    const result = await Swal.fire({
      title: `¿Bloquear a ${capitalize(user.nick)}?`,
      text: "No podrá enviarte mensajes ni solicitudes de amistad.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bloquear",
      cancelButtonText: "Cancelar",
      ...swalThemeConfig,
    });
    if (!result.isConfirmed) return;
    try {
      await dispatch(blockUser(user.id));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo bloquear al usuario.", icon: "error", ...swalThemeConfig });
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
  const profileBanner = user.role === "admin" ? bannerPerfilDorado : user.role === "mod" ? bannerPerfilVerde : bannerPerfil;
  const roleInsignia = user.role === "admin" ? insigniaAdmin : user.role === "mod" ? insigniaMod : null;
  const nextRank = getNextRank(user.rank);
  const rankProgressPercentage = nextRank
    ? Math.min(Math.round((totalChipsDeposited / nextRank.threshold) * 100), 100)
    : 100;

  const showRankBenefits = () => {
    Swal.fire({
      title: "Beneficios de Rango",
      text: isOwnProfile
        ? `Por ser miembro rango ${rankMeta.label}, disfrutas de beneficios exclusivos que mejoran a medida que subes de nivel cargando fichas.`
        : `${capitalize(user.nick)} es miembro rango ${rankMeta.label}, con beneficios exclusivos que mejoran al subir de nivel cargando fichas.`,
      icon: "info",
      confirmButtonColor: "#C9A84C",
    });
  };

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

  const countryLabel = user.country
    ? countryOptions.find((c) => c.value === user.country)?.label || user.country
    : null;
  const bioMeta = [user.age ? `${user.age} años` : null, countryLabel].filter(Boolean).join(" · ");

  const isBlocked = !!blockStatus?.blockedByMe;

  return (
    <main className="flex-grow p-6 md:p-margin-desktop max-w-container-max mx-auto w-full select-none text-on-surface pt-20 md:pt-24">
      {/* Profile Header */}
      <section className="relative mb-10">
        <div className="absolute inset-0 royal-gold-gradient opacity-5 blur-[100px] rounded-full -z-10 h-64 w-64 translate-x-1/2"></div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Banner + Avatar + Identity */}
          <div className="flex-1 min-w-0 w-full relative rounded-2xl overflow-hidden border border-outline-variant/20 aspect-[16/9]">
            <img src={profileBanner} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-black/75"></div>

            {roleInsignia && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-black/60 backdrop-blur-sm border border-white/15 rounded-xl p-1.5 sm:p-2 shadow-lg">
                <img
                  src={roleInsignia}
                  alt={user.role === "admin" ? "Admin" : "Mod"}
                  className="h-12 sm:h-20 w-auto object-contain"
                />
              </div>
            )}

            {/* Status badge + settings gear */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-2 sm:gap-3 z-10">
              {(() => {
                // Own profile: currentUser in Redux isn't live-updated by the background heartbeat,
                // so lastSeen/currentActivity there can lag — but viewing your own profile right now
                // is itself proof you're online, so skip the staleness check entirely in that case.
                const isOnline = isOwnProfile || (user.lastSeen && Date.now() - new Date(user.lastSeen).getTime() < 5 * 60 * 1000);
                const activeGame = isOnline && !isOwnProfile ? getGameByPlayPath(user.currentActivity) : null;
                return (
                  <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[10px] sm:text-[11px] font-bold whitespace-nowrap">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                    <span className={isOnline ? (activeGame ? "text-primary" : "text-green-500") : "text-on-surface-variant"}>
                      {activeGame ? `Jugando a ${activeGame.name}` : isOnline ? "Conectado" : "Desconectado"}
                    </span>
                  </div>
                );
              })()}
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  title="Configuración de Perfil"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all cursor-pointer flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">settings</span>
                </button>
              )}
            </div>

            {/* Avatar / Photo, positioned inside the banner's frame */}
            <div
              className="absolute group"
              style={{ left: "21%", top: "50%", width: "24%", transform: "translate(-50%, -50%)" }}
            >
              <div className="relative aspect-square w-full flex items-center justify-center bg-transparent overflow-visible">
                {avatarSrc ? (
                  <img
                    alt="Avatar de Usuario"
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
                    alt="Avatar de Usuario"
                    className="w-full h-full object-contain"
                    src={user.image}
                  />
                ) : (
                  <div className="w-full h-full rounded-full royal-gold-gradient flex items-center justify-center text-surface-container-lowest text-2xl sm:text-4xl font-bold">
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
                    className="absolute bottom-0 right-0 bg-surface-container-highest border border-outline-variant w-6 h-6 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-primary hover:text-surface-container-lowest transition-all group-hover:scale-110 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[12px] sm:text-[16px]">edit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Identity + Bio */}
            <div className="absolute inset-y-0 flex flex-col justify-center gap-1 sm:gap-2 text-left" style={{ left: "37%", right: "4%" }}>
              <h1 className="font-headline-sm sm:font-headline-md text-headline-sm sm:text-headline-md text-white truncate">{capitalize(user.nick)}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <RankBadge tier={user.rank} size="sm" />
                <span className="hidden sm:inline text-on-surface-variant font-body-sm text-body-sm">
                  {getMemberSince(user.createdAt || user.created_at || user.created)}
                </span>
                <span className="text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1">
                  <img src={chipsIcon} alt="Fichas" className="w-4 h-4" />
                  {new Intl.NumberFormat('es-ES').format(totalChips)}
                </span>
              </div>

              {(user.description || isOwnProfile) && (
                <div className="hidden md:block mt-1 max-w-xl w-full glass-card rounded-xl px-4 py-3 text-left">
                  {bioMeta && (
                    <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-1">{bioMeta}</p>
                  )}
                  <p className="text-on-surface text-xs leading-relaxed whitespace-pre-line line-clamp-3">
                    {user.description
                      ? `Me gustaría decirles: ${user.description}`
                      : "Este usuario todavía no escribió una biografía. Podés agregar la tuya desde Configuración."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Panel */}
          <div className="w-full lg:w-64 flex-shrink-0">
            {isOwnProfile ? (
              <div className="glass-card rounded-xl overflow-hidden">
                <h4 className="font-headline-sm text-headline-sm text-white px-6 pt-6 pb-3">Accesos Rápidos</h4>
                <div className="flex flex-col">
                  {[
                    { label: "Mis Amigos", icon: "group", to: "/amigos" },
                    { label: "Mis Mensajes", icon: "forum", to: "/mensajes" },
                    { label: "Comprar Fichas", icon: "paid", to: "/chips" },
                    { label: "Cambiar Avatar", icon: "face_retouching_natural", to: "/bazar" },
                    { label: "Ayuda", icon: "support_agent", to: "/ayuda" },
                    ...(user.role === "admin"
                      ? [{ label: "Panel de Administración", icon: "admin_panel_settings", to: "/admin/dashboard" }]
                      : []),
                  ].map((item) => (
                    <button
                      key={item.to}
                      type="button"
                      onClick={() => navigate(item.to)}
                      className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 first:border-t-0 hover:bg-surface-variant/30 transition-colors cursor-pointer text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                      <span className="font-label-lg text-label-lg">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              currentUser?.id && (
                <div className="glass-card rounded-xl overflow-hidden">
                  <h4 className="font-headline-sm text-headline-sm text-white px-6 pt-6 pb-3">Acciones</h4>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={handleGiftChips}
                      className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 first:border-t-0 hover:bg-surface-variant/30 transition-colors cursor-pointer text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]">redeem</span>
                      <span className="font-label-lg text-label-lg">Regalar Fichas</span>
                    </button>

                    <button
                      type="button"
                      onClick={showRankBenefits}
                      className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 hover:bg-surface-variant/30 transition-colors cursor-pointer text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
                      <span className="font-label-lg text-label-lg">Ver Puntuación</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/mensajes/${user.nick}`)}
                      className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 hover:bg-surface-variant/30 transition-colors cursor-pointer text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]">forum</span>
                      <span className="font-label-lg text-label-lg">Enviar Mensaje</span>
                    </button>

                    {relationship?.status === "friends" && (
                      <button
                        type="button"
                        onClick={handleRemoveFriend}
                        className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 hover:bg-surface-variant/30 transition-colors cursor-pointer text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                        <span className="font-label-lg text-label-lg">Amigos</span>
                      </button>
                    )}
                    {relationship?.status === "pending-sent" && (
                      <button
                        type="button"
                        disabled
                        className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 cursor-default text-on-surface-variant opacity-70"
                      >
                        <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
                        <span className="font-label-lg text-label-lg">Solicitud Enviada</span>
                      </button>
                    )}
                    {relationship?.status === "pending-received" && (
                      <button
                        type="button"
                        onClick={handleAcceptFriendRequest}
                        className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 hover:bg-surface-variant/30 transition-colors cursor-pointer text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        <span className="font-label-lg text-label-lg">Aceptar Solicitud</span>
                      </button>
                    )}
                    {(!relationship || relationship.status === "none") && (
                      <button
                        type="button"
                        onClick={handleSendFriendRequest}
                        className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 hover:bg-surface-variant/30 transition-colors cursor-pointer text-on-surface"
                      >
                        <span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
                        <span className="font-label-lg text-label-lg">Añadir como Amigo</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleBlockToggle}
                      className="flex items-center gap-3 px-6 py-3 text-left bg-transparent border-0 border-t border-outline-variant/10 hover:bg-surface-variant/30 transition-colors cursor-pointer text-error"
                    >
                      <span className="material-symbols-outlined text-[20px]">{isBlocked ? "how_to_reg" : "block"}</span>
                      <span className="font-label-lg text-label-lg">{isBlocked ? "Desbloquear Usuario" : "Bloquear Usuario"}</span>
                    </button>
                  </div>
                </div>
              )
            )}

            {/* Rank Progress */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group mt-6">
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
                  onClick={showRankBenefits}
                  className="w-full mt-6 py-3 border border-primary/20 rounded-lg font-label-lg text-label-lg text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">workspace_premium</span>
                  Ver Beneficios de Rango
                </button>
              </div>
            </div>

            {/* Referral Code */}
            {isOwnProfile && user.referralCode && (
              <div className="glass-card p-6 rounded-xl relative overflow-hidden mt-6">
                <h4 className="font-headline-sm text-headline-sm text-white mb-1">Referí Amigos</h4>
                <p className="text-on-surface-variant text-xs mb-4">
                  Compartí tu código: si alguien se registra con él, recibe 1.000.000 de fichas de regalo.
                </p>
                <div className="flex items-center justify-between gap-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 mb-3">
                  <span className="font-bold text-primary tracking-widest">{user.referralCode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(user.referralCode);
                      Swal.fire({ icon: "success", title: "¡Código copiado!", confirmButtonColor: "#C9A84C", timer: 1500, showConfirmButton: false });
                    }}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border-0"
                    title="Copiar código"
                  >
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?ref=${user.referralCode}`);
                    Swal.fire({ icon: "success", title: "¡Enlace copiado!", confirmButtonColor: "#C9A84C", timer: 1500, showConfirmButton: false });
                  }}
                  className="w-full py-2.5 rounded-lg border border-primary/20 text-primary font-label-lg text-label-lg hover:bg-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer bg-transparent"
                >
                  <span className="material-symbols-outlined text-sm">link</span>
                  Copiar Enlace de Invitación
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bio: shown below the banner on small screens, where there's no room to overlay it */}
        {(user.description || isOwnProfile) && (
          <div className="md:hidden mt-4 glass-card rounded-xl px-5 py-4 text-left">
            {bioMeta && (
              <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">{bioMeta}</p>
            )}
            <p className="text-on-surface text-sm leading-relaxed whitespace-pre-line">
              {user.description
                ? `Me gustaría decirles: ${user.description}`
                : "Este usuario todavía no escribió una biografía. Podés agregar la tuya desde Configuración."}
            </p>
          </div>
        )}
      </section>

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
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Nombre de Usuario</label>
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
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Correo Electrónico</label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Edad</label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">País</label>
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
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">URL de Imagen de Avatar</label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Descripción</label>
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
                        email: user.email || "",
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

            <div className="mt-8 pt-6 border-t border-outline-variant/10">
              <h4 className="font-headline-sm text-headline-sm text-white font-bold mb-4">Cambiar Contraseña</h4>
              <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Contraseña Actual</label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Nueva Contraseña</label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Confirmar Nueva Contraseña</label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-8 py-3 border border-primary/30 rounded-lg font-bold font-label-lg text-label-lg text-primary hover:bg-primary/10 transition-all cursor-pointer bg-transparent disabled:opacity-50"
                  >
                    {isChangingPassword ? "Guardando..." : "Cambiar Contraseña"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Perfil;
