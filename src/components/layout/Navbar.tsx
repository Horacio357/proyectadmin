import React, { useState } from 'react';
import {
  Bus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Settings,
  RotateCcw,
  Key,
  Calendar,
  Layers,
  FileSpreadsheet,
  Sun,
  Moon,
  Menu,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Employee, RosterAuditSummary, ThemeMode } from '../../types';
import { MONTH_NAMES, POSITION_CONFIG } from '../../data/constants';

interface NavbarProps {
  currentUser: Employee;
  employees: Employee[];
  onSelectUser: (user: Employee) => void;
  auditSummary: RosterAuditSummary;
  activeTab: 'matrix' | 'portal' | 'requests' | 'audit' | 'staff';
  onSelectTab: (tab: 'matrix' | 'portal' | 'requests' | 'audit' | 'staff') => void;
  onOpenAIOptimizer: () => void;
  onOpenApiKeyModal: () => void;
  onResetData: () => void;
  onExportExcel: () => void;
  pendingRequestsCount: number;
  pendingProfilesCount?: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSetTheme?: (theme: ThemeMode) => void;
  currentYear: number;
  currentMonth: number;
  onChangeMonth: (year: number, month: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  employees,
  onSelectUser,
  auditSummary,
  activeTab,
  onSelectTab,
  onOpenAIOptimizer,
  onOpenApiKeyModal,
  onResetData,
  onExportExcel,
  pendingRequestsCount,
  pendingProfilesCount = 0,
  theme,
  onToggleTheme,
  onSetTheme,
  currentYear,
  currentMonth,
  onChangeMonth,
}) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'matrix' | 'portal' | 'requests' | 'audit' | 'staff') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSelectTheme = (newTheme: ThemeMode) => {
    if (newTheme === theme) return;
    if (onSetTheme) {
      onSetTheme(newTheme);
    } else {
      onToggleTheme();
    }
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors w-full">
      {/* Barra superior principal */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Identidad de la Marca Corporativa */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-sky-600/10 flex-shrink-0">
            <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bus className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white truncate">
                Turno<span className="text-sky-600 dark:text-sky-400">Smart</span>
              </span>
              <span className="hidden xs:inline-flex text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20 flex-shrink-0">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden xl:block truncate">
              Gestión Integral & Validación Laboral • Tucumán
            </p>
          </div>
        </div>

        {/* Semáforo Global e Indicadores Legales (Visible en pantallas 2xl para evitar colapso en laptops) */}
        <div className="hidden 2xl:flex items-center gap-3 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 px-4 py-1.5 rounded-full flex-shrink-0">
          <div className="flex items-center gap-2">
            {auditSummary.totalViolations > 0 ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            ) : (
              <span className="inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            )}
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Semáforo:</span>
          </div>

          {auditSummary.totalViolations > 0 ? (
            <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-500/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{auditSummary.totalViolations} Infracciones</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Conforme</span>
            </div>
          )}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />

          <div className="text-xs text-slate-600 dark:text-slate-400">
            Ahorro:{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ${auditSummary.estimatedFinesAvoidedArs.toLocaleString('es-AR')} ARS
            </span>
          </div>
        </div>

        {/* Acciones Rápidas & Switchers */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Navegador Multimes Flexible (visible en sm+) */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl p-0.5 sm:p-1 text-xs">
            <button
              onClick={() => {
                if (currentMonth === 1) onChangeMonth(currentYear - 1, 12);
                else onChangeMonth(currentYear, currentMonth - 1);
              }}
              className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-1.5 sm:px-2 font-bold text-slate-800 dark:text-slate-100 text-center text-[11px] sm:text-xs whitespace-nowrap">
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </span>

            <button
              onClick={() => {
                if (currentMonth === 12) onChangeMonth(currentYear + 1, 1);
                else onChangeMonth(currentYear, currentMonth + 1);
              }}
              className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isSuperAdmin && (
            <>
              {/* Botón Optimizar con IA (visible en md+) */}
              <button
                onClick={onOpenAIOptimizer}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all active:scale-95"
                title="Generar o balancear diagrama con Asistente IA"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-200 animate-pulse" />
                <span>Optimizar con IA</span>
              </button>

              {/* Botón Exportar Excel (visible en xl+) */}
              <button
                onClick={onExportExcel}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                title="Descargar diagrama en Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Exportar Excel</span>
              </button>
            </>
          )}

          {/* Selector de Identidad Demo (visible en lg+) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-2">Perfil:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = employees.find((u) => u.id === e.target.value);
                if (found) onSelectUser(found);
              }}
              className="bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 border-0 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-sky-500 font-medium cursor-pointer shadow-sm"
            >
              <optgroup label="Gerencia (Super Admin)">
                {employees
                  .filter((e) => e.role === 'SUPER_ADMIN')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      👔 {e.nombre} {e.apellido} (Gerente)
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Choferes">
                {employees
                  .filter((e) => e.role === 'OPERATIVO' && e.puesto === 'CHOFER')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      🚍 {e.nombre} {e.apellido} ({e.legajo}) {e.estadoPerfil !== 'APROBADO' ? `[${e.estadoPerfil}]` : ''}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Mecánicos">
                {employees
                  .filter((e) => e.role === 'OPERATIVO' && e.puesto === 'MECANICO')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      🔧 {e.nombre} {e.apellido} ({e.legajo}) {e.estadoPerfil !== 'APROBADO' ? `[${e.estadoPerfil}]` : ''}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Inspectores">
                {employees
                  .filter((e) => e.role === 'OPERATIVO' && e.puesto === 'INSPECTOR')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      🛡️ {e.nombre} {e.apellido} ({e.legajo})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* CONTROL SEGMENTADO MODO DÍA / MODO NOCHE (Visible SIEMPRE en móvil y desktop) */}
          <div
            className="flex items-center bg-slate-200 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 p-0.5 sm:p-1 rounded-xl shadow-inner flex-shrink-0"
            role="group"
            aria-label="Selector de tema Día y Noche"
          >
            {/* Opción MODO DÍA */}
            <button
              type="button"
              onClick={() => handleSelectTheme('light')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-white text-amber-700 shadow-sm border border-amber-300/60 ring-1 ring-amber-400/40'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Activar Modo Día (Fondo Claro y Luminoso)"
              aria-pressed={theme === 'light'}
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Día</span>
            </button>

            {/* Opción MODO NOCHE */}
            <button
              type="button"
              onClick={() => handleSelectTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-slate-950 text-sky-400 shadow-sm border border-sky-500/50 ring-1 ring-sky-500/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Activar Modo Noche (Fondo Oscuro para Taller y Noche)"
              aria-pressed={theme === 'dark'}
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-sky-400 fill-sky-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Noche</span>
            </button>
          </div>

          {/* Ajustes API Key (Desktop lg+) */}
          <button
            onClick={onOpenApiKeyModal}
            className="hidden lg:flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0"
            title="Configuración de Gemini API Key"
          >
            <Key className="w-4 h-4 text-amber-500" />
          </button>

          {/* Reset Demo Data (Desktop lg+) */}
          <button
            onClick={onResetData}
            className="hidden lg:flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0"
            title="Reiniciar datos iniciales demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Botón Menú Móvil (Hamburger para < md) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex-shrink-0 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Barra de pestañas de navegación (Desktop / Laptop) */}
      <div className="hidden md:flex max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800/80 items-center gap-1 overflow-x-auto py-1">
        {isSuperAdmin ? (
          <>
            <button
              onClick={() => onSelectTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Matriz Mensual de Turnos</span>
            </button>

            <button
              onClick={() => onSelectTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'audit'
                  ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Auditoría Legal & Semáforo</span>
              {auditSummary.totalViolations > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {auditSummary.totalViolations}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('requests')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'requests'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Buzón de Solicitudes</span>
              {pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('staff')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'staff'
                  ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Gestión de Personal ({employees.length})</span>
              {pendingProfilesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] animate-pulse">
                  {pendingProfilesCount} pend.
                </span>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onSelectTab('portal')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'portal'
                  ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Mi Calendario de Turnos</span>
            </button>
            <div className="ml-auto text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>Puesto:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${POSITION_CONFIG[currentUser.puesto].badgeClass}`}>
                {POSITION_CONFIG[currentUser.puesto].label}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Menú Desplegable Móvil (Drawer) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-3 animate-in slide-in-from-top-2 duration-150">
          {/* Selector de perfil móvil */}
          <div>
            <label className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mb-1">
              Simular Perfil Demo:
            </label>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = employees.find((u) => u.id === e.target.value);
                if (found) {
                  onSelectUser(found);
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-medium"
            >
              <optgroup label="Gerencia">
                {employees
                  .filter((e) => e.role === 'SUPER_ADMIN')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      👔 {e.nombre} {e.apellido} (Gerente)
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Choferes">
                {employees
                  .filter((e) => e.role === 'OPERATIVO' && e.puesto === 'CHOFER')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      🚍 {e.nombre} {e.apellido} ({e.legajo})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Mecánicos">
                {employees
                  .filter((e) => e.role === 'OPERATIVO' && e.puesto === 'MECANICO')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      🔧 {e.nombre} {e.apellido} ({e.legajo})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Navegador Multimes Móvil */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400 pl-1">Período:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (currentMonth === 1) onChangeMonth(currentYear - 1, 12);
                  else onChangeMonth(currentYear, currentMonth - 1);
                }}
                className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-900 dark:text-white px-2">
                {MONTH_NAMES[currentMonth - 1]} {currentYear}
              </span>
              <button
                onClick={() => {
                  if (currentMonth === 12) onChangeMonth(currentYear + 1, 1);
                  else onChangeMonth(currentYear, currentMonth + 1);
                }}
                className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selector de Modo Día / Noche Explícito y Táctil para Móvil */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Modo de Pantalla:</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                theme === 'light' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-sky-950 text-sky-400 border border-sky-800'
              }`}>
                {theme === 'light' ? '☀️ Modo Día' : '🌙 Modo Noche'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectTheme('light')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  theme === 'light'
                    ? 'bg-white text-amber-800 border-amber-300 shadow-sm ring-2 ring-amber-400/30'
                    : 'bg-slate-200/70 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200'
                }`}
              >
                <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
                <span>Modo Día</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectTheme('dark')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  theme === 'dark'
                    ? 'bg-slate-950 text-sky-400 border-sky-500 shadow-sm ring-2 ring-sky-500/30'
                    : 'bg-slate-200/70 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200'
                }`}
              >
                <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-sky-400 fill-sky-400' : 'text-slate-400'}`} />
                <span>Modo Noche</span>
              </button>
            </div>
          </div>

          {/* Botón IA Móvil para SuperAdmin */}
          {isSuperAdmin && (
            <button
              onClick={() => {
                onOpenAIOptimizer();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
              <span>Optimizar Diagrama con IA</span>
            </button>
          )}

          {/* Pestañas de navegación */}
          <div className="space-y-1 pt-1">
            {isSuperAdmin ? (
              <>
                <button
                  onClick={() => handleTabClick('matrix')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    activeTab === 'matrix'
                      ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Matriz de Turnos (Grilla/Agenda)</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabClick('audit')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    activeTab === 'audit'
                      ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Auditoría Legal & Semáforo</span>
                  </div>
                  {auditSummary.totalViolations > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {auditSummary.totalViolations}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabClick('requests')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    activeTab === 'requests'
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Buzón de Solicitudes</span>
                  </div>
                  {pendingRequestsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabClick('staff')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    activeTab === 'staff'
                      ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Gestión de Personal ({employees.length})</span>
                  </div>
                  {pendingProfilesCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                      {pendingProfilesCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleTabClick('portal')}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
              >
                <Calendar className="w-4 h-4" />
                <span>Mi Calendario de Turnos</span>
              </button>
            )}
          </div>

          {/* Acciones del menú móvil */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {isSuperAdmin && (
              <button
                onClick={() => {
                  onExportExcel();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar Excel</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => {
                  onOpenApiKeyModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                title="API Key"
              >
                <Key className="w-4 h-4 text-amber-500" />
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
