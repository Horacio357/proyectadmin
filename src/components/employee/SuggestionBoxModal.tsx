import React, { useState } from 'react';
import { X, Send, Calendar, Clock, MessageSquare } from 'lucide-react';
import { Employee, MonthlyRoster, ShiftCode, SuggestionRequest, SuggestionType } from '../../types';
import { getDaysInMonth, SHIFTS } from '../../data/constants';

interface SuggestionBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Employee;
  employees: Employee[];
  roster: MonthlyRoster;
  onSubmitRequest: (request: SuggestionRequest) => void;
}

export const SuggestionBoxModal: React.FC<SuggestionBoxModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  employees,
  roster,
  onSubmitRequest,
}) => {
  const daysInMonth = getDaysInMonth(roster.anio, roster.mes);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [tipo, setTipo] = useState<SuggestionType>('CAMBIO_TURNO');
  const [turnoDeseado, setTurnoDeseado] = useState<ShiftCode>('M');
  const [motivo, setMotivo] = useState('');

  // Compañeros del mismo puesto para permuta 1 a 1
  const fellowCoworkers = employees.filter(
    (e) => e.activo && e.role === 'OPERATIVO' && e.puesto === currentUser.puesto && e.id !== currentUser.id
  );
  const [selectedCoworkerId, setSelectedCoworkerId] = useState<string>(() => fellowCoworkers[0]?.id || '');

  if (!isOpen) return null;

  const userAssignments = roster.asignaciones[currentUser.id] || {};
  const currentShift = userAssignments[selectedDay] || 'F';

  const selectedCoworker = employees.find((e) => e.id === selectedCoworkerId);
  const coworkerAssignments = selectedCoworker ? roster.asignaciones[selectedCoworker.id] || {} : {};
  const coworkerShift = (coworkerAssignments[selectedDay] || 'F') as ShiftCode;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) return;

    const isPermuta = tipo === 'PERMUTA_1_A_1';

    const newRequest: SuggestionRequest = {
      id: `sug-${Date.now()}`,
      usuarioId: currentUser.id,
      usuarioNombre: `${currentUser.nombre} ${currentUser.apellido}`,
      puesto: currentUser.puesto,
      dia: selectedDay,
      mes: roster.mes,
      anio: roster.anio,
      tipo,
      turnoActual: currentShift,
      turnoDeseado: isPermuta ? coworkerShift : tipo === 'OBSERVACION' ? undefined : turnoDeseado,
      companeroId: isPermuta && selectedCoworker ? selectedCoworker.id : undefined,
      companeroNombre: isPermuta && selectedCoworker ? `${selectedCoworker.nombre} ${selectedCoworker.apellido}` : undefined,
      companeroTurnoActual: isPermuta ? coworkerShift : undefined,
      motivo: motivo.trim(),
      estado: 'PENDIENTE',
      fechaCreacion: new Date().toISOString(),
    };

    onSubmitRequest(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Buzón de Solicitudes & Turnos
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Tipo de Solicitud:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTipo('CAMBIO_TURNO')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-colors ${
                  tipo === 'CAMBIO_TURNO'
                    ? 'bg-sky-50 dark:bg-sky-600/20 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                Cambio Individual
              </button>
              <button
                type="button"
                onClick={() => setTipo('PERMUTA_1_A_1')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-colors ${
                  tipo === 'PERMUTA_1_A_1'
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                🔄 Permuta 1 a 1
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipo('PEDIDO_FRANCO');
                  setTurnoDeseado('F');
                }}
                className={`p-2.5 rounded-xl border text-center font-bold transition-colors ${
                  tipo === 'PEDIDO_FRANCO'
                    ? 'bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                Pedido Franco
              </button>
              <button
                type="button"
                onClick={() => setTipo('OBSERVACION')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-colors ${
                  tipo === 'OBSERVACION'
                    ? 'bg-amber-50 dark:bg-amber-600/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                Observación
              </button>
            </div>
          </div>

          {/* Selector de Día */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Día del Mes:
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-medium focus:ring-1 focus:ring-sky-500"
              >
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Día {d} (Tu turno: {SHIFTS[userAssignments[d] || 'F'].shortLabel})
                  </option>
                ))}
              </select>
            </div>

            {tipo === 'PERMUTA_1_A_1' ? (
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Compañero para canje ({currentUser.puesto}):
                </label>
                <select
                  value={selectedCoworkerId}
                  onChange={(e) => setSelectedCoworkerId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-medium focus:ring-1 focus:ring-sky-500"
                >
                  {fellowCoworkers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido} (Legajo: {c.legajo})
                    </option>
                  ))}
                </select>
              </div>
            ) : tipo !== 'OBSERVACION' ? (
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Turno Solicitado:
                </label>
                <select
                  value={turnoDeseado}
                  onChange={(e) => setTurnoDeseado(e.target.value as ShiftCode)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-medium focus:ring-1 focus:ring-sky-500"
                >
                  {(Object.keys(SHIFTS) as ShiftCode[]).map((code) => (
                    <option key={code} value={code}>
                      {SHIFTS[code].label} ({code})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {/* Tarjeta de Resumen de Permuta 1 a 1 */}
          {tipo === 'PERMUTA_1_A_1' && selectedCoworker && (
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 p-3 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-800 dark:text-indigo-300">
                <span>🔄 Canje Recíproco Pactado (Día {selectedDay})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
                  <span className="text-slate-500 block text-[10px] font-medium">Tú ({currentUser.nombre}):</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-slate-500">{SHIFTS[currentShift].shortLabel} ({currentShift})</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black">➔</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {SHIFTS[coworkerShift].shortLabel} ({coworkerShift})
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
                  <span className="text-slate-500 block text-[10px] font-medium">Compañero ({selectedCoworker.nombre}):</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-slate-500">{SHIFTS[coworkerShift].shortLabel} ({coworkerShift})</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black">➔</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {SHIFTS[currentShift].shortLabel} ({currentShift})
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-indigo-700 dark:text-indigo-300">
                ℹ️ Al ser aprobada la permuta por Gerencia, ambos turnos se intercambiarán automáticamente en el diagrama oficial sin dejar vacante el servicio.
              </p>
            </div>
          )}

          {/* Motivo o Justificación */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Motivo o Justificación (se enviará a Gerencia):
            </label>
            <textarea
              required
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Permuta con compañero por turno médico en hospital de Concepción..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md shadow-sky-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Enviar a Gerencia</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
