import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  addUserChips,
  removeUserChips,
  setUserRole,
  setUserBanStatus,
  setUserInactiveStatus,
  deleteUserAccount,
  adminSetUserEmail,
  adminSetUserPassword,
  adminSetUserDescription,
  fetchUserActivitySummary,
  fetchUserChipsHistory,
  fetchUserMinesRounds,
  fetchUserBingoActivity,
  fetchUserPaymentsHistory,
  fetchModAudit,
} from '../../../redux/actions';

const fmtChips = (n) => new Intl.NumberFormat('es-ES').format(Number(n) || 0);
const fmtDate = (d) => (d ? new Date(d).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');

// Reused for every "Actividad"/"Auditoría" section — collapsed by default, only fetches its
// detail data (via `fetchFn`) the first time it's expanded, so opening the modal itself stays
// cheap regardless of how much history a user has.
function ActivityAccordion({ title, badge, fetchFn, children: renderContent, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    if (willOpen && data === null && !loading) {
      setLoading(true);
      setError(null);
      try {
        setData(await fetchFn());
      } catch (err) {
        setError('No se pudo cargar la información.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left bg-transparent border-0 cursor-pointer"
      >
        <span className="font-semibold text-on-surface text-sm">{title}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {badge != null && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
              {badge}
            </span>
          )}
          <span className={`material-symbols-outlined text-on-surface-variant text-[18px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-outline-variant/10 pt-3">
          {loading && <p className="text-on-surface-variant text-xs">Cargando...</p>}
          {error && <p className="text-error text-xs">{error}</p>}
          {!loading && !error && data && renderContent(data)}
        </div>
      )}
    </div>
  );
}

function EmptyRow({ text = 'Sin movimientos.' }) {
  return <p className="text-on-surface-variant text-xs py-2">{text}</p>;
}

const UserDetailModal = ({ user, isOpen, onClose, onUserUpdate }) => {
  const dispatch = useDispatch();
  // Cambiar el rol de otro usuario sigue siendo solo para admins reales — todo lo demás en
  // este panel ya está disponible para mods también.
  const viewerIsAdmin = useSelector((state) => state.currentUser?.role) === 'admin';
  const [chipsAmount, setChipsAmount] = useState('');
  const [newRole, setNewRole] = useState(user?.role || 'user');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [newDescription, setNewDescription] = useState(user?.description || '');
  const [loading, setLoading] = useState(false);
  const [activitySummary, setActivitySummary] = useState(null);

  // The modal is a single persistent instance reused for every user, so this keeps the
  // email field from showing a stale value when the admin selects a different user.
  useEffect(() => {
    setNewEmail(user?.email || '');
    setNewDescription(user?.description || '');
    setActivitySummary(null);
    if (user?.id && isOpen) {
      dispatch(fetchUserActivitySummary(user.id)).then(setActivitySummary).catch(() => {});
    }
  }, [user?.id, isOpen]);

  const handleAddChips = async () => {
    if (!chipsAmount || isNaN(chipsAmount) || Number(chipsAmount) <= 0) {
      Swal.fire('Error', 'Ingresa una cantidad válida de fichas', 'error');
      return;
    }

    setLoading(true);
    try {
      await dispatch(addUserChips(user.id, Number(chipsAmount)));
      Swal.fire('Éxito', 'Fichas agregadas correctamente', 'success');
      setChipsAmount('');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo agregar fichas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveChips = async () => {
    if (!chipsAmount || isNaN(chipsAmount) || Number(chipsAmount) <= 0) {
      Swal.fire('Error', 'Ingresa una cantidad válida de fichas', 'error');
      return;
    }

    setLoading(true);
    try {
      await dispatch(removeUserChips(user.id, Number(chipsAmount)));
      Swal.fire('Éxito', 'Fichas quitadas correctamente', 'success');
      setChipsAmount('');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo quitar fichas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async () => {
    const willBan = !user.banned;
    const confirm = await Swal.fire({
      title: willBan ? '¿Banear usuario?' : '¿Desbanear usuario?',
      text: willBan
        ? `¿Deseas banear a ${user?.nick}? No podrá iniciar sesión hasta que lo desbanees.`
        : `¿Deseas restaurar el acceso de ${user?.nick}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: willBan ? 'Sí, banear' : 'Sí, desbanear',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await dispatch(setUserBanStatus(user.id, willBan));
      Swal.fire('Éxito', willBan ? 'Usuario baneado correctamente' : 'Usuario desbaneado correctamente', 'success');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado de baneo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (newRole === user?.role) {
      Swal.fire('Info', 'Selecciona un rol diferente', 'info');
      return;
    }

    setLoading(true);
    try {
      await dispatch(setUserRole(user.id, newRole));
      Swal.fire('Éxito', 'Rol cambiado correctamente', 'success');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo cambiar el rol del usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim() || newEmail.trim() === user?.email) {
      Swal.fire('Info', 'Ingresá un correo distinto al actual', 'info');
      return;
    }
    const confirm = await Swal.fire({
      title: '¿Cambiar el correo de este usuario?',
      text: `Se le va a notificar al nuevo correo (${newEmail.trim()}) que un administrador lo vinculó a esta cuenta.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await dispatch(adminSetUserEmail(user.id, newEmail.trim()));
      Swal.fire('Éxito', 'Correo actualizado correctamente', 'success');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo cambiar el correo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    const confirm = await Swal.fire({
      title: '¿Restablecer la contraseña de este usuario?',
      text: 'Se le va a notificar por correo que un administrador restableció su contraseña.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restablecer',
      cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await dispatch(adminSetUserPassword(user.id, newPassword));
      Swal.fire('Éxito', 'Contraseña restablecida correctamente', 'success');
      setNewPassword('');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo restablecer la contraseña', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDescription = async () => {
    if (newDescription.trim() === (user?.description || '')) {
      Swal.fire('Info', 'No hay cambios en la descripción', 'info');
      return;
    }

    setLoading(true);
    try {
      await dispatch(adminSetUserDescription(user.id, newDescription.trim()));
      Swal.fire('Éxito', 'Descripción actualizada correctamente', 'success');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar la descripción', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInactive = async () => {
    const willDeactivate = !user.inactive;
    const confirm = await Swal.fire({
      title: willDeactivate ? '¿Inactivar usuario?' : '¿Reactivar usuario?',
      text: willDeactivate
        ? `¿Deseas inactivar a ${user?.nick}?`
        : `¿Deseas reactivar a ${user?.nick}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: willDeactivate ? 'Sí, inactivar' : 'Sí, reactivar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await dispatch(setUserInactiveStatus(user.id, willDeactivate));
      Swal.fire('Éxito', willDeactivate ? 'Usuario inactivado correctamente' : 'Usuario reactivado correctamente', 'success');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado del usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    const confirm = await Swal.fire({
      title: '¿Eliminar usuario definitivamente?',
      html: `Esta acción <b>no se puede deshacer</b>. Escribe <b>${user?.nick}</b> para confirmar.`,
      icon: 'error',
      input: 'text',
      inputPlaceholder: 'Nick del usuario',
      showCancelButton: true,
      confirmButtonText: 'Eliminar definitivamente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      inputValidator: (value) => {
        if (value !== user?.nick) {
          return 'El nick no coincide';
        }
      },
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await dispatch(deleteUserAccount(user.id));
      Swal.fire('Éxito', 'Usuario eliminado correctamente', 'success');
      onClose();
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar al usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl border border-outline-variant/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-high border-b border-outline-variant/20 px-8 py-6 flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface">Detalles del Usuario</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-lg transition-colors"
            disabled={loading}
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* User Info */}
          <div className="flex items-center gap-6 pb-6 border-b border-outline-variant/10">
            <div>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.nick}
                  className="w-24 h-24 rounded-full border-2 border-primary/30 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary">person</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{user.nick}</h3>
              <div className="space-y-1 text-sm">
                <p className="text-on-surface-variant">
                  <span className="font-semibold text-on-surface">Email:</span> {user.email}
                </p>
                <p className="text-on-surface-variant">
                  <span className="font-semibold text-on-surface">ID:</span> {user.id}
                </p>
                <p className="text-on-surface-variant">
                  <span className="font-semibold text-on-surface">País:</span> {user.country || 'N/A'}
                </p>
                <p className="text-on-surface-variant">
                  <span className="font-semibold text-on-surface">Género:</span> {user.sexo || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-widest text-primary mb-1">Fichas</p>
              <p className="font-headline-md text-headline-md text-on-surface">
                {new Intl.NumberFormat('es-ES').format(user.chips || 0)}
              </p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-widest text-primary mb-1">Rol</p>
              <p className="font-headline-md text-headline-md text-on-surface capitalize">{user.role}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-4">
            {user.banned && (
              <div className="flex-1 bg-error/10 border border-error/30 rounded-xl p-4">
                <p className="text-error text-sm font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined">block</span>
                  Usuario Baneado
                </p>
              </div>
            )}
            {user.inactive && (
              <div className="flex-1 bg-gray-500/10 border border-gray-500/30 rounded-xl p-4">
                <p className="text-gray-500 text-sm font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined">person_off</span>
                  Usuario Inactivo
                </p>
              </div>
            )}
            {!user.banned && !user.inactive && (
              <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-500 text-sm font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  Usuario Activo
                </p>
              </div>
            )}
          </div>

          {/* Chips Management */}
          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
              Gestión de Fichas
            </h4>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-4">
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Cantidad de fichas"
                  value={chipsAmount}
                  onChange={(e) => setChipsAmount(e.target.value)}
                  className="flex-1 bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  disabled={loading}
                />
                <button
                  onClick={handleAddChips}
                  disabled={loading || !chipsAmount}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Cargando...' : 'Agregar'}
                </button>
                <button
                  onClick={handleRemoveChips}
                  disabled={loading || !chipsAmount}
                  className="px-4 py-2 bg-error text-white rounded-lg font-semibold hover:bg-error/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Cargando...' : 'Quitar'}
                </button>
              </div>
            </div>
          </div>

          {/* Role Change — solo admins reales pueden ascender/degradar roles */}
          {viewerIsAdmin && (
            <div className="space-y-4">
              <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
                Cambiar Rol
              </h4>
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-4">
                <div className="flex gap-3">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="flex-1 bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:border-primary outline-none appearance-none"
                    disabled={loading}
                  >
                    <option value="user">Usuario</option>
                    <option value="mod">Mod</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={handleChangeRole}
                    disabled={loading || newRole === user?.role}
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Cargando...' : 'Cambiar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
              Descripción del Perfil
            </h4>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-4 space-y-3">
              <textarea
                rows={3}
                placeholder="Sin descripción"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                disabled={loading}
              />
              <button
                onClick={handleChangeDescription}
                disabled={loading}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Guardar Descripción
              </button>
            </div>
          </div>

          {/* Activity — collapsed accordions, detail fetched lazily on first expand */}
          <div className="space-y-4" key={`activity-${user.id}`}>
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
              Actividad
            </h4>
            <div className="space-y-2">
              <ActivityAccordion
                title="Fichas"
                badge={activitySummary ? `${activitySummary.chipsMovements} movimientos` : '...'}
                fetchFn={() => dispatch(fetchUserChipsHistory(user.id))}
              >
                {(items) => (items.length === 0 ? <EmptyRow /> : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                        <div className="min-w-0">
                          <p className="text-on-surface capitalize truncate">{it.type.replace('_', ' ')}</p>
                          <p className="text-on-surface-variant">{fmtDate(it.date)}</p>
                        </div>
                        <span className={`font-bold flex-shrink-0 ${it.chips >= 0 ? 'text-green-500' : 'text-error'}`}>
                          {it.chips >= 0 ? '+' : ''}{fmtChips(it.chips)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </ActivityAccordion>

              <ActivityAccordion
                title="Minas"
                badge={activitySummary ? `${activitySummary.mines.totalRounds} rondas` : '...'}
                fetchFn={() => dispatch(fetchUserMinesRounds(user.id))}
              >
                {({ summary, rounds }) => (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div><p className="text-on-surface-variant text-[10px] uppercase">Rondas</p><p className="text-on-surface font-bold text-sm">{summary.totalRounds}</p></div>
                      <div><p className="text-on-surface-variant text-[10px] uppercase">Apostado</p><p className="text-on-surface font-bold text-sm">{fmtChips(summary.totalWagered)}</p></div>
                      <div><p className="text-on-surface-variant text-[10px] uppercase">Ganado</p><p className="text-green-500 font-bold text-sm">{fmtChips(summary.totalWon)}</p></div>
                    </div>
                    {rounds.length === 0 ? <EmptyRow /> : (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto">
                        {rounds.map((r) => (
                          <div key={r.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                            <div className="min-w-0">
                              <p className="text-on-surface capitalize truncate">{r.status.replace('_', ' ')} · {fmtChips(r.betAmount)} fichas</p>
                              <p className="text-on-surface-variant">{fmtDate(r.createdAt)}</p>
                            </div>
                            <span className={`font-bold flex-shrink-0 ${r.status === 'cashed_out' ? 'text-green-500' : 'text-on-surface-variant'}`}>
                              {r.status === 'cashed_out' ? `+${fmtChips(r.accumulatedWinnings)}` : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </ActivityAccordion>

              <ActivityAccordion
                title="Bingo"
                badge={activitySummary ? `${activitySummary.bingo.cardsGiftedSent} cartones regalados` : '...'}
                fetchFn={() => dispatch(fetchUserBingoActivity(user.id))}
              >
                {({ summary, winnings, giftsSent, giftsReceived }) => (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div><p className="text-on-surface-variant text-[10px] uppercase">Ganado</p><p className="text-green-500 font-bold text-sm">{fmtChips(summary.totalWon)}</p></div>
                      <div><p className="text-on-surface-variant text-[10px] uppercase">Cartones dados</p><p className="text-on-surface font-bold text-sm">{summary.cardsGiftedSent}</p></div>
                      <div><p className="text-on-surface-variant text-[10px] uppercase">Cartones recibidos</p><p className="text-on-surface font-bold text-sm">{summary.cardsGiftedReceived}</p></div>
                    </div>
                    {winnings.length === 0 && giftsSent.length === 0 && giftsReceived.length === 0 ? <EmptyRow /> : (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto">
                        {winnings.map((w) => (
                          <div key={w.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                            <div className="min-w-0"><p className="text-on-surface capitalize truncate">Premio · {w.winType}</p><p className="text-on-surface-variant">{fmtDate(w.createdAt)}</p></div>
                            <span className="font-bold text-green-500 flex-shrink-0">+{fmtChips(w.prizeAmount)}</span>
                          </div>
                        ))}
                        {giftsSent.map((g) => (
                          <div key={g.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                            <div className="min-w-0"><p className="text-on-surface truncate">Regaló {g.payload?.quantity} cartones</p><p className="text-on-surface-variant">{fmtDate(g.createdAt)}</p></div>
                          </div>
                        ))}
                        {giftsReceived.map((g) => (
                          <div key={g.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                            <div className="min-w-0"><p className="text-on-surface truncate">Recibió {g.payload?.quantity} cartones</p><p className="text-on-surface-variant">{fmtDate(g.createdAt)}</p></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </ActivityAccordion>

              <ActivityAccordion
                title="Depósitos"
                badge={activitySummary ? `${activitySummary.paymentsCount} pagos` : '...'}
                fetchFn={() => dispatch(fetchUserPaymentsHistory(user.id))}
              >
                {(payments) => (payments.length === 0 ? <EmptyRow text="Sin depósitos registrados." /> : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                        <div className="min-w-0">
                          <p className="text-on-surface truncate">{p.paymentPlatform} · {fmtChips(p.chips)} fichas</p>
                          <p className="text-on-surface-variant">{fmtDate(p.createdAt)}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
                          p.status === 'approved' ? 'text-green-500 bg-green-500/10' : p.status === 'pending' ? 'text-yellow-500 bg-yellow-500/10' : 'text-error bg-error/10'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </ActivityAccordion>
            </div>
          </div>

          {/* Moderator Audit — admin-only, only shown when viewing a mod's own account */}
          {viewerIsAdmin && user.role === 'mod' && (
            <div className="space-y-4">
              <h4 className="font-label-lg text-label-lg text-primary uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">shield_person</span>
                Auditoría de Moderador
              </h4>
              <p className="text-on-surface-variant text-xs -mt-2">
                Solo vos como admin ves esto: lo que este mod hizo desde el panel y jugando.
              </p>
              <ActivityAccordion
                title="Movimientos de este mod"
                badge={null}
                fetchFn={() => dispatch(fetchModAudit(user.id))}
                defaultOpen={false}
              >
                {({ panelGrants, selfGifts, cardGifts }) => (
                  panelGrants.length === 0 && selfGifts.length === 0 && cardGifts.length === 0 ? (
                    <EmptyRow text="Este mod no tiene movimientos registrados." />
                  ) : (
                    <div className="space-y-3">
                      {panelGrants.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Fichas cargadas/quitadas desde el panel</p>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {panelGrants.map((g) => (
                              <div key={g.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                                <div className="min-w-0"><p className="text-on-surface truncate">A {g.recipientNick || 'usuario eliminado'}</p><p className="text-on-surface-variant">{fmtDate(g.createdAt)}</p></div>
                                <span className={`font-bold flex-shrink-0 ${g.amount >= 0 ? 'text-green-500' : 'text-error'}`}>{g.amount >= 0 ? '+' : ''}{fmtChips(g.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selfGifts.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Fichas que se regaló él/ella mismo/a jugando</p>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {selfGifts.map((g) => (
                              <div key={g.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                                <p className="text-on-surface-variant">{fmtDate(g.createdAt)}</p>
                                <span className="font-bold text-error flex-shrink-0">{fmtChips(g.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {cardGifts.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Cartones de bingo que regaló</p>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {cardGifts.map((g) => (
                              <div key={g.id} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-outline-variant/5 last:border-0">
                                <p className="text-on-surface-variant">{fmtDate(g.createdAt)}</p>
                                <span className="font-bold text-on-surface flex-shrink-0">{g.payload?.quantity} cartones</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </ActivityAccordion>
            </div>
          )}

          {/* Account Recovery */}
          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
              Recuperación de Cuenta
            </h4>
            <p className="text-on-surface-variant text-xs -mt-2">
              Usá esto solo si el usuario no puede recuperar su cuenta por sus propios medios (perdió acceso a su correo, etc).
            </p>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">Correo Electrónico</label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="nuevo@correo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={handleChangeEmail}
                    disabled={loading || !newEmail.trim()}
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    Cambiar Correo
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">Nueva Contraseña</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSetPassword}
                    disabled={loading || newPassword.length < 6}
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    Restablecer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4 pt-4 border-t border-outline-variant/10">
            <h4 className="font-label-lg text-label-lg text-error uppercase tracking-wider">
              Zona de Peligro
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleToggleInactive}
                disabled={loading}
                className="px-4 py-3 bg-gray-500/10 border border-gray-500/30 text-gray-500 rounded-lg font-semibold hover:bg-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">person_off</span>
                {user.inactive ? 'Reactivar' : 'Inactivar'}
              </button>
              <button
                onClick={handleToggleBan}
                disabled={loading}
                className="px-4 py-3 bg-error/10 border border-error/30 text-error rounded-lg font-semibold hover:bg-error/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">block</span>
                {user.banned ? 'Desbanear' : 'Banear'}
              </button>
            </div>
            <button
              onClick={handleDeleteUser}
              disabled={loading}
              className="w-full px-4 py-3 bg-error text-white rounded-lg font-semibold hover:bg-error/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">delete_forever</span>
              Eliminar Usuario Definitivamente
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-container-high border-t border-outline-variant/20 px-8 py-4 flex justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-surface-variant rounded-lg font-semibold text-on-surface hover:bg-surface-variant/80 disabled:opacity-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
