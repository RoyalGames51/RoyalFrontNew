import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminOverview } from '../../../redux/actions';
import { RANK_META } from '../../../utils/rank';

const numberFormat = (n) => new Intl.NumberFormat('es-ES').format(n || 0);

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'justo ahora';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const overview = useSelector((state) => state.adminOverview);
  // Money summaries (circulation/deposited totals, recent-payments feed) are admin-only — the
  // backend already strips them from the response for mods, this just keeps the UI from trying
  // to render fields that no longer exist instead of duplicating the role check pointlessly.
  const viewerIsAdmin = useSelector((state) => state.currentUser?.role) === 'admin';

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  const kpis = overview
    ? [
        { id: 1, title: 'Usuarios Totales', value: numberFormat(overview.totalUsers), icon: 'group' },
        { id: 2, title: 'Conectados Ahora', value: numberFormat(overview.onlineUsers), icon: 'bolt', isPositive: true },
        { id: 3, title: 'Nuevos Hoy', value: numberFormat(overview.newSignupsToday), icon: 'person_add', isPositive: true },
        { id: 4, title: 'Usuarios Baneados', value: numberFormat(overview.bannedUsers), icon: 'block', isPositive: false },
        ...(viewerIsAdmin
          ? [
              { id: 5, title: 'Fichas en Circulación', value: numberFormat(overview.totalChipsInCirculation), icon: 'payments' },
              { id: 6, title: 'Fichas Depositadas (Total)', value: numberFormat(overview.totalChipsDeposited), icon: 'account_balance_wallet' },
            ]
          : []),
      ]
    : [];

  if (!overview) {
    return (
      <div className="bg-background text-on-background min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen pt-20 pb-12">
      <div className="px-margin-desktop max-w-container-max mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">
              Panel de Operaciones
            </h1>
            <p className="text-on-surface-variant font-body-sm">
              Métricas en tiempo real de la plataforma: usuarios, fichas y actividad reciente.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold font-label-lg hover:brightness-110 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            Gestionar Usuarios
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="bg-surface-container p-6 border border-outline-variant/20 rounded-xl hover:border-primary/40 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                  {kpi.icon}
                </span>
              </div>
              <p className="text-on-surface-variant font-label-md uppercase tracking-wider text-[10px]">
                {kpi.title}
              </p>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                {kpi.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Deposits today + staff summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-surface-container border border-outline-variant/20 rounded-xl p-6">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-4">Depósitos de Hoy</h4>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Transacciones</p>
                <p className="font-headline-md text-headline-md text-primary">{numberFormat(overview.depositsTodayCount)}</p>
              </div>
              {viewerIsAdmin && (
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Fichas Depositadas</p>
                  <p className="font-headline-md text-headline-md text-primary">{numberFormat(overview.depositsTodayChips)}</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-surface-container border border-outline-variant/20 rounded-xl p-6">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-4">Equipo</h4>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Admins</p>
                <p className="font-headline-md text-headline-md text-primary">{numberFormat(overview.adminCount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Mods</p>
                <p className="font-headline-md text-headline-md text-primary">{numberFormat(overview.modCount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Inactivos</p>
                <p className="font-headline-md text-headline-md text-on-surface">{numberFormat(overview.inactiveUsers)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Top Players */}
        <div className={`grid grid-cols-1 ${viewerIsAdmin ? 'lg:grid-cols-2' : ''} gap-4`}>
          {/* Recent Activity — a platform-wide money feed, admin-only */}
          {viewerIsAdmin && (
            <div className="bg-surface-container border border-outline-variant/20 rounded-xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10">
                <h4 className="font-headline-sm text-headline-sm text-on-surface">
                  Depósitos Recientes
                </h4>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6 max-h-[420px]">
                {overview.recentPayments.length === 0 ? (
                  <p className="text-on-surface-variant text-sm">Todavía no hay depósitos registrados.</p>
                ) : (
                  overview.recentPayments.map((payment, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center shrink-0 bg-surface-container-high">
                        <span className="material-symbols-outlined text-[18px] text-primary">payments</span>
                      </div>
                      <div>
                        <p className="text-body-sm text-on-surface">
                          <span className="font-bold text-primary">{payment.nick}</span>{' '}
                          depositó{' '}
                          <span className="text-primary font-bold">{numberFormat(payment.chips)} fichas</span>
                          {' '}vía {payment.paymentPlatform}
                        </p>
                        <p className="text-[11px] text-on-surface-variant mt-1">{timeAgo(payment.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Top Players by Chips */}
          <div className="bg-surface-container border border-outline-variant/20 rounded-xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                Top Jugadores por Fichas
              </h4>
            </div>

            <div className="p-6 space-y-3 overflow-y-auto max-h-[420px]">
              {overview.topByChips.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-bold text-primary w-5 flex-shrink-0">{index + 1}</span>
                    <span className="font-bold text-on-surface truncate">{player.nick}</span>
                    {RANK_META[player.rank] && (
                      <span className={`text-[10px] font-bold uppercase flex-shrink-0 ${RANK_META[player.rank].className}`}>
                        {RANK_META[player.rank].label}
                      </span>
                    )}
                  </div>
                  <span className="text-primary font-bold flex-shrink-0">{numberFormat(player.chips)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
