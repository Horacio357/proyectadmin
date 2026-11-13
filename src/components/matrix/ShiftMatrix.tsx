import React, { useState, useMemo } from 'react';
import {
  Employee,
  JobPosition,
  MonthlyRoster,
  ShiftCode,
  StaffRequirement,
  LegalAlert,
  MatrixViewMode,
} from '../../types';
import {
  DAY_NAMES_SHORT,
  getDayOfWeek,
  getDaysInMonth,
  MONTH_NAMES,
  POSITION_CONFIG,
  SHIFTS,
} from '../../data/constants';
import { MatrixCell } from './MatrixCell';
import { auditEmployeeRoster, getRequiredFrancos } from '../../services/legalEngine';
import {
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wand2,
  CalendarDays,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Printer,
} from 'lucide-react';

interface ShiftMatrixProps {
  roster: MonthlyRoster;
  employees: Employee[];
  requirements: StaffRequirement[];
  onUpdateShift: (employeeId: string, day: number, newShift: ShiftCode) => void;
  onBulkUpdate: (assignments: Record<string, Record<number, ShiftCode>>) => void;
  onOpenAIOptimizer: () => void;
  onExportExcel: () => void;
}

export const ShiftMatrix: React.FC<ShiftMatrixProps> = ({
  roster,
  employees,
  requirements,
  onUpdateShift,
  onBulkUpdate,
  onOpenAIOptimizer,
  onExportExcel,
}) => {
  const [selectedPuesto, setSelectedPuesto] = useState<JobPosition | 'TODOS'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [viewMode, setViewMode] = useState<MatrixViewMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'agenda';
    }
    return 'grid';
  });
  const [activeDayMobile, setActiveDayMobile] = useState<number>(1);

  const daysInMonth = getDaysInMonth(roster.anio, roster.mes);
  const requiredFrancos = getRequiredFrancos(daysInMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filtrar empleados operativos activos
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((e) => e.activo && e.role === 'OPERATIVO')
      .filter((e) => (selectedPuesto === 'TODOS' ? true : e.puesto === selectedPuesto))
      .filter((e) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          e.nombre.toLowerCase().includes(term) ||
          e.apellido.toLowerCase().includes(term) ||
          e.legajo.toLowerCase().includes(term)
        );
      });
  }, [employees, selectedPuesto, searchTerm]);

  // Auditoría por empleado
  const employeesAudit = useMemo(() => {
    const map = new Map<string, ReturnType<typeof auditEmployeeRoster>>();
    employees.forEach((emp) => {
      const userAssignments = roster.asignaciones[emp.id] || {};
      map.set(emp.id, auditEmployeeRoster(emp, userAssignments, roster.anio, roster.mes));
    });
    return map;
  }, [employees, roster]);

  // Totales de dotación por día
  const dailyStaffCount = useMemo(() => {
    const counts: Record<number, { M: number; T: number; N: number; F: number }> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      counts[d] = { M: 0, T: 0, N: 0, F: 0 };
    }

    filteredEmployees.forEach((emp) => {
      const userAssignments = roster.asignaciones[emp.id] || {};
      for (let d = 1; d <= daysInMonth; d++) {
        const shift = userAssignments[d] || 'F';
        if (shift === 'M') counts[d].M++;
        else if (shift === 'T') counts[d].T++;
        else if (shift === 'N') counts[d].N++;
        else if (shift === 'F') counts[d].F++;
      }
    });

    return counts;
  }, [filteredEmployees, roster, daysInMonth]);

  // Acciones en lote
  const handleApplyPreset = (type: '6x1' | 'PREFERENCES' | 'ALL_REST') => {
    const nextAssignments = { ...roster.asignaciones };

    filteredEmployees.forEach((emp, empIdx) => {
      if (!nextAssignments[emp.id]) nextAssignments[emp.id] = {};

      if (type === '6x1') {
        const offset = empIdx % 7;
        for (let d = 1; d <= daysInMonth; d++) {
          if ((d + offset) % 6 === 0) {
            nextAssignments[emp.id][d] = 'F';
          } else {
            nextAssignments[emp.id][d] = emp.preferenciaTurno === 'ROTATIVO' ? 'M' : emp.preferenciaTurno;
          }
        }
      } else if (type === 'PREFERENCES') {
        const pref = emp.preferenciaTurno === 'ROTATIVO' ? 'M' : emp.preferenciaTurno;
        for (let d = 1; d <= daysInMonth; d++) {
          if (nextAssignments[emp.id][d] !== 'F') {
            nextAssignments[emp.id][d] = pref;
          }
        }
      } else if (type === 'ALL_REST') {
        for (let d = 1; d <= daysInMonth; d++) {
          nextAssignments[emp.id][d] = 'F';
        }
      }
    });

    onBulkUpdate(nextAssignments);
    setShowBulkMenu(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* CABECERA OFICIAL DE IMPRESIÓN (Solo visible en papel / vista previa de impresión) */}
      <div className="print-only mb-3 border-b-2 border-slate-900 pb-2 text-slate-950">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-slate-950">
              DIAGRAMA MENSUAL OFICIAL DE TURNOS, SERVICIOS Y DESCANSOS
            </h1>
            <p className="text-xs font-bold text-slate-800">
              Líneas de Transporte Automotor de Pasajeros & Logística • Cabecera Central
            </p>
            <p className="text-[10px] text-slate-600 font-medium">
              Período: <strong className="text-slate-900">{MONTH_NAMES[roster.mes - 1]} de {roster.anio}</strong> • Marco Legal: Ley 11.544, Art. 197 LCT 20.744, CCT 460/73 (UTA) y CCT 260/75 (SMATA)
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-700">
            <p className="font-bold text-slate-900">ESTADO: HOMOLOGADO</p>
            <p>Fecha de emisión: {new Date().toLocaleDateString('es-AR')}</p>
            <p>Puesto filtrado: {selectedPuesto}</p>
          </div>
        </div>
      </div>

      {/* Barra de Controles y Filtros Enterprise */}
      <div className="no-print bg-white/95 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-card flex flex-col xl:flex-row xl:items-center justify-between gap-3 transition-all duration-200">
        {/* Selector de Mes, Vista & Filtro de Puesto */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-sky-50/70 dark:bg-slate-950 border border-sky-200/70 dark:border-slate-800 px-3 py-1.5 sm:py-2 rounded-xl text-slate-800 dark:text-white flex-shrink-0">
            <CalendarDays className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="font-bold text-xs sm:text-sm">
              {MONTH_NAMES[roster.mes - 1]} {roster.anio}
            </span>
            <span className="text-[11px] text-slate-500 tabular-nums">({daysInMonth} días)</span>
          </div>

          {/* Toggle de Vista: Grilla Completa vs Agenda Diaria Móvil */}
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs border border-slate-200/60 dark:border-transparent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grilla Excel</span>
              <span className="sm:hidden">Grilla</span>
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
                viewMode === 'agenda'
                  ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs border border-slate-200/60 dark:border-transparent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda Diaria</span>
            </button>
          </div>

          {/* Filtro por Puesto (Accesible en mobile y desktop con scroll horizontal táctil) */}
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setSelectedPuesto('TODOS')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedPuesto === 'TODOS'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedPuesto('CHOFER')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedPuesto === 'CHOFER'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Choferes
            </button>
            <button
              onClick={() => setSelectedPuesto('MECANICO')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedPuesto === 'MECANICO'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Mecánicos
            </button>
            <button
              onClick={() => setSelectedPuesto('INSPECTOR')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedPuesto === 'INSPECTOR'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Inspectores
            </button>
          </div>
        </div>

        {/* Búsqueda y Botones de Acción Rápida */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Campo de Búsqueda */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar personal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-44 bg-slate-50/90 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
            />
          </div>

          {/* Menú de Carga Rápida en Lote */}
          <div className="relative">
            <button
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/90 dark:border-slate-700 shadow-xs transition-all duration-150 active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden sm:inline">Plantillas</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showBulkMenu ? 'rotate-180' : ''}`} />
            </button>

            {showBulkMenu && (
              <div className="absolute right-0 top-10 z-50 bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-popover dark:shadow-xl rounded-2xl p-2 w-60 text-left animate-popover">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-2">
                  Aplicar al personal visible:
                </div>
                <button
                  onClick={() => handleApplyPreset('6x1')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex flex-col transition-colors"
                >
                  <span className="font-bold text-sky-600 dark:text-sky-400">Esquema Rotativo 6x1</span>
                  <span className="text-[10px] text-slate-500">1 Franco cada 6 días trabajados</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('PREFERENCES')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex flex-col transition-colors"
                >
                  <span className="font-bold text-amber-600 dark:text-amber-400">Turno Fijo por Preferencia</span>
                  <span className="text-[10px] text-slate-500">Rellena turnos según perfil</span>
                </button>
                <div className="my-1 border-t border-slate-200/80 dark:border-slate-800" />
                <button
                  onClick={() => handleApplyPreset('ALL_REST')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex flex-col transition-colors"
                >
                  <span className="font-bold">Limpiar todo a Francos</span>
                  <span className="text-[10px] text-slate-500">Borra turnos asignados del mes</span>
                </button>
              </div>
            )}
          </div>

          {/* Botón Optimizar con IA */}
          <button
            onClick={onOpenAIOptimizer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-500/25 hover:-translate-y-px transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-200 animate-pulse" />
            <span>Optimizar con IA</span>
          </button>

          {/* Botón Imprimir Cartelera Oficial */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-sm transition-all duration-150 active:scale-95"
            title="Imprimir cartelera física de cabecera y taller (A4 apaisado con firmas oficiales)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span className="hidden sm:inline">Imprimir Cartelera</span>
          </button>
        </div>
      </div>

      {/* VISTA 1: AGENDA DIARIA MÓVIL (Táctil para teléfonos y supervisores) */}
      {viewMode === 'agenda' && (
        <div key="agenda-view" className="space-y-3 animate-tab-enter">
          {/* Navegador de Días para Móvil */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-card">
            <button
              onClick={() => setActiveDayMobile(Math.max(1, activeDayMobile - 1))}
              disabled={activeDayMobile <= 1}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                {DAY_NAMES_SHORT[getDayOfWeek(roster.anio, roster.mes, activeDayMobile)]}
              </span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                Día {activeDayMobile} de {MONTH_NAMES[roster.mes - 1]}
              </span>
            </div>

            <button
              onClick={() => setActiveDayMobile(Math.min(daysInMonth, activeDayMobile + 1))}
              disabled={activeDayMobile >= daysInMonth}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Resumen del Día en Curso */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-gradient-to-b from-sky-50/70 to-white dark:from-slate-900 dark:to-slate-900 border border-sky-200/70 dark:border-slate-800 p-2.5 rounded-xl shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <span className="text-[10px] text-sky-700 dark:text-sky-400 font-bold block">☀️ Mañana</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                {dailyStaffCount[activeDayMobile]?.M || 0}
              </span>
            </div>
            <div className="bg-gradient-to-b from-amber-50/70 to-white dark:from-slate-900 dark:to-slate-900 border border-amber-200/70 dark:border-slate-800 p-2.5 rounded-xl shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">🌤️ Tarde</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                {dailyStaffCount[activeDayMobile]?.T || 0}
              </span>
            </div>
            <div className="bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-900 dark:to-slate-900 border border-indigo-200/70 dark:border-slate-800 p-2.5 rounded-xl shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <span className="text-[10px] text-indigo-700 dark:text-purple-400 font-bold block">🌙 Noche</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                {dailyStaffCount[activeDayMobile]?.N || 0}
              </span>
            </div>
            <div className="bg-gradient-to-b from-emerald-50/70 to-white dark:from-slate-900 dark:to-slate-900 border border-emerald-200/70 dark:border-slate-800 p-2.5 rounded-xl shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">🏖️ Francos</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                {dailyStaffCount[activeDayMobile]?.F || 0}
              </span>
            </div>
          </div>

          {/* Lista de Tarjetas del Personal para el Día Seleccionado */}
          <div className="space-y-2">
            {filteredEmployees.map((emp) => {
              const userAssignments = roster.asignaciones[emp.id] || {};
              const currentShift = userAssignments[activeDayMobile] || 'F';
              const shiftDef = SHIFTS[currentShift];
              const posConfig = POSITION_CONFIG[emp.puesto];
              const compliance = employeesAudit.get(emp.id);
              const dayAlert = compliance?.alerts.find((a) => a.day === activeDayMobile);

              return (
                <div
                  key={emp.id}
                  className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-3 ${posConfig.borderAccent}`}
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {emp.nombre} {emp.apellido}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono">{emp.legajo}</span>
                      <span>•</span>
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${posConfig.badgeClass}`}>
                        {posConfig.label}
                      </span>
                    </div>

                    {dayAlert && (
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mt-1">
                        ⚠️ {dayAlert.title}
                      </div>
                    )}
                  </div>

                  {/* Selector Táctil Directo */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={currentShift}
                      onChange={(e) => onUpdateShift(emp.id, activeDayMobile, e.target.value as ShiftCode)}
                      className={`text-xs font-bold rounded-xl px-2.5 py-2 border cursor-pointer focus:ring-1 focus:ring-sky-500 transition-colors ${shiftDef.badgeBg}`}
                    >
                      {(Object.keys(SHIFTS) as ShiftCode[]).map((code) => (
                        <option key={code} value={code}>
                          {code} - {SHIFTS[code].shortLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA 2: GRILLA MENSUAL TIPO EXCEL (Para Laptop y Desktop) */}
      {viewMode === 'grid' && (
        <div key="grid-view" className="space-y-3 animate-tab-enter">
          {/* Leyenda Visual de Turnos y Códigos */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Turnos:</span>
              {(Object.keys(SHIFTS) as ShiftCode[]).map((code) => {
                const def = SHIFTS[code];
                return (
                  <div
                    key={code}
                    className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-2.5 py-1 rounded-xl shadow-xs hover:shadow-sm transition-all duration-150"
                  >
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center font-bold text-[10px] border ${def.badgeBg}`}>
                      {code}
                    </span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">{def.shortLabel}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Francos obligatorios:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-200/90 dark:border-emerald-500/20 tabular-nums">
                {requiredFrancos} días
              </span>
            </div>
          </div>

          {/* Grilla Interactiva Tipo Hoja de Cálculo (Excel) adaptada para laptop y mobile scroll */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto max-h-[calc(100vh-270px)] min-h-[420px] relative scrollbar-thin">
              <table className="w-full border-collapse text-xs">
                {/* Cabecera Fija */}
                <thead className="sticky top-0 z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200/90 dark:border-slate-800">
                  <tr>
                    {/* Columna Empleado */}
                    <th className="sticky left-0 z-40 bg-slate-50 dark:bg-slate-950 p-2.5 sm:p-3 text-left font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200/90 dark:border-slate-800 min-w-[170px] sm:min-w-[210px] w-[170px] sm:w-[210px] shadow-[4px_0_10px_rgba(15,23,42,0.04)] dark:shadow-[4px_0_8px_rgba(0,0,0,0.4)]">
                      Personal Operativo
                    </th>

                    {/* Columnas de Días del Mes */}
                    {daysArray.map((day) => {
                      const dayOfWeek = getDayOfWeek(roster.anio, roster.mes, day);
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                      return (
                        <th
                          key={day}
                          className={`min-w-[32px] sm:min-w-[34px] w-[32px] sm:w-[34px] p-1 text-center border-r border-slate-200/80 dark:border-slate-800 tabular-nums ${
                            isWeekend ? 'bg-amber-50/70 dark:bg-slate-900/90 text-amber-700 dark:text-amber-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <div className="text-[9px] sm:text-[10px] font-medium opacity-75">
                            {DAY_NAMES_SHORT[dayOfWeek]}
                          </div>
                          <div className="font-extrabold text-[11px] sm:text-xs">{day}</div>
                        </th>
                      );
                    })}

                    {/* Columnas de Resumen y Semáforo */}
                    <th className="p-2 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200/90 dark:border-slate-800 min-w-[65px]">
                      Francos
                    </th>
                    <th className="p-2 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200/90 dark:border-slate-800 min-w-[55px]">
                      Horas
                    </th>
                    <th className="sticky right-0 z-30 bg-slate-50 dark:bg-slate-950 p-2 text-center font-bold text-slate-700 dark:text-slate-300 min-w-[85px] shadow-[-4px_0_10px_rgba(15,23,42,0.04)] dark:shadow-[-4px_0_8px_rgba(0,0,0,0.4)]">
                      Semáforo
                    </th>
                  </tr>
                </thead>

                {/* Filas de Empleados */}
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                  {filteredEmployees.map((emp) => {
                    const userAssignments = roster.asignaciones[emp.id] || {};
                    const compliance = employeesAudit.get(emp.id);
                    const posConfig = POSITION_CONFIG[emp.puesto];
                    const alerts = compliance?.alerts || [];

                    return (
                      <tr
                        key={emp.id}
                        className="hover:bg-sky-50/35 dark:hover:bg-slate-800/40 transition-colors duration-150 group"
                      >
                        {/* Tarjeta Identificatoria del Empleado */}
                        <td className="sticky left-0 z-20 bg-white group-hover:bg-sky-50/90 dark:bg-slate-900 dark:group-hover:bg-slate-900 p-2 border-r border-slate-200/90 dark:border-slate-800 shadow-[4px_0_10px_rgba(15,23,42,0.03)] dark:shadow-[4px_0_8px_rgba(0,0,0,0.3)] transition-colors duration-150">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-8 rounded-full transition-all duration-200 group-hover:h-9 ${
                                emp.puesto === 'CHOFER'
                                  ? 'bg-sky-500'
                                  : emp.puesto === 'MECANICO'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <div className="truncate">
                              <div className="font-bold text-slate-900 dark:text-slate-200 group-hover:text-sky-700 dark:group-hover:text-white truncate text-xs transition-colors">
                                {emp.nombre} {emp.apellido}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                <span className="font-mono font-medium">{emp.legajo}</span>
                                <span>•</span>
                                <span className={`px-1.5 py-0.5 rounded font-semibold text-[9px] ${posConfig.badgeClass}`}>
                                  {posConfig.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Celdas de Turno por Día */}
                        {daysArray.map((day) => {
                          const shift = userAssignments[day] || 'F';
                          const dayOfWeek = getDayOfWeek(roster.anio, roster.mes, day);
                          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                          const dayAlert = alerts.find((a) => a.day === day);

                          return (
                            <td key={day} className="p-0">
                              <MatrixCell
                                employeeId={emp.id}
                                day={day}
                                shift={shift}
                                onUpdateShift={onUpdateShift}
                                dayAlert={dayAlert}
                                isWeekend={isWeekend}
                              />
                            </td>
                          );
                        })}

                        {/* Resumen: Total Francos */}
                        <td className="p-2 text-center border-r border-slate-200/80 dark:border-slate-800 tabular-nums">
                          <div
                            className={`inline-flex items-center justify-center font-bold px-1.5 py-0.5 rounded-md text-[11px] ${
                              (compliance?.totalFrancos || 0) >= requiredFrancos
                                ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                            }`}
                          >
                            {compliance?.totalFrancos || 0}/{requiredFrancos}
                          </div>
                        </td>

                        {/* Resumen: Horas Mes */}
                        <td className="p-2 text-center border-r border-slate-200/80 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300 tabular-nums">
                          {compliance?.totalHorasMes || 0}h
                        </td>

                        {/* Semáforo Legal de la Fila */}
                        <td className="sticky right-0 z-20 bg-white group-hover:bg-sky-50/90 dark:bg-slate-900 dark:group-hover:bg-slate-900 p-2 text-center shadow-[-4px_0_10px_rgba(15,23,42,0.03)] dark:shadow-[-4px_0_8px_rgba(0,0,0,0.3)] transition-colors duration-150">
                          {compliance?.overallSeverity === 'OK' && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                              title="Cumple con todas las normas laborales argentinas"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Conforme</span>
                            </span>
                          )}

                          {compliance?.overallSeverity === 'WARNING' && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
                              title={alerts.map((a) => a.title).join(' | ')}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span className="hidden sm:inline">Alerta</span>
                            </span>
                          )}

                          {compliance?.overallSeverity === 'DANGER' && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40 animate-pulse"
                              title={alerts.map((a) => `${a.title}: ${a.message}`).join(' | ')}
                            >
                              <XCircle className="w-3 h-3" />
                              <span className="hidden sm:inline">Infracción</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Fila Inferior de Dotación Diaria */}
                <tfoot className="sticky bottom-0 z-30 bg-slate-50/95 dark:bg-slate-950 font-mono border-t-2 border-slate-200 dark:border-slate-700 tabular-nums">
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[10px] sm:text-[11px]">
                    <td className="sticky left-0 bg-slate-50 dark:bg-slate-950 p-2 font-bold text-sky-700 dark:text-sky-400 border-r border-slate-200/90 dark:border-slate-800">
                      ☀️ Mañana (M)
                    </td>
                    {daysArray.map((day) => (
                      <td key={day} className="text-center font-bold text-sky-800 dark:text-sky-300 border-r border-slate-200/80 dark:border-slate-800">
                        {dailyStaffCount[day].M}
                      </td>
                    ))}
                    <td colSpan={3} className="sticky right-0 bg-slate-50 dark:bg-slate-950 p-2 text-[11px] text-slate-500 text-center font-sans">
                      Dotación Diaria
                    </td>
                  </tr>

                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[10px] sm:text-[11px]">
                    <td className="sticky left-0 bg-slate-50 dark:bg-slate-950 p-2 font-bold text-amber-700 dark:text-amber-400 border-r border-slate-200/90 dark:border-slate-800">
                      🌤️ Tarde (T)
                    </td>
                    {daysArray.map((day) => (
                      <td key={day} className="text-center font-bold text-amber-800 dark:text-amber-300 border-r border-slate-200/80 dark:border-slate-800">
                        {dailyStaffCount[day].T}
                      </td>
                    ))}
                    <td colSpan={3} className="sticky right-0 bg-slate-50 dark:bg-slate-950" />
                  </tr>

                  <tr className="text-[10px] sm:text-[11px]">
                    <td className="sticky left-0 bg-slate-50 dark:bg-slate-950 p-2 font-bold text-indigo-700 dark:text-purple-400 border-r border-slate-200/90 dark:border-slate-800">
                      🌙 Noche (N)
                    </td>
                    {daysArray.map((day) => (
                      <td key={day} className="text-center font-bold text-indigo-800 dark:text-purple-300 border-r border-slate-200/80 dark:border-slate-800">
                        {dailyStaffCount[day].N}
                      </td>
                    ))}
                    <td colSpan={3} className="sticky right-0 bg-slate-50 dark:bg-slate-950" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PIE DE FIRMAS OFICIAL (Solo visible en papel / vista previa de impresión) */}
      <div className="print-only mt-6 pt-4 border-t-2 border-slate-900 text-slate-950">
        <div className="grid grid-cols-3 gap-8 text-center text-[9pt]">
          <div>
            <div className="border-b border-slate-800 mb-1 h-12"></div>
            <p className="font-extrabold uppercase text-slate-900">Jefe de Tráfico / Programación</p>
            <p className="text-[8pt] text-slate-600">Empresa de Transporte</p>
          </div>
          <div>
            <div className="border-b border-slate-800 mb-1 h-12"></div>
            <p className="font-extrabold uppercase text-slate-900">Gerencia de Operaciones</p>
            <p className="text-[8pt] text-slate-600">Homologación y Control</p>
          </div>
          <div>
            <div className="border-b border-slate-800 mb-1 h-12"></div>
            <p className="font-extrabold uppercase text-slate-900">Comisión Interna / Delegado UTA</p>
            <p className="text-[8pt] text-slate-600">Conformidad Gremial</p>
          </div>
        </div>
        <p className="text-center text-[7pt] text-slate-500 mt-4 italic">
          * Planilla oficial de cumplimiento obligatorio para exhibición en cabecera según Art. 197 LCT y CCT 460/73. Toda permuta o modificación debe contar con autorización de Tráfico.
        </p>
      </div>
    </div>
  );
};
