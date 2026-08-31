import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api/rutaApi";
import RankBadge from "../ui/RankBadge/rankBadge";
import { fetchConversations, fetchThread, sendMessage } from "../../redux/actions/index";

const POLL_INTERVAL_MS = 30000;

function Avatar({ userId, nick, size = "w-11 h-11" }) {
  const avatarSrc = userId ? `${API_URL}/user/${userId}/avatar-image` : null;
  const initials = (nick || "RG").slice(0, 2).toUpperCase();
  return (
    <div className={`${size} rounded-full overflow-hidden flex-shrink-0 royal-gold-gradient flex items-center justify-center text-surface-container-lowest font-bold text-sm`}>
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={nick}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
}

export default function Messages() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nick } = useParams();
  const currentUser = useSelector((state) => state.currentUser);
  const { conversations, threads } = useSelector((state) => state.messages);

  const [activePartner, setActivePartner] = useState(null); // { id, nick, rank }
  const [messageText, setMessageText] = useState("");
  const threadContainerRef = useRef(null);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchConversations());
    }
  }, [dispatch, currentUser?.id]);

  // Resolve the :nick route param to a userId, reusing the conversations list when possible.
  useEffect(() => {
    if (!nick || !currentUser?.id) return;

    const fromConversations = conversations.find(
      (c) => c.partnerNick?.toLowerCase() === nick.toLowerCase(),
    );
    if (fromConversations) {
      setActivePartner({
        id: fromConversations.partnerId,
        nick: fromConversations.partnerNick,
        rank: fromConversations.partnerRank,
      });
      return;
    }

    let cancelled = false;
    axios.get(`${API_URL}/user-nick?nick=${nick}`).then(({ data }) => {
      if (!cancelled && data?.id) {
        setActivePartner({ id: data.id, nick: data.nick, rank: data.rank });
      }
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [nick, currentUser?.id, conversations]);

  const refreshThread = useCallback(() => {
    if (activePartner?.id) {
      dispatch(fetchThread(activePartner.id));
    }
  }, [dispatch, activePartner?.id]);

  useEffect(() => {
    refreshThread();
  }, [refreshThread]);

  // Poll conversations + active thread periodically instead of a WebSocket connection.
  useEffect(() => {
    if (!currentUser?.id) return;
    const interval = setInterval(() => {
      dispatch(fetchConversations());
      refreshThread();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [dispatch, currentUser?.id, refreshThread]);

  const activeMessages = activePartner?.id ? threads[activePartner.id] || [] : [];

  // Scroll only the message list itself into its latest position — never the outer
  // page. scrollIntoView() would bubble up to every scrollable ancestor, including
  // the whole document, which is what was yanking the page down to the footer.
  useEffect(() => {
    const el = threadContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeMessages.length]);

  if (!currentUser?.id) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <h2 className="text-2xl font-bold text-error mb-4">Debes iniciar sesión para ver tus mensajes.</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded-lg gold-gradient text-[#0A0A0F] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
        >
          Ir al Lobby
        </button>
      </div>
    );
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const content = messageText.trim();
    if (!content || !activePartner?.nick) return;
    setMessageText("");
    try {
      await dispatch(sendMessage(activePartner.nick, content, activePartner.id));
    } catch (error) {
      // keep the draft so the user doesn't lose it on failure
      setMessageText(content);
    }
  };

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full select-none text-on-surface min-h-[85vh] pt-20 md:pt-24 px-4 md:px-margin-desktop pb-8">
      <h1 className="font-headline-lg text-headline-lg text-white mb-6">Mensajes</h1>

      <div className="glass-card rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[70vh] min-h-[420px]">
        {/* Conversation list */}
        <div className={`border-r border-outline-variant/10 overflow-y-auto ${activePartner ? "hidden md:block" : "block"}`}>
          {conversations.length === 0 ? (
            <p className="p-6 text-on-surface-variant text-sm">
              Todavía no tienes conversaciones. Envía un mensaje desde el perfil de otro jugador.
            </p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.partnerId}
                type="button"
                onClick={() => navigate(`/mensajes/${c.partnerNick}`)}
                className={`w-full flex items-center gap-3 p-4 border-b border-outline-variant/10 text-left cursor-pointer bg-transparent transition-colors hover:bg-surface-variant/20 ${
                  activePartner?.id === c.partnerId ? "bg-primary/10" : ""
                }`}
              >
                <Avatar userId={c.partnerId} nick={c.partnerNick} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white font-bold truncate">{c.partnerNick}</span>
                    {c.unreadCount > 0 && (
                      <span className="bg-primary text-black text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-on-surface-variant text-xs truncate">
                    {c.lastSenderId === currentUser.id ? "Tú: " : ""}
                    {c.lastContent}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Active thread */}
        <div className={`flex flex-col ${activePartner ? "flex" : "hidden md:flex"}`}>
          {activePartner ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => navigate("/mensajes")}
                  className="md:hidden bg-transparent border-0 text-on-surface-variant cursor-pointer p-1"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <Avatar userId={activePartner.id} nick={activePartner.nick} size="w-9 h-9" />
                <button
                  type="button"
                  onClick={() => navigate(`/perfil/${activePartner.nick}`)}
                  className="flex items-center gap-2 bg-transparent border-0 cursor-pointer text-left"
                >
                  <span className="text-white font-bold">{activePartner.nick}</span>
                  <RankBadge tier={activePartner.rank} size="sm" />
                </button>
              </div>

              <div ref={threadContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeMessages.length === 0 ? (
                  <p className="text-on-surface-variant text-sm text-center mt-8">
                    Todavía no hay mensajes. ¡Escribe el primero!
                  </p>
                ) : (
                  activeMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                        m.senderId === currentUser.id
                          ? "ml-auto royal-gold-gradient text-surface-container-lowest rounded-br-sm"
                          : "bg-surface-container-lowest text-on-surface rounded-bl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-3 p-4 border-t border-outline-variant/10">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-2.5 text-on-surface input-glow font-body-md text-sm"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black disabled:opacity-40 cursor-pointer border-0 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm p-6 text-center">
              Selecciona una conversación para empezar a chatear.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
