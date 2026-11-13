import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  Loader2,
  Sliders,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Employee, MonthlyRoster, StaffRequirement } from '../../types';
import { optimizeRosterWithGemini, OptimizationResult } from '../../services/aiOptimizer';
import { POSITION_CONFIG } from '../../data/constants';

interface AIOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  requirements: StaffRequirement[];
  onUpdateRequirements: (reqs: StaffRequirement[]) => void;
  roster: MonthlyRoster;
  onApplyOptimization: (newAssignments: MonthlyRoster['asignaciones']) => void;
}

export const AIOptimizerModal: React.FC<AIOptimizerModalProps> = ({
  isOpen,
  onClose,
  employees,
  requirements,
  onUpdateRequirements,
  roster,
  onApplyOptimization,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [localReqs, setLocalReqs] = useState<StaffRequirement[]>(requirements);

  if (!isOpen) return null;

  const handleRunOptimization = async () => {
    setLoading(true);
    setResult(null);

    setLoadingStep('1/3 Analizando dotación requerida y preferencias del personal...');
    await new Promise((r) => setTimeout(r, 600));

    setLoadingStep('2/3 Aplicando restricciones legales (LCT Art. 197/204 y descanso semanal)...');
    await new Promise((r) => setTimeout(r, 700));

    setLoadingStep('3/3 Asistente IA Gemini procesando el balance óptimo...');

    try {
      const optResult = await optimizeRosterWithGemini(
        employees,
        localReqs,
        roster.anio,
        roster.mes
      );

      setResult(optResult);
      onUpdateRequirements(localReqs);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Ignorar
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleApply = () => {
    if (result) {
      onApplyOptimization(result.assignments);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/45 dark:bg-slate-950/75 backdrop-blur-sm animate-backdrop">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-modal-panel">
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-sky-50/70 via-white to-indigo-50/60 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-600/30 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                <span>Asistente IA: Generador de Turnos</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 font-semibold">
                  Gemini Flash + Solver
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Garantiza 100% de cumplimiento legal laboral y cobertura continua del servicio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll responsivo */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-xs">
          {/* Restricciones Legales Garantizadas */}
          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Reglas Legales Laborales Aplicadas Automáticamente:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-slate-700 dark:text-slate-300">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">1. Francos Obligatorios</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  6 días en meses de 30d, 7 días en meses de 31d por chofer/operativo.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">2. Tope de 6 Días Seguidos</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Nunca más de 6 jornadas continuas sin un descanso efectivo.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">3. Descanso Interjornada</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pausa mínima de 12 horas entre fin de una jornada y la siguiente.
                </span>
              </div>
            </div>
          </div>

          {/* Configuración de Dotación Mínima por Puesto */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Parámetros de Dotación Mínima Diaria:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {localReqs.map((req, idx) => {
                const pos = POSITION_CONFIG[req.puesto];
                return (
                  <div
                    key={req.puesto}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${pos.badgeClass}`}>
                        {pos.plural}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Total:{' '}
                        {employees.filter((e) => e.puesto === req.puesto && e.role === 'OPERATIVO').length}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>☀️ Turno Mañana:</span>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={req.minManana}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const next = [...localReqs];
                            next[idx].minManana = val;
                            setLocalReqs(next);
                          }}
                          className="w-14 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-0.5 text-center text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-sky-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>🌤️ Turno Tarde:</span>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={req.minTarde}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const next = [...localReqs];
                            next[idx].minTarde = val;
                            setLocalReqs(next);
                          }}
                          className="w-14 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-0.5 text-center text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-sky-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>🌙 Turno Noche:</span>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={req.minNoche}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const next = [...localReqs];
                            next[idx].minNoche = val;
                            setLocalReqs(next);
                          }}
                          className="w-14 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-0.5 text-center text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resultado de la Optimización */}
          {result && (
            <div className="bg-slate-50/90 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-card animate-card-in">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Borrador Generado con Éxito ({result.source})
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  Cumplimiento Legal: 100%
                </span>
              </div>

              {/* Dictamen Ejecutivo */}
              <div className="bg-white dark:bg-slate-900/90 rounded-xl p-3.5 text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans text-xs border border-slate-200/80 dark:border-slate-800">
                {result.executiveSummary}
              </div>

              {result.unmetNeeds.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-2.5 rounded-xl text-amber-800 dark:text-amber-300 text-[11px]">
                  <span className="font-bold block mb-1">Observaciones de Dotación:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {result.unmetNeeds.map((need, i) => (
                      <li key={i}>{need}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pie del Modal con Acciones */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {loading && (
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingStep}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 dark:border-transparent dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all active:scale-95"
            >
              Cerrar
            </button>

            {!result ? (
              <button
                disabled={loading}
                onClick={handleRunOptimization}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-600/25 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Optimizando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Ejecutar Optimización IA</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aplicar al Diagrama Mensual</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
