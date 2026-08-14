import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../api/rutaApi";

export default function AdminReferrals() {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/admin/referrals`);
        setReferrals(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const converted = referrals.filter((r) => r.firstDepositAt);

  return (
    <div className="bg-background text-on-background min-h-screen pt-20 pb-12">
      <div className="px-margin-desktop max-w-container-max mx-auto mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">Referidos</h1>
            <p className="text-on-surface-variant font-body-sm">
              Quién invitó a quién y si el invitado ya cargó fichas. Los premios a quien refiere se otorgan manualmente, fuera de la plataforma.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-label-lg hover:bg-surface-variant/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Volver al Panel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/20 flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-primary">Total Referidos</span>
            <span className="font-headline-md text-headline-md">{referrals.length}</span>
          </div>
          <div className="bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/20 flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-primary">Con Carga Realizada</span>
            <span className="font-headline-md text-headline-md">{converted.length}</span>
          </div>
        </div>
      </div>

      <div className="px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-on-surface-variant">Cargando referidos...</span>
            </div>
          ) : referrals.length === 0 ? (
            <p className="p-12 text-center text-on-surface-variant">Todavía no hay referidos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant/30">
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">Referidor</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">Código</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">Referido</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">Se Registró</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-right">Primera Carga</th>
                    <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {referrals.map((r) => (
                    <tr key={r.referredId} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/perfil/${r.referrerNick}`)}
                          className="font-bold text-white hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
                        >
                          {r.referrerNick}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm tracking-widest">{r.referrerCode}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/perfil/${r.referredNick}`)}
                          className="font-bold text-white hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
                        >
                          {r.referredNick}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">
                        {new Date(r.referredSignupAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary">
                        {r.firstDepositAt ? new Intl.NumberFormat('es-ES').format(r.firstDepositChips) : "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            r.firstDepositAt ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {r.firstDepositAt ? "Convertido" : "Sin Carga"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
