import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  User,
  Calendar,
  MessageSquare,
  Bus,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import { MonthlyRoster, SuggestionRequest } from '../../types';
import { POSITION_CONFIG, SHIFTS } from '../../data/constants';

interface RequestsManagerProps {
  suggestions: SuggestionRequest[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string, reason?: string) => void;
  roster: MonthlyRoster;
}

export const RequestsManager: React.FC<RequestsManagerProps> = ({
  suggestions,
  onApproveRequest,
  onRejectRequest,
  roster,
}) => {
  const [filterStatus, setFilterStatus] = useState<'TODAS' | 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'>('TODAS');

  const filtered = suggestions.filter((s) =>
    filterStatus === 'TODAS' ? true : s.estado === filterStatus
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Cabecera y Filtros */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            <span>Buzón de Solicitudes y Cambios de Turno</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Revisión gerencial de pedidos del personal operativo con impacto automático e inmediato en la matriz
          </p>
        </div>

        {/* Filtros de Estado */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('TODAS')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              filterStatus === 'TODAS' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todas ({suggestions.length})
          </button>
          <button
            onClick={() => setFilterStatus('PENDIENTE')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              filterStatus === 'PENDIENTE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Pendientes ({suggestions.filter((s) => s.estado === 'PENDIENTE').length})
          </button>
          <button
            onClick={() => setFilterStatus('APROBADA')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              filterStatus === 'APROBADA'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Aprobadas ({suggestions.filter((s) => s.estado === 'APROBADA').length})
          </button>
          <button
            onClick={() => setFilterStatus('RECHAZADA')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              filterStatus === 'RECHAZADA'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Rechazadas
          </button>
        </div>
      </div>

      {/* Lista de Solicitudes */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm">
            No se encontraron solicitudes con el filtro seleccionado.
          </div>
        ) : (
          filtered.map((sug) => {
            const posConfig = POSITION_CONFIG[sug.puesto];
            const currentTurnoDef = SHIFTS[sug.turnoActual];
            const desiredTurnoDef = sug.turnoDeseado ? SHIFTS[sug.turnoDeseado] : null;

            return (
              <div
                key={sug.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                {/* Info Empleado & Puesto */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{sug.usuarioNombre}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${posConfig.badgeClass}`}>
                      {posConfig.label}
                    </span>
                    {sug.tipo === 'PERMUTA_1_A_1' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
                        🔄 Permuta 1 a 1
                      </span>
                    )}
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      Fecha: {new Date(sug.fechaCreacion).toLocaleDateString('es-AR')}
                    </span>
                  </div>

                  {/* Detalle del cambio */}
                  {sug.tipo === 'PERMUTA_1_A_1' ? (
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-indigo-900 dark:text-indigo-200">
                          Canje pactado Día {sug.dia}:
                        </span>
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-900 font-semibold">
                          <span className="text-slate-700 dark:text-slate-300">{sug.usuarioNombre}</span>
                          <span className="text-slate-500 font-normal">({sug.turnoActual})</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-black">⇄</span>
                          <span className="text-slate-700 dark:text-slate-300">{sug.companeroNombre}</span>
                          <span className="text-slate-500 font-normal">({sug.companeroTurnoActual || sug.turnoDeseado})</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                        * Al aprobar, el sistema intercambiará los turnos de ambos empleados simultáneamente sin dejar vacante el servicio.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Día solicitado: <span className="text-slate-900 dark:text-white font-bold">{sug.dia}</span>
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-500">
                        Turno actual:{' '}
                        <span className="text-slate-700 dark:text-slate-200 font-bold">
                          {currentTurnoDef.label} ({sug.turnoActual})
                        </span>
                      </span>
                      {desiredTurnoDef && (
                        <>
                          <span className="text-slate-400">➔</span>
                          <span className="text-sky-700 dark:text-sky-400 font-bold flex items-center gap-1">
                            Solicita: {desiredTurnoDef.label} ({sug.turnoDeseado})
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <p className="text-slate-600 dark:text-slate-300 italic bg-slate-50/70 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
                    "{sug.motivo}"
                  </p>
                </div>

                {/* Acciones del Administrador */}
                <div className="flex items-center gap-2 shrink-0">
                  {sug.estado === 'PENDIENTE' ? (
                    <>
                      <button
                        onClick={() => onApproveRequest(sug.id)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-700/20 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprobar & Aplicar</span>
                      </button>

                      <button
                        onClick={() => onRejectRequest(sug.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rechazar</span>
                      </button>
                    </>
                  ) : sug.estado === 'APROBADA' ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aprobada en Diagrama</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30">
                      <XCircle className="w-4 h-4" />
                      <span>Rechazada</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
