import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../../api/rutaApi';
import UserDetailModal from './UserDetailModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/getUsers`);
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Error al cargar los usuarios. Intenta de nuevo.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.nick?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toString().includes(searchTerm);
    
    const matchesKyc = kycFilter === 'all' || 
      (kycFilter === 'admin' && user.role === 'admin') ||
      (kycFilter === 'user' && user.role === 'user');
    
    const matchesCountry = countryFilter === 'all' || user.country === countryFilter;
    
    return matchesSearch && matchesKyc && matchesCountry;
  });

  const getKycBadge = (user) => {
    // Sin campo KYC en el backend, mostrar role en su lugar
    return (
      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/30 uppercase">
        {user.role === 'admin' ? 'Admin' : 'Usuario'}
      </span>
    );
  };

  const getStatusBadge = (user) => {
    if (user.banned) {
      return (
        <span className="bg-error/10 text-error text-[10px] font-bold px-2 py-1 rounded-full border border-error/30 uppercase">
          Bloqueado
        </span>
      );
    }
    if (user.inactive) {
      return (
        <span className="bg-gray-500/10 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full border border-gray-500/30 uppercase">
          Inactivo
        </span>
      );
    }
    return (
      <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/30 uppercase">
        Activo
      </span>
    );
  };

  const handleActionView = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleActionEdit = (userId) => {
  };

  const handleActionBlock = (userId, currentStatus) => {
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = async () => {
    // Recargar usuarios después de una acción
    try {
      const response = await axios.get(`${API_URL}/getUsers`);
      setUsers(response.data);
      // Actualizar el usuario seleccionado con los datos nuevos
      const updatedUser = response.data.find(u => u.id === selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    } catch (err) {
    }
  };

  if (loading) {
    return (
      <div className="bg-background text-on-background min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-on-surface-variant">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen pt-24 pb-12">
      {/* Header */}
      <div className="px-margin-desktop max-w-container-max mx-auto mb-10">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
              Gestión de Usuarios
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Monitorea la actividad de los jugadores, gestiona el estado de las cuentas y supervisa la liquidez de la plataforma desde un centro de comando centralizado.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/20 flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-primary">Jugadores Totales</span>
              <span className="font-headline-md text-headline-md">{users.length}</span>
            </div>
            <div className="bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/20 flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-primary">Usuarios Activos</span>
              <span className="font-headline-md text-headline-md">
                {users.filter((u) => !u.banned && !u.inactive).length}
              </span>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-6 py-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Search and Filter Bar */}
        <section className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">
                Buscar Identidad
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Nombre, Email o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border border-outline-variant/30 rounded-xl px-10 py-2.5 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">
                Rol de Usuario
              </label>
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-sm focus:border-primary outline-none appearance-none text-on-surface"
              >
                <option value="all">Todos los Roles</option>
                <option value="user">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">
                País
              </label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-sm focus:border-primary outline-none appearance-none text-on-surface"
              >
                <option value="all">Todas las Ubicaciones</option>
                <option value="UK">Reino Unido</option>
                <option value="ES">España</option>
                <option value="DE">Alemania</option>
                <option value="MT">Malta</option>
              </select>
            </div>

            {/* Balance Filter */}
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">
                Nivel de Saldo
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-sm focus:border-primary outline-none text-on-surface"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-sm focus:border-primary outline-none text-on-surface"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Data Table Container */}
      <div className="px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">person_off</span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                No se encontraron usuarios
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-outline-variant/30">
                      <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">
                        Identidad del Usuario
                      </th>
                      <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-center">
                        País
                      </th>
                      <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider">
                        Saldo
                      </th>
                      <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-center">
                        Rol
                      </th>
                      <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-center">
                        Estado
                      </th>
                      <th className="px-6 py-4 font-label-lg text-label-lg text-primary uppercase tracking-wider text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-surface-variant/20 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.nick}
                                  className="w-10 h-10 rounded-full border border-outline-variant/50 object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full border border-outline-variant/50 bg-primary/20 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-primary">person</span>
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-surface rounded-full bg-green-500"></div>
                            </div>
                            <div>
                              <p className="font-label-lg text-label-lg text-on-surface">{user.nick}</p>
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                                ID: {user.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-body-sm text-body-sm text-on-surface">{user.email}</p>
                          <p className="text-[10px] text-on-surface-variant">Sexo: {user.sexo || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <p className="text-[10px] text-on-surface-variant">{user.country || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-label-lg text-label-lg text-primary">
                            € {(user.chips || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                          </p>
                          <div className="w-full bg-outline-variant/20 h-1 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{ width: `${Math.min((user.chips || 0) / 100000, 100)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {getKycBadge(user)}
                        </td>
                        <td className="px-6 py-5 text-center">
                          {getStatusBadge(user)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleActionView(user)}
                              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                              title="Ver detalles"
                            >
                              <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </button>
                            <button 
                              onClick={() => handleActionEdit(user.id)}
                              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button 
                              onClick={() => handleActionBlock(user.id, user.banned)}
                              className="p-2 text-on-surface-variant hover:text-error transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {user.banned ? 'lock_open' : 'block'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-surface-container-high border-t border-outline-variant/10 flex justify-between items-center">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Mostrando {filteredUsers.length} de {users.length} registros
                </p>
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-md text-label-md">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal 
        user={selectedUser} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  );
};

export default UserManagement;
