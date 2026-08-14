import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../../../api/rutaApi";
import { swalThemeConfig } from "../../../utils/formatters";

const PERIOD_META = {
  weekly: { label: "Semanales", periodLabel: "esta semana" },
  monthly: { label: "Mensuales", periodLabel: "este mes" },
};

function PrizePeriodCard({ period }) {
  const meta = PERIOD_META[period];
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [awarding, setAwarding] = useState(false);

  const fetchPreview = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/admin/prizes/${period}/preview`);
      setPreview(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAward = async () => {
    const result = await Swal.fire({
      title: `¿Otorgar premios ${meta.label.toLowerCase()}?`,
      text: `Se acreditarán las fichas a los ganadores de ${meta.periodLabel} (${preview?.periodKey}). Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Otorgar Premios",
      cancelButtonText: "Cancelar",
      ...swalThemeConfig,
    });
    if (!result.isConfirmed) return;

    setAwarding(true);
    try {
      await axios.post(`${API_URL}/admin/prizes/${period}/award`);
      Swal.fire({ icon: "success", title: "¡Premios otorgados!", confirmButtonColor: "#C9A84C" });
      fetchPreview();
    } catch (error) {
      Swal.fire({
        title: "No se pudieron otorgar los premios",
        text: error.response?.data?.message || "Inténtalo de nuevo más tarde.",
        icon: "error",
        ...swalThemeConfig,
      });
    } finally {
      setAwarding(false);
    }
  };

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-white">Premios {meta.label}</h3>
          {preview && <p className="text-on-surface-variant text-xs mt-1">Período: {preview.periodKey}</p>}
        </div>
        {preview?.alreadyAwarded && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400">
            Ya otorgado
          </span>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !preview || preview.topPlayers.length === 0 ? (
          <p className="text-on-surface-variant text-sm text-center py-4">Todavía no hay ganadores en este período.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {preview.topPlayers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 rounded bg-surface-container-high">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-bold text-primary flex-shrink-0">#{index + 1}</span>
                  <span className="font-bold text-white truncate">{player.nick}</span>
                  <span className="text-on-surface-variant text-xs flex-shrink-0">
                    ({new Intl.NumberFormat('es-ES').format(player.totalWon)} ganadas)
                  </span>
                </div>
                <span className="font-bold text-primary flex-shrink-0">
                  +{new Intl.NumberFormat('es-ES').format(preview.amounts[index])}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAward}
          disabled={awarding || loading || preview?.alreadyAwarded || !preview?.topPlayers?.length}
          className="w-full py-3 rounded-lg gold-gradient text-black font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0"
        >
          {awarding ? "Otorgando..." : preview?.alreadyAwarded ? "Ya Otorgado" : "Otorgar Premios"}
        </button>
      </div>
    </div>
  );
}

export default function AdminPrizes() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-background min-h-screen pt-20 pb-12">
      <div className="px-margin-desktop max-w-container-max mx-auto mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">Premios de Ranking</h1>
            <p className="text-on-surface-variant font-body-sm">
              Top 5 jugadores por fichas ganadas en todos los juegos combinados. Revisá y otorgá los premios semanales y mensuales.
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
      </div>

      <div className="px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrizePeriodCard period="weekly" />
        <PrizePeriodCard period="monthly" />
      </div>
    </div>
  );
}
