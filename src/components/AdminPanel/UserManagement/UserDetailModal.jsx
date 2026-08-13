import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../../api/rutaApi';

const UserDetailModal = ({ user, isOpen, onClose, onUserUpdate }) => {
  const [chipsAmount, setChipsAmount] = useState('');
  const [newRole, setNewRole] = useState(user?.role || 'user');
  const [loading, setLoading] = useState(false);

  const handleAddChips = async () => {
    if (!chipsAmount || isNaN(chipsAmount) || Number(chipsAmount) <= 0) {
      Swal.fire('Error', 'Ingresa una cantidad válida de fichas', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/add/chips`, {
        userId: user.id,
        amount: Number(chipsAmount),
      });
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
      await axios.put(`${API_URL}/remove/chips`, {
        userId: user.id,
        amount: Number(chipsAmount),
      });
      Swal.fire('Éxito', 'Fichas quitadas correctamente', 'success');
      setChipsAmount('');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo quitar fichas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    const confirm = await Swal.fire({
      title: '¿Banear usuario?',
      text: `¿Deseas banear a ${user?.nick}? Esta acción no se puede deshacer fácilmente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, banear',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await axios.put(`${API_URL}/user-ban`, {
        userId: user.id,
        status: true,
      });
      Swal.fire('Éxito', 'Usuario baneado correctamente', 'success');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo banear al usuario', 'error');
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
      await axios.put(`${API_URL}/admin`, {
        userId: user.id,
        role: newRole,
      });
      Swal.fire('Éxito', 'Rol cambiado correctamente', 'success');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo cambiar el rol del usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async () => {
    const confirm = await Swal.fire({
      title: '¿Inactivar usuario?',
      text: `¿Deseas inactivar a ${user?.nick}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, inactivar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await axios.put(`${API_URL}/inactivar-user`, {
        userId: user.id,
        status: true,
      });
      Swal.fire('Éxito', 'Usuario inactivado correctamente', 'success');
      onUserUpdate();
    } catch (error) {
      Swal.fire('Error', 'No se pudo inactivar al usuario', 'error');
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
                € {(user.chips || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
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

          {/* Role Change */}
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

          {/* Danger Zone */}
          <div className="space-y-4 pt-4 border-t border-outline-variant/10">
            <h4 className="font-label-lg text-label-lg text-error uppercase tracking-wider">
              Zona de Peligro
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDeactivateUser}
                disabled={loading}
                className="px-4 py-3 bg-gray-500/10 border border-gray-500/30 text-gray-500 rounded-lg font-semibold hover:bg-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">person_off</span>
                Inactivar
              </button>
              <button
                onClick={handleBanUser}
                disabled={loading || user.banned}
                className="px-4 py-3 bg-error/10 border border-error/30 text-error rounded-lg font-semibold hover:bg-error/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">block</span>
                {user.banned ? 'Baneado' : 'Banear'}
              </button>
            </div>
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
