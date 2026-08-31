import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../../api/rutaApi";
import { swalThemeConfig } from "../../utils/formatters";
import RankBadge from "../ui/RankBadge/rankBadge";
import {
  fetchFriends,
  fetchIncomingRequests,
  fetchOutgoingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from "../../redux/actions/index";

function UserRow({ user, children }) {
  const navigate = useNavigate();
  const avatarSrc = user?.id ? `${API_URL}/user/${user.id}/avatar-thumbnail` : null;
  const initials = (user?.nick || "RG").slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
      <button
        type="button"
        onClick={() => navigate(`/perfil/${user.nick}`)}
        className="flex items-center gap-3 min-w-0 bg-transparent border-0 cursor-pointer text-left"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 royal-gold-gradient flex items-center justify-center text-surface-container-lowest font-bold text-sm">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={user.nick}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold truncate">{user.nick}</p>
          <RankBadge tier={user.rank} size="sm" />
        </div>
      </button>
      <div className="flex items-center gap-2 flex-shrink-0">{children}</div>
    </div>
  );
}

export default function Friends() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser);
  const { list, incoming, outgoing } = useSelector((state) => state.friends);

  const [searchNick, setSearchNick] = useState("");

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchFriends());
      dispatch(fetchIncomingRequests());
      dispatch(fetchOutgoingRequests());
    }
  }, [dispatch, currentUser?.id]);

  if (!currentUser?.id) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <h2 className="text-2xl font-bold text-error mb-4">Debes iniciar sesión para ver tus amigos.</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded-lg gold-gradient text-[#0A0A0F] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
        >
          Ir al Lobby
        </button>
      </div>
    );
  }

  const handleSendRequest = async (e) => {
    e.preventDefault();
    const nick = searchNick.trim();
    if (!nick) return;
    try {
      await dispatch(sendFriendRequest(nick));
      setSearchNick("");
      Swal.fire({ title: "Solicitud enviada", icon: "success", ...swalThemeConfig });
    } catch (error) {
      Swal.fire({
        title: "No se pudo enviar la solicitud",
        text: error.response?.data?.message || "Ese usuario no existe o ya tienen una relación.",
        icon: "error",
        ...swalThemeConfig,
      });
    }
  };

  const handleAccept = async (friendshipId, userId) => {
    try {
      await dispatch(acceptFriendRequest(friendshipId, userId));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo aceptar la solicitud.", icon: "error", ...swalThemeConfig });
    }
  };

  const handleDecline = async (friendshipId, userId) => {
    try {
      await dispatch(declineFriendRequest(friendshipId, userId));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo rechazar la solicitud.", icon: "error", ...swalThemeConfig });
    }
  };

  const handleCancel = async (friendshipId, userId) => {
    try {
      await dispatch(cancelFriendRequest(friendshipId, userId));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo cancelar la solicitud.", icon: "error", ...swalThemeConfig });
    }
  };

  const handleRemove = async (friendshipId, userId, nick) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${nick} de tus amigos?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      ...swalThemeConfig,
    });
    if (!result.isConfirmed) return;
    try {
      await dispatch(removeFriend(friendshipId, userId));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo eliminar la amistad.", icon: "error", ...swalThemeConfig });
    }
  };

  return (
    <main className="flex-grow p-6 md:p-margin-desktop max-w-container-max mx-auto w-full select-none text-on-surface min-h-[85vh] pt-20 md:pt-24">
      <h1 className="font-headline-lg text-headline-lg text-white mb-8">Amigos</h1>

      <form onSubmit={handleSendRequest} className="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="text"
          value={searchNick}
          onChange={(e) => setSearchNick(e.target.value)}
          placeholder="Buscar por nick para agregar..."
          className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
        />
        <button
          type="submit"
          className="royal-gold-gradient text-surface-container-lowest px-6 py-3 rounded-lg font-bold whitespace-nowrap hover:brightness-110 active:scale-95 transition-all cursor-pointer border-0"
        >
          Enviar Solicitud
        </button>
      </form>

      {incoming.length > 0 && (
        <section className="mb-10">
          <h2 className="font-headline-sm text-headline-sm text-white mb-4">Solicitudes Recibidas</h2>
          <div className="space-y-3">
            {incoming.map((req) => (
              <UserRow key={req.friendshipId} user={req.user}>
                <button
                  onClick={() => handleAccept(req.friendshipId, req.user.id)}
                  className="px-4 py-2 rounded-lg gold-gradient text-black text-xs font-bold uppercase tracking-wider cursor-pointer border-0"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => handleDecline(req.friendshipId, req.user.id)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant text-xs font-bold uppercase tracking-wider hover:bg-surface-variant/40 cursor-pointer bg-transparent"
                >
                  Rechazar
                </button>
              </UserRow>
            ))}
          </div>
        </section>
      )}

      {outgoing.length > 0 && (
        <section className="mb-10">
          <h2 className="font-headline-sm text-headline-sm text-white mb-4">Solicitudes Enviadas</h2>
          <div className="space-y-3">
            {outgoing.map((req) => (
              <UserRow key={req.friendshipId} user={req.user}>
                <button
                  onClick={() => handleCancel(req.friendshipId, req.user.id)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant text-xs font-bold uppercase tracking-wider hover:bg-surface-variant/40 cursor-pointer bg-transparent"
                >
                  Cancelar
                </button>
              </UserRow>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-headline-sm text-headline-sm text-white mb-4">
          Mis Amigos {list.length > 0 && <span className="text-on-surface-variant font-body-sm">({list.length})</span>}
        </h2>
        {list.length === 0 ? (
          <p className="text-on-surface-variant">Todavía no tienes amigos agregados.</p>
        ) : (
          <div className="space-y-3">
            {list.map((friend) => (
              <UserRow key={friend.friendshipId} user={friend.user}>
                <button
                  onClick={() => navigate(`/mensajes/${friend.user.nick}`)}
                  className="px-4 py-2 rounded-lg border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary/10 cursor-pointer bg-transparent"
                >
                  Mensaje
                </button>
                <button
                  onClick={() => handleRemove(friend.friendshipId, friend.user.id, friend.user.nick)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant text-xs font-bold uppercase tracking-wider hover:bg-surface-variant/40 cursor-pointer bg-transparent"
                >
                  Eliminar
                </button>
              </UserRow>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
