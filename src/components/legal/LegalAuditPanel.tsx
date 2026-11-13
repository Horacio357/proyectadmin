import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Sparkles,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
} from 'lucide-react';
import { RosterAuditSummary, Employee, MonthlyRoster } from '../../types';
import { ESTIMATED_FINE_PER_VIOLATION_ARS } from '../../data/constants';

interface LegalAuditPanelProps {
  auditSummary: RosterAuditSummary;
  roster: MonthlyRoster;
  onOpenAIOptimizer: () => void;
}

export const LegalAuditPanel: React.FC<LegalAuditPanelProps> = ({
  auditSummary,
  roster,
  onOpenAIOptimizer,
}) => {
  const compliancePercent =
    auditSummary.totalEmployees > 0
      ? Math.round((auditSummary.totalCompliant / auditSummary.totalEmployees) * 100)
      : 100;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Banner Principal de Cumplimiento Legal */}
      <div
        className={`bg-gradient-to-br from-white via-white ${
          auditSummary.totalViolations > 0 ? 'to-rose-50/60' : 'to-emerald-50/70'
        } dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-card relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6`}
      >
        <div className="flex items-center gap-3 sm:gap-4 z-10">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-sm ${
              auditSummary.totalViolations > 0
                ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200/90 dark:border-rose-500/30'
                : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/90 dark:border-emerald-500/30'
            }`}
          >
            <Scale className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Auditoría Legal en Tiempo Real (LCT & CCT)
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  auditSummary.totalViolations > 0
                    ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                    : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                }`}
              >
                {auditSummary.totalViolations > 0 ? 'Riesgo Laboral Detectado' : '100% Conforme a Ley'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluación estricta de descansos y jornadas bajo la Ley 20.744 y convenios del transporte automotor en Tucumán
            </p>
          </div>
        </div>

        {/* Botón Resolver con IA */}
        {auditSummary.totalViolations > 0 && (
          <div className="z-10">
            <button
              onClick={onOpenAIOptimizer}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 hover:shadow-lg hover:-translate-y-px transition-all duration-200 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
              <span>Subsanar Infracciones con IA</span>
            </button>
          </div>
        )}
      </div>

      {/* Tarjetas Métricas de Riesgo y Ahorro */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        {/* Tasa de Cumplimiento */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-medium">Cumplimiento</span>
            <span className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-500/10">
              <FileCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{compliancePercent}%</span>
            <span className="text-slate-500">del personal</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                compliancePercent === 100 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${compliancePercent}%` }}
            />
          </div>
        </div>

        {/* Infracciones Graves */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-medium">Infracciones (Rojo)</span>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {auditSummary.totalViolations}
            </span>
            <span className="text-slate-500">en falta</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block truncate">
            Multa potencial Secretaría
          </span>
        </div>

        {/* Advertencias Preventivas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-medium">Alertas (Amarillo)</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {auditSummary.totalWarnings}
            </span>
            <span className="text-slate-500">en límite</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block truncate">
            Jornadas cercanas a 6 días
          </span>
        </div>

        {/* Estimación de Ahorro en Multas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-medium">Ahorro en Multas</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${auditSummary.estimatedFinesAvoidedArs.toLocaleString('es-AR')}
            </span>
            <span className="text-slate-400 text-[10px]">ARS</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2 block truncate font-medium">
            Base: Ley 25.212
          </span>
        </div>
      </div>

      {/* Lista Detallada de Infracciones y Advertencias */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Detalle de Alertas Activas en la Empresa</span>
          </div>
          <span className="text-xs text-slate-500 tabular-nums">
            Total: {auditSummary.alertsList.length}
          </span>
        </h2>

        {auditSummary.alertsList.length === 0 ? (
          <div className="p-8 text-center text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-800/40 rounded-2xl flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-sm">¡El diagrama no posee infracciones legales!</span>
            <span className="text-xs text-slate-500">
              Todos los empleados cumplen con los descansos mínimos obligatorios y francos mensuales.
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {auditSummary.alertsList.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  alert.severity === 'DANGER'
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/90 dark:border-rose-800/60'
                    : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-800/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-black uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md ${
                        alert.severity === 'DANGER'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                      }`}
                    >
                      {alert.severity === 'DANGER' ? 'Infracción Grave' : 'Advertencia'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{alert.employeeName}</span>
                    {alert.day && (
                      <span className="text-slate-500 font-mono tabular-nums">Día {alert.day}</span>
                    )}
                  </div>
                  <p className="text-slate-800 dark:text-slate-300 text-xs font-semibold">{alert.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">{alert.message}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-sky-700 dark:text-sky-400 block bg-white dark:bg-slate-950/60 px-2.5 py-1 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    ⚖️ {alert.articleRef}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referencias Normativas Laborales Argentinas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-card text-xs text-slate-600 dark:text-slate-400 space-y-3">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
          <Scale className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Normativa Laboral Aplicada en el Motor de Validación:</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-50/80 hover:bg-white dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition-all duration-200 hover:shadow-xs">
            <span className="font-bold text-slate-900 dark:text-slate-200 block mb-1">Ley de Contrato de Trabajo (LCT 20.744)</span>
            <span>
              Art. 197 (Pausa mínima de 12 horas entre jornadas) y Art. 204 (Prohibición de trabajar más de 6 días continuos sin descanso semanal).
            </span>
          </div>
          <div className="bg-slate-50/80 hover:bg-white dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition-all duration-200 hover:shadow-xs">
            <span className="font-bold text-slate-900 dark:text-slate-200 block mb-1">Régimen de Jornada (Ley 11.544)</span>
            <span>
              Límite de 8 horas diarias y descansos compensatorios continuos de 36 a 48 horas.
            </span>
          </div>
          <div className="bg-slate-50/80 hover:bg-white dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition-all duration-200 hover:shadow-xs">
            <span className="font-bold text-slate-900 dark:text-slate-200 block mb-1">Convenios Transporte (UTA / SMATA)</span>
            <span>
              Exigencia de 6 francos mensuales mínimos en meses de 30 días y 7 francos en meses de 31 días para personal de conducción y taller.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
