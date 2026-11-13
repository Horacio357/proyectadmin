import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Info,
  CalendarDays,
} from 'lucide-react';
import { Employee, MonthlyRoster, SuggestionRequest } from '../../types';
import {
  DAY_NAMES_SHORT,
  getDayOfWeek,
  getDaysInMonth,
  MONTH_NAMES,
  POSITION_CONFIG,
  SHIFTS,
} from '../../data/constants';
import { auditEmployeeRoster, getRequiredFrancos } from '../../services/legalEngine';
import { SuggestionBoxModal } from './SuggestionBoxModal';

interface EmployeePortalProps {
  currentUser: Employee;
  employees: Employee[];
  roster: MonthlyRoster;
  suggestions: SuggestionRequest[];
  onSubmitRequest: (req: SuggestionRequest) => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  currentUser,
  employees,
  roster,
  suggestions,
  onSubmitRequest,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const posConfig = POSITION_CONFIG[currentUser.puesto];
  const daysInMonth = getDaysInMonth(roster.anio, roster.mes);
  const requiredFrancos = getRequiredFrancos(daysInMonth);

  const userAssignments = roster.asignaciones[currentUser.id] || {};
  const compliance = auditEmployeeRoster(currentUser, userAssignments, roster.anio, roster.mes);

  // Filtrar solicitudes enviadas por este usuario
  const userSuggestions = suggestions.filter((s) => s.usuarioId === currentUser.id);

  // Próximo turno
  const currentDay = 10;
  const nextShiftCode = userAssignments[currentDay] || 'M';
  const nextShiftDef = SHIFTS[nextShiftCode];

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Banner de Bienvenida del Empleado */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 z-10">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-extrabold text-xl sm:text-2xl text-white shadow-md ${
              currentUser.puesto === 'CHOFER'
                ? 'bg-sky-600'
                : currentUser.puesto === 'MECANICO'
                ? 'bg-amber-600'
                : 'bg-emerald-600'
            }`}
          >
            {currentUser.nombre.charAt(0)}
            {currentUser.apellido.charAt(0)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {currentUser.nombre} {currentUser.apellido}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${posConfig.badgeClass}`}>
                {posConfig.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Legajo: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentUser.legajo}</span> •
              Antigüedad: {currentUser.antiguedadAnios} años • Transporte de Pasajeros Tucumán
            </p>
          </div>
        </div>

        {/* Botón Nueva Solicitud */}
        <div className="z-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Solicitar Cambio de Turno / Franco</span>
          </button>
        </div>

        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Métricas y Estado Rápido */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Próximo Turno */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 sm:mb-2">
            <span>Próximo Turno</span>
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-black border ${nextShiftDef.badgeBg}`}>
              {nextShiftCode}
            </span>
            <div className="truncate">
              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm block truncate">
                {nextShiftDef.label}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 block truncate">{nextShiftDef.timeRange}</span>
            </div>
          </div>
        </div>

        {/* Francos Asignados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 sm:mb-2">
            <span>Francos del Mes</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{compliance.totalFrancos}</span>
            <span className="text-xs text-slate-500">/ {requiredFrancos} días</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">Garantizados por ley</span>
        </div>

        {/* Horas Totales */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 sm:mb-2">
            <span>Horas de Servicio</span>
            <CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{compliance.totalHorasMes}</span>
            <span className="text-xs text-slate-500">hs mes</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">Jornadas regulares 8h</span>
        </div>

        {/* Solicitudes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 sm:mb-2">
            <span>Mis Solicitudes</span>
            <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{userSuggestions.length}</span>
            <span className="text-xs text-slate-500">enviadas</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block truncate">
            {userSuggestions.filter((s) => s.estado === 'PENDIENTE').length} pendientes
          </span>
        </div>
      </div>

      {/* Calendario Mensual Visual Responsivo del Operativo */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Mi Diagrama Mensual: {MONTH_NAMES[roster.mes - 1]} {roster.anio}
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Vista individual de turnos y descansos
          </span>
        </div>

        {/* Matriz Calendario mensual adaptativa (2 columnas en móviles pequeños, 4 en medianos, 7 en laptops/desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const shift = userAssignments[day] || 'F';
            const shiftDef = SHIFTS[shift];
            const dayOfWeek = getDayOfWeek(roster.anio, roster.mes, day);
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <div
                key={day}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col justify-between h-20 sm:h-24 ${
                  shiftDef.isRest
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                    : isWeekend
                    ? 'bg-amber-50/40 dark:bg-slate-950/80 border-amber-200 dark:border-slate-700'
                    : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isWeekend ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {DAY_NAMES_SHORT[dayOfWeek]} {day}
                  </span>
                  <span
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center font-black text-xs border ${shiftDef.badgeBg}`}
                  >
                    {shift}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                    {shiftDef.shortLabel}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {shiftDef.timeRange}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historial de Solicitudes y Observaciones */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Mis Solicitudes y Observaciones</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {userSuggestions.length}
          </span>
        </h3>

        {userSuggestions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No has enviado solicitudes aún. Utiliza el botón superior para pedir cambio de turno o franco.
          </div>
        ) : (
          <div className="space-y-3">
            {userSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {sug.tipo === 'CAMBIO_TURNO'
                        ? '🔄 Cambio de Turno'
                        : sug.tipo === 'PEDIDO_FRANCO'
                        ? '🏖️ Pedido de Franco'
                        : '📝 Observación'}
                    </span>
                    <span className="text-slate-500">• Para el Día {sug.dia}</span>
                    {sug.turnoDeseado && (
                      <span className="text-sky-700 dark:text-sky-400 font-bold">
                        (Solicita: {SHIFTS[sug.turnoDeseado].label})
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 italic">"{sug.motivo}"</p>
                </div>

                <div className="flex items-center gap-3">
                  {sug.estado === 'PENDIENTE' && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 font-bold text-xs">
                      En revisión
                    </span>
                  )}
                  {sug.estado === 'APROBADA' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprobada en Diagrama
                    </span>
                  )}
                  {sug.estado === 'RECHAZADA' && (
                    <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 font-bold text-xs">
                      Rechazada
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Enviar Solicitud */}
      <SuggestionBoxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        employees={employees}
        roster={roster}
        onSubmitRequest={onSubmitRequest}
      />
    </div>
  );
};
