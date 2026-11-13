import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Bus,
  Wrench,
  ShieldCheck,
  Search,
  Phone,
  Mail,
  Award,
  Clock,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  FileCheck2,
} from 'lucide-react';
import { Employee, JobPosition, ProfileStatus } from '../../types';
import { POSITION_CONFIG } from '../../data/constants';

interface StaffManagerProps {
  employees: Employee[];
  onUpdateEmployee: (updated: Employee) => void;
  onAddEmployee: (newEmp: Employee) => void;
  onApproveProfile?: (employeeId: string) => void;
  onDenyProfile?: (employeeId: string, reason: string) => void;
}

export const StaffManager: React.FC<StaffManagerProps> = ({
  employees,
  onUpdateEmployee,
  onAddEmployee,
  onApproveProfile,
  onDenyProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPuesto, setSelectedPuesto] = useState<JobPosition | 'TODOS'>('TODOS');
  const [profileTab, setProfileTab] = useState<'APROBADOS' | 'PENDIENTES' | 'DENEGADOS'>('APROBADOS');
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal para denegar perfil
  const [denyingEmployee, setDenyingEmployee] = useState<Employee | null>(null);
  const [denyReason, setDenyReason] = useState('');

  // Formulario nuevo empleado
  const [newNombre, setNewNombre] = useState('');
  const [newApellido, setNewApellido] = useState('');
  const [newLegajo, setNewLegajo] = useState('');
  const [newPuesto, setNewPuesto] = useState<JobPosition>('CHOFER');
  const [newPreferencia, setNewPreferencia] = useState<'M' | 'T' | 'N' | 'ROTATIVO'>('M');
  const [newTelefono, setNewTelefono] = useState('');
  const [newCrearComo, setNewCrearComo] = useState<ProfileStatus>('APROBADO');

  // Separación por estado de perfil
  const approvedEmployees = employees.filter(
    (e) => e.role === 'OPERATIVO' && (e.estadoPerfil === 'APROBADO' || e.estadoPerfil === undefined)
  );
  const pendingEmployees = employees.filter(
    (e) => e.role === 'OPERATIVO' && e.estadoPerfil === 'PENDIENTE'
  );
  const deniedEmployees = employees.filter(
    (e) => e.role === 'OPERATIVO' && e.estadoPerfil === 'DENEGADO'
  );

  const currentList =
    profileTab === 'APROBADOS'
      ? approvedEmployees
      : profileTab === 'PENDIENTES'
      ? pendingEmployees
      : deniedEmployees;

  const filteredEmployees = currentList.filter((emp) => {
    if (selectedPuesto !== 'TODOS' && emp.puesto !== selectedPuesto) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      emp.nombre.toLowerCase().includes(term) ||
      emp.apellido.toLowerCase().includes(term) ||
      emp.legajo.toLowerCase().includes(term)
    );
  });

  const handleApprove = (emp: Employee) => {
    if (onApproveProfile) {
      onApproveProfile(emp.id);
    } else {
      onUpdateEmployee({
        ...emp,
        estadoPerfil: 'APROBADO',
        activo: true,
        motivoRechazo: undefined,
      });
    }
  };

  const handleOpenDenyModal = (emp: Employee) => {
    setDenyingEmployee(emp);
    setDenyReason('Documentación incompleta o licencia inhabilitada.');
  };

  const handleConfirmDeny = (e: React.FormEvent) => {
    e.preventDefault();
    if (!denyingEmployee) return;

    if (onDenyProfile) {
      onDenyProfile(denyingEmployee.id, denyReason);
    } else {
      onUpdateEmployee({
        ...denyingEmployee,
        estadoPerfil: 'DENEGADO',
        activo: false,
        motivoRechazo: denyReason,
      });
    }
    setDenyingEmployee(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre || !newApellido || !newLegajo) return;

    const isDirectApproved = newCrearComo === 'APROBADO';

    const newEmp: Employee = {
      id: `emp-new-${Date.now()}`,
      legajo: newLegajo.toUpperCase().trim(),
      nombre: newNombre.trim(),
      apellido: newApellido.trim(),
      email: `${newNombre.toLowerCase()}.${newApellido.toLowerCase()}@transporte-tucuman.com.ar`,
      role: 'OPERATIVO',
      puesto: newPuesto,
      preferenciaTurno: newPreferencia,
      activo: isDirectApproved,
      estadoPerfil: newCrearComo,
      telefono: newTelefono || '381-455-1234',
      antiguedadAnios: 0,
    };

    onAddEmployee(newEmp);
    setShowAddModal(false);
    setNewNombre('');
    setNewApellido('');
    setNewLegajo('');
    setNewTelefono('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Cabecera y Acciones */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Gestión y Homologación de Personal</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validación gerencial de postulantes y administración de choferes, mecánicos e inspectores
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Personal</span>
        </button>
      </div>

      {/* Selector de Pestañas de Homologación de Perfiles */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setProfileTab('APROBADOS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            profileTab === 'APROBADOS'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Personal Aprobado y Activo ({approvedEmployees.length})</span>
        </button>

        <button
          onClick={() => setProfileTab('PENDIENTES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all relative ${
            profileTab === 'PENDIENTES'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/20'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Pendientes de Aprobación ({pendingEmployees.length})</span>
          {pendingEmployees.length > 0 && (
            <span className="flex h-2.5 w-2.5 absolute -top-1 -right-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => setProfileTab('DENEGADOS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            profileTab === 'DENEGADOS'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Perfiles Denegados ({deniedEmployees.length})</span>
        </button>
      </div>

      {/* Filtros de Puesto y Búsqueda */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        {/* Puestos */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setSelectedPuesto('TODOS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedPuesto === 'TODOS' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedPuesto('CHOFER')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedPuesto === 'CHOFER' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Choferes
          </button>
          <button
            onClick={() => setSelectedPuesto('MECANICO')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedPuesto === 'MECANICO' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Mecánicos
          </button>
          <button
            onClick={() => setSelectedPuesto('INSPECTOR')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedPuesto === 'INSPECTOR' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Inspectores
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o legajo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-56 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Grid de Tarjetas de Empleados según Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm">
            {profileTab === 'PENDIENTES'
              ? 'No hay perfiles pendientes de aprobación en este momento.'
              : profileTab === 'DENEGADOS'
              ? 'No hay perfiles denegados registrados.'
              : 'No se encontraron empleados aprobados con el filtro seleccionado.'}
          </div>
        ) : (
          filteredEmployees.map((emp) => {
            const posConfig = POSITION_CONFIG[emp.puesto];
            const isPending = emp.estadoPerfil === 'PENDIENTE';
            const isDenied = emp.estadoPerfil === 'DENEGADO';

            return (
              <div
                key={emp.id}
                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition-all flex flex-col justify-between ${
                  isPending
                    ? 'border-amber-300 dark:border-amber-700/60 bg-amber-50/20'
                    : isDenied
                    ? 'border-rose-200 dark:border-rose-800/40 opacity-75'
                    : posConfig.borderAccent
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        {emp.nombre} {emp.apellido}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs">
                        <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">{emp.legajo}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${posConfig.badgeClass}`}>
                          {posConfig.label}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                        emp.puesto === 'CHOFER'
                          ? 'bg-sky-600'
                          : emp.puesto === 'MECANICO'
                          ? 'bg-amber-600'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {emp.puesto === 'CHOFER' && <Bus className="w-4 h-4" />}
                      {emp.puesto === 'MECANICO' && <Wrench className="w-4 h-4" />}
                      {emp.puesto === 'INSPECTOR' && <ShieldCheck className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Estado de Perfil */}
                  <div className="mb-3">
                    {isPending && (
                      <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Perfil Postulante: Requiere validación de Gerencia</span>
                      </div>
                    )}
                    {isDenied && (
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-[11px]">
                        <span className="font-bold block">❌ Perfil Denegado</span>
                        <span className="text-[10px] opacity-90">{emp.motivoRechazo || 'Sin motivo especificado.'}</span>
                      </div>
                    )}
                  </div>

                  {/* Detalles y Preferencia de Turno */}
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Preferencia:</span>
                      </span>
                      <select
                        value={emp.preferenciaTurno}
                        disabled={isDenied}
                        onChange={(e) => {
                          onUpdateEmployee({
                            ...emp,
                            preferenciaTurno: e.target.value as any,
                          });
                        }}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-sky-700 dark:text-sky-400 font-bold text-xs cursor-pointer focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="M">Mañana (06:00 - 14:00)</option>
                        <option value="T">Tarde (14:00 - 22:00)</option>
                        <option value="N">Noche (22:00 - 06:00)</option>
                        <option value="ROTATIVO">Rotativo Semanal</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Contacto:</span>
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-400">{emp.telefono || '381-455-1234'}</span>
                    </div>
                  </div>
                </div>

                {/* Acciones de Validación para el Super Administrador */}
                <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleApprove(emp)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aceptar Perfil</span>
                      </button>

                      <button
                        onClick={() => handleOpenDenyModal(emp)}
                        className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Denegar</span>
                      </button>
                    </>
                  ) : isDenied ? (
                    <button
                      onClick={() => handleApprove(emp)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reconsiderar y Habilitar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenDenyModal(emp)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-950 hover:text-rose-600 text-slate-500 text-[11px] font-medium border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                      <XCircle className="w-3 h-3 text-slate-400" />
                      <span>Suspender o Inhabilitar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal para Denegar / Inhabilitar Perfil */}
      {denyingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>Denegar / Suspender Perfil</span>
              </h3>
              <button
                onClick={() => setDenyingEmployee(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDeny} className="space-y-4 text-xs">
              <p className="text-slate-700 dark:text-slate-300">
                Estás por denegar el perfil de{' '}
                <strong className="text-slate-900 dark:text-white">
                  {denyingEmployee.nombre} {denyingEmployee.apellido} ({denyingEmployee.puesto})
                </strong>
                . El empleado no podrá ser asignado a turnos en el diagrama mensual.
              </p>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Motivo de la Denegación:
                </label>
                <textarea
                  required
                  rows={3}
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:ring-1 focus:ring-rose-500"
                  placeholder="Ej: Falta homologación de antecedentes o examen médico..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDenyingEmployee(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Confirmar Denegación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Nuevo Empleado */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span>Alta y Registro de Personal</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Nombre:</label>
                  <input
                    type="text"
                    required
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500"
                    placeholder="Lucas"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Apellido:</label>
                  <input
                    type="text"
                    required
                    value={newApellido}
                    onChange={(e) => setNewApellido(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500"
                    placeholder="Ceballos"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Legajo:</label>
                  <input
                    type="text"
                    required
                    value={newLegajo}
                    onChange={(e) => setNewLegajo(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono uppercase focus:ring-1 focus:ring-sky-500"
                    placeholder="CH-120"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Puesto Laboral:</label>
                  <select
                    value={newPuesto}
                    onChange={(e) => setNewPuesto(e.target.value as JobPosition)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 font-medium"
                  >
                    <option value="CHOFER">Chofer (Línea)</option>
                    <option value="MECANICO">Mecánico (Taller)</option>
                    <option value="INSPECTOR">Inspector (Control)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Preferencia:</label>
                  <select
                    value={newPreferencia}
                    onChange={(e) => setNewPreferencia(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 font-medium"
                  >
                    <option value="M">Mañana (06:00 - 14:00)</option>
                    <option value="T">Tarde (14:00 - 22:00)</option>
                    <option value="N">Noche (22:00 - 06:00)</option>
                    <option value="ROTATIVO">Rotativo Semanal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={newTelefono}
                    onChange={(e) => setNewTelefono(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-sky-500"
                    placeholder="381-455-9988"
                  />
                </div>
              </div>

              {/* Estado Inicial de Homologación */}
              <div className="pt-1">
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Estado Inicial de Validación:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCrearComo('APROBADO')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      newCrearComo === 'APROBADO'
                        ? 'bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Directamente Aprobado
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCrearComo('PENDIENTE')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      newCrearComo === 'PENDIENTE'
                        ? 'bg-amber-50 dark:bg-amber-600/20 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-500'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Pendiente de Aprobación
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Guardar Personal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
