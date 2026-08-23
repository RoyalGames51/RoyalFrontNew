import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API_URL from "../../../api/rutaApi";

const STATUS_META = {
  approved: { label: "Aprobado", className: "bg-green-500/10 text-green-400" },
  pending: { label: "Pendiente", className: "bg-amber-500/10 text-amber-400" },
  rejected: { label: "Rechazado", className: "bg-error/10 text-error" },
  cancelled: { label: "Cancelado", className: "bg-gray-500/10 text-gray-400" },
  refunded: { label: "Reembolsado", className: "bg-gray-500/10 text-gray-400" },
};

const PLATFORM_LABELS = {
  paypal: "PayPal",
  mepago: "Mercado Pago",
  mepago_mx: "Mercado Pago (MX)",
};

export default function AdminDeposits() {
  const navigate = useNavigate();
  const viewerIsAdmin = useSelector((state) => state.currentUser?.role) === "admin";
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!viewerIsAdmin) {
      setLoading(false);
      return;
    }
    const fetchDeposits = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/admin/deposits`);
        setDeposits(data);
      } catch (error) {
        if (error.response?.status === 403) setForbidden(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, [viewerIsAdmin]);

  const filtered = statusFilter === "all" ? deposits : deposits.filter((d) => d.status === statusFilter);

  const approvedTotal = deposits
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + Number(d.chips || 0), 0);

  // El listado global de cargas es un resumen de dinero de toda la plataforma — solo-admin.
  // Los mods pueden seguir viendo los depósitos de UN cliente puntual, desde la sección
  // "Actividad" en el detalle de ese usuario (UserDetailModal), no acá.
  if (!viewerIsAdmin || forbidden) {
    return (
      <div className="bg-background text-on-background min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">lock</span>
          <h2 className="font-headline-md text-headline-md text-white mb-2">Acceso Restringido</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            El listado completo de cargas es solo para administradores. Si necesitás ver los depósitos de un cliente puntual, buscalo en Usuarios y abrí su Actividad.
          </p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-label-lg hover:bg-surface-variant/20 transition-all"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen pt-20 pb-12">
      <div className="px-margin-desktop max-w-container-max mx-auto mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">Cargas de Fichas</h1>
            <p className="text-on-surface-variant font-body-sm">Registro completo de depósitos: dinero ingresado y fichas cargadas.</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-label-lg hover:bg-surface-variant/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Volver al Panel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/20 flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-primary">Cargas Mostradas</span>
            <span className="font-headline-md text-headline-md">{deposits.length}</span>
          </div>
          <div className="bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/20 flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-primary">Fichas Aprobadas (Total)</span>
            <span className="font-headline-md text-headline-md">{new Intl.NumberFormat('es-ES').format(approvedTotal)}</span>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 block">Filtrar por Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-sm focus:border-primary outline-none appearance-none text-on-surface"
            >
              <option value="all">Todos</option>
              <option value="approved">Aprobado</option>
              <option value="pending">Pendiente</option>
              <option value="rejected">Rechazado</option>
              <option value="cancelled">Cancelado</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-on-surface-variant">Cargando depósitos...</span>
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-12 text-center text-on-surface-variant">No hay depósitos para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant/30">
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">Plataforma</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-right">Monto Pagado</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-right">Fichas</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filtered.map((deposit) => {
                    const statusMeta = STATUS_META[deposit.status] || { label: deposit.status, className: "bg-gray-500/10 text-gray-400" };
                    return (
                      <tr key={deposit.id} className="hover:bg-surface-variant/20 transition-colors">
                        <td className="px-6 py-4 text-on-surface text-sm">
                          {new Date(deposit.createdAt).toLocaleString('es-ES', {
                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/perfil/${deposit.userNick}`)}
                            className="font-bold text-white hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
                          >
                            {deposit.userNick}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant text-sm">
                          {PLATFORM_LABELS[deposit.paymentPlatform] || deposit.paymentPlatform || "—"}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-white">
                          {deposit.price}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-primary">
                          {new Intl.NumberFormat('es-ES').format(deposit.chips)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
