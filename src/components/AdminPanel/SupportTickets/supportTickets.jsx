import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { swalThemeConfig } from "../../../utils/formatters";
import { fetchAllTickets, fetchTicketDetail, addTicketMessage, updateTicketStatus } from "../../../redux/actions/index";

const STATUS_META = {
  open: { label: "Abierto", className: "bg-primary/10 text-primary border-primary/30" },
  answered: { label: "Respondido", className: "bg-green-500/10 text-green-500 border-green-500/30" },
  closed: { label: "Cerrado", className: "bg-gray-500/10 text-gray-400 border-gray-500/30" },
};

const SENDER_META = {
  user: { align: "bg-surface-container-lowest text-on-surface rounded-bl-sm", label: null },
  admin: { align: "ml-auto royal-gold-gradient text-surface-container-lowest rounded-br-sm", label: "Soporte" },
  system: { align: "bg-surface-container-lowest text-on-surface-variant italic rounded-bl-sm", label: null },
};

export default function SupportTicketsAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allTickets, ticketDetail } = useSelector((state) => state.support);
  const [activeId, setActiveId] = useState(null);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllTickets());
    const interval = setInterval(() => dispatch(fetchAllTickets()), 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleOpenTicket = (id) => {
    setActiveId(id);
    dispatch(fetchTicketDetail(id));
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !activeId) return;
    setSubmitting(true);
    try {
      await dispatch(addTicketMessage(activeId, reply.trim(), true));
      setReply("");
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo enviar la respuesta.", icon: "error", ...swalThemeConfig });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!ticketDetail) return;
    const newStatus = ticketDetail.ticket.status === "closed" ? "open" : "closed";
    try {
      await dispatch(updateTicketStatus(activeId, newStatus));
    } catch (error) {
      Swal.fire({ title: "Error", text: "No se pudo actualizar el estado.", icon: "error", ...swalThemeConfig });
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pt-20 pb-12">
      <div className="px-margin-desktop max-w-container-max mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">Tickets de Soporte</h1>
          <p className="text-on-surface-variant font-body-sm">Consultas de usuarios, respondidas desde acá.</p>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-label-lg hover:bg-surface-variant/20 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          Volver al Panel
        </button>
      </div>

      <div className="px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-[65vh]">
          {/* Ticket list */}
          <div className="border-r border-outline-variant/10 overflow-y-auto">
            {allTickets.length === 0 ? (
              <p className="p-6 text-on-surface-variant text-sm">No hay tickets todavía.</p>
            ) : (
              allTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => handleOpenTicket(ticket.id)}
                  className={`w-full flex flex-col items-start gap-1 p-4 border-b border-outline-variant/10 text-left cursor-pointer bg-transparent transition-colors hover:bg-surface-variant/20 ${
                    activeId === ticket.id ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-white font-bold text-sm truncate">{ticket.subject}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_META[ticket.status].className}`}>
                      {STATUS_META[ticket.status].label}
                    </span>
                  </div>
                  <span className="text-on-surface-variant text-xs">{ticket.userNick}</span>
                </button>
              ))
            )}
          </div>

          {/* Thread */}
          <div className="flex flex-col">
            {ticketDetail && ticketDetail.ticket.id === activeId ? (
              <>
                <div className="flex items-center justify-between gap-3 p-4 border-b border-outline-variant/10">
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate">{ticketDetail.ticket.subject}</p>
                  </div>
                  <button
                    onClick={handleToggleStatus}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant text-xs font-bold uppercase hover:bg-surface-variant/40 cursor-pointer bg-transparent flex-shrink-0"
                  >
                    {ticketDetail.ticket.status === "closed" ? "Reabrir" : "Cerrar Ticket"}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {ticketDetail.messages.map((m) => (
                    <div key={m.id} className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${SENDER_META[m.senderRole].align}`}>
                      {SENDER_META[m.senderRole].label && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">{SENDER_META[m.senderRole].label}</p>
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
                Selecciona un ticket para ver la conversación.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
