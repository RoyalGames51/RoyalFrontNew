import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { swalThemeConfig } from "../../utils/formatters";
import { fetchMyTickets, fetchTicketDetail, createTicket, addTicketMessage } from "../../redux/actions/index";

const STATUS_META = {
  open: { label: "Abierto", className: "bg-primary/10 text-primary border-primary/30" },
  answered: { label: "Respondido", className: "bg-green-500/10 text-green-500 border-green-500/30" },
  closed: { label: "Cerrado", className: "bg-gray-500/10 text-gray-400 border-gray-500/30" },
};

const SENDER_META = {
  user: { align: "ml-auto royal-gold-gradient text-surface-container-lowest rounded-br-sm", label: null },
  admin: { align: "bg-primary/15 border border-primary/30 text-white rounded-bl-sm", label: "Soporte RoyalGames" },
  system: { align: "bg-surface-container-lowest text-on-surface-variant italic rounded-bl-sm", label: null },
};

export default function Support() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const currentUser = useSelector((state) => state.currentUser);
  const { myTickets, ticketDetail } = useSelector((state) => state.support);

  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchMyTickets());
    }
  }, [dispatch, currentUser?.id]);

  useEffect(() => {
    if (ticketId) {
      setIsCreating(false);
      dispatch(fetchTicketDetail(ticketId));
    }
  }, [dispatch, ticketId]);

  if (!currentUser?.id) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center my-16 pt-20 md:pt-24">
        <h2 className="text-2xl font-bold text-error mb-4">Debes iniciar sesión para abrir un ticket de ayuda.</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded-lg gold-gradient text-[#0A0A0F] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
        >
          Ir al Lobby
        </button>
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      const data = await dispatch(createTicket(subject.trim(), message.trim()));
      setSubject("");
      setMessage("");
      setIsCreating(false);
      navigate(`/ayuda/${data.ticket.id}`);
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo crear el ticket. Intenta de nuevo.", icon: "error", ...swalThemeConfig });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !ticketDetail) return;
    setSubmitting(true);
    try {
      await dispatch(addTicketMessage(ticketDetail.ticket.id, reply.trim(), false));
      setReply("");
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo enviar tu mensaje.", icon: "error", ...swalThemeConfig });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full select-none text-on-surface min-h-[85vh] pt-20 md:pt-24 px-4 md:px-margin-desktop pb-8">
      <h1 className="font-headline-lg text-headline-lg text-white mb-2">Ayuda</h1>
      <p className="text-on-surface-variant text-sm mb-6">
        Abrí un ticket para cualquier consulta y nuestro equipo te va a responder acá mismo.
      </p>

      <div className="glass-card rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-[70vh]">
        {/* Ticket list */}
        <div className={`border-r border-outline-variant/10 overflow-y-auto flex flex-col ${ticketId || isCreating ? "hidden md:flex" : "flex"}`}>
          <button
            type="button"
            onClick={() => {
              setIsCreating(true);
              navigate("/ayuda");
            }}
            className="m-4 py-2.5 rounded-lg gold-gradient text-black font-bold text-sm uppercase tracking-wider cursor-pointer border-0 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo Ticket
          </button>

          {myTickets.length === 0 ? (
            <p className="p-6 text-on-surface-variant text-sm">Todavía no abriste ningún ticket.</p>
          ) : (
            myTickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => navigate(`/ayuda/${ticket.id}`)}
                className={`w-full flex flex-col items-start gap-1 p-4 border-b border-outline-variant/10 text-left cursor-pointer bg-transparent transition-colors hover:bg-surface-variant/20 ${
                  ticketId === ticket.id ? "bg-primary/10" : ""
                }`}
              >
                <span className="text-white font-bold text-sm truncate w-full">{ticket.subject}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_META[ticket.status].className}`}>
                  {STATUS_META[ticket.status].label}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Active ticket / new ticket form */}
        <div className={`flex flex-col ${ticketId || isCreating ? "flex" : "hidden md:flex"}`}>
          {isCreating ? (
            <form onSubmit={handleCreate} className="p-6 space-y-4 flex flex-col flex-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="md:hidden self-start bg-transparent border-0 text-on-surface-variant cursor-pointer flex items-center gap-1 text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver
              </button>
              <h2 className="font-headline-sm text-headline-sm text-white">Nuevo Ticket</h2>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Asunto</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="¿Sobre qué necesitas ayuda?"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm"
                  required
                />
              </div>
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">Mensaje</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Contanos con el mayor detalle posible..."
                  rows={8}
                  className="w-full flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface input-glow font-body-md text-sm resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg gold-gradient text-black font-bold uppercase tracking-wider cursor-pointer border-0 disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Enviar Ticket"}
              </button>
            </form>
          ) : ticketDetail ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => navigate("/ayuda")}
                  className="md:hidden bg-transparent border-0 text-on-surface-variant cursor-pointer p-1"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-bold truncate">{ticketDetail.ticket.subject}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_META[ticketDetail.ticket.status].className}`}>
                  {STATUS_META[ticketDetail.ticket.status].label}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {ticketDetail.messages.map((m) => (
                  <div key={m.id} className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${SENDER_META[m.senderRole].align}`}>
                    {SENDER_META[m.senderRole].label && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{SENDER_META[m.senderRole].label}</p>
                    )}
                    {m.content}
                  </div>
                ))}
              </div>

              <form onSubmit={handleReply} className="flex items-center gap-3 p-4 border-t border-outline-variant/10">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-2.5 text-on-surface input-glow font-body-md text-sm"
                />
                <button
                  type="submit"
                  disabled={!reply.trim() || submitting}
                  className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black disabled:opacity-40 cursor-pointer border-0 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm p-6 text-center">
              Selecciona un ticket o abrí uno nuevo para empezar.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
