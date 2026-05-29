import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import GameGrid from "./../Juegos/juegos";
import { fetchFavoriteGames, fetchPublicFavorites, viewedUserProfile, updateUserProfile } from "./../../redux/actions/index";

const Perfil = ({ isPublic = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userNick } = useParams();
  
  const currentUser = useSelector((state) => state.currentUser);
  const viewedUser = useSelector((state) => state.viewedUserProfile);

  const [activeTab, setActiveTab] = useState("info"); // "info", "favoritos"
  const [isEditing, setIsEditing] = useState(false);

  const user = isPublic ? viewedUser : currentUser;

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
    if (isPublic && viewedUser?.id) {
      dispatch(fetchPublicFavorites(viewedUser.id));
    }
  }, [dispatch, isPublic, viewedUser?.id]);
  
  useEffect(() => {
    if (!isPublic && currentUser?.id) {
      dispatch(fetchFavoriteGames(currentUser.id));
    }
  }, [dispatch, isPublic, currentUser?.id]);

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
  if (!isPublic && user.admin) {
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
    if (!user || !user.id) {
      console.error("El ID del usuario es inválido.");
      return;
    }
    dispatch(updateUserProfile(user.id, formData));
    setIsEditing(false);
    Swal.fire({
      icon: "success",
      title: "¡Perfil Actualizado!",
      text: "Tus datos se han guardado con éxito.",
      confirmButtonColor: "#C9A84C",
    });
  };

  // Get user initials for premium avatar fallback
  const getInitials = (nickName) => {
    if (!nickName) return "RG";
    return nickName.slice(0, 2).toUpperCase();
  };

  // Calculate VIP Progress based on chips or static wagered info for immersion
  const totalChips = user.chips || 0;
  const wageredPercentage = Math.min(Math.round((totalChips / 5000000) * 100), 100);

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
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary/20 p-1 flex items-center justify-center relative gold-glow overflow-hidden bg-[#12121A]">
              {user.image || user.avatar ? (
                <img
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                  src={user.image || user.avatar}
                />
              ) : (
                <div className="w-full h-full rounded-full royal-gold-gradient flex items-center justify-center text-surface-container-lowest font-display-lg text-display-lg font-bold">
                  {getInitials(user.nick)}
                </div>
              )}
              {!isPublic && (
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
            <h1 className="font-headline-lg text-headline-lg text-white mb-2">{user.nick}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="font-label-md text-label-md text-primary">
                  {totalChips > 2000000 ? "Platinum Elite VIP" : "Gold IV VIP"}
                </span>
              </div>
              <span className="text-on-surface-variant font-body-sm text-body-sm">
                {getMemberSince(user.createdAt || user.created_at || user.created)}
              </span>
            </div>
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

      {/* Tabs Navigation */}
      <div className="flex gap-8 border-b border-outline-variant/20 mb-10 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setActiveTab("info");
            setIsEditing(false);
          }}
          className={`pb-4 font-label-lg text-label-lg whitespace-nowrap transition-all border-b-2 ${
            activeTab === "info"
              ? "text-primary border-primary font-bold"
              : "text-on-surface-variant hover:text-on-surface border-transparent"
          }`}
        >
          Personal Info
        </button>
        <button
          onClick={() => {
            setActiveTab("favoritos");
            setIsEditing(false);
          }}
          className={`pb-4 font-label-lg text-label-lg whitespace-nowrap transition-all border-b-2 ${
            activeTab === "favoritos"
              ? "text-primary border-primary font-bold"
              : "text-on-surface-variant hover:text-on-surface border-transparent"
          }`}
        >
          Juegos Favoritos
        </button>
      </div>

      {/* Profile Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Left Column: Form & Lists */}
        <div className="lg:col-span-8">
          {activeTab === "info" && (
            <div className="glass-card p-8 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline-sm text-headline-sm text-white font-bold">Personal Information</h3>
                {!isPublic && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition-all font-label-md text-label-md cursor-pointer bg-transparent"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    <span>Editar Perfil</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                /* Editing Mode Form */
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
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
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

                  <div className="md:col-span-2 pt-6 flex justify-end gap-4">
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
                        setIsEditing(false);
                      }}
                      className="px-6 py-3 border border-outline-variant/30 rounded-lg font-label-lg text-label-lg hover:bg-surface-variant/50 transition-all text-on-surface cursor-pointer bg-transparent"
                      type="button"
                    >
                      Discard Changes
                    </button>
                    <button
                      className="royal-gold-gradient text-surface-container-lowest px-8 py-3 rounded-lg font-bold font-label-lg text-label-lg hover:brightness-110 active:scale-95 transition-all gold-glow cursor-pointer border-0"
                      type="submit"
                    >
                      Save Information
                    </button>
                  </div>
                </form>
              ) : (
                /* Read-Only Mode Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-2">
                    <span className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Username / Nick</span>
                    <div className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg px-4 py-3 text-on-surface font-body-md text-sm">
                      {user.nick}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Email Address</span>
                    <div className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg px-4 py-3 text-on-surface font-body-md text-sm">
                      {user.email || "Email no disponible"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Gender / Género</span>
                    <div className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg px-4 py-3 text-on-surface font-body-md text-sm">
                      {user.sexo === "H" ? "Hombre / Male" : user.sexo === "M" ? "Mujer / Female" : "No especificado"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Age / Edad</span>
                    <div className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg px-4 py-3 text-on-surface font-body-md text-sm">
                      {user.age ? `${user.age} años` : "No especificado"}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <span className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Country / País</span>
                    <div className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg px-4 py-3 text-on-surface font-body-md text-sm">
                      {user.country || "No especificado"}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <span className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Biography / Descripción</span>
                    <div className="w-full bg-[#0A0A0F] border border-[#2A2A36] rounded-lg px-4 py-3 text-on-surface font-body-md text-sm italic">
                      {user.description ? `"${user.description}"` : "Sin descripción disponible."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "favoritos" && (
            <div className="glass-card p-8 rounded-xl relative overflow-hidden">
              <h3 className="font-headline-sm text-headline-sm text-white mb-6 text-center">
                Mis Juegos Favoritos
              </h3>
              <GameGrid onlyFavorites={true} isPublicProfile={isPublic} />
            </div>
          )}
        </div>

        {/* Right Column: Secondary Info Cards */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          
          {/* Verification Status */}
          <div className="glass-card p-6 rounded-xl border-l-4 border-l-primary">
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <h4 className="font-headline-sm text-headline-sm text-white">Verification</h4>
            </div>
            <p className="text-on-surface-variant font-body-sm text-body-sm mb-6 leading-relaxed">
              Your account is fully verified. You have unlimited access to all VIP features and withdrawal limits.
            </p>
            <div className="flex items-center gap-2 text-primary font-label-md text-label-md">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Level 3 KYC Complete</span>
            </div>
          </div>

          {/* VIP Card */}
          <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 royal-gold-gradient opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
            <div className="relative z-10">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase mb-2 block">Next Milestone</span>
              <h4 className="font-headline-sm text-headline-sm text-white">Platinum I</h4>
              <div className="w-full bg-surface-container-lowest h-2 rounded-full mb-2 border border-outline-variant/10 overflow-hidden">
                <div className="royal-gold-gradient h-full" style={{ width: `${wageredPercentage}%` }}></div>
              </div>
              <div className="flex justify-between font-label-md text-label-md">
                <span className="text-on-surface-variant">
                  {new Intl.NumberFormat('es-ES').format(totalChips)} / 5.000.000
                </span>
                <span className="text-primary">{wageredPercentage}%</span>
              </div>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Beneficios VIP",
                    text: "Por ser miembro Gold IV VIP, disfrutas de retiros express, soporte prioritario 24/7 y multiplicadores de giros gratis en juegos destacados.",
                    icon: "info",
                    confirmButtonColor: "#C9A84C",
                  });
                }}
                className="w-full mt-6 py-3 border border-primary/20 rounded-lg font-label-lg text-label-lg text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                View VIP Benefits
              </button>
            </div>
          </div>

          {/* Security Preview */}
          <div className="glass-card p-6 rounded-xl">
            <h4 className="font-headline-sm text-headline-sm text-white mb-4">Security Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant font-body-sm">Account Status</span>
                <span className="text-primary font-label-md">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant font-body-sm">Last Session</span>
                <span className="text-on-surface font-body-sm text-right">Just now</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-body-sm">Security Grade</span>
                <span className="text-[#F5D980] font-label-md text-right">ELITE</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default Perfil;
