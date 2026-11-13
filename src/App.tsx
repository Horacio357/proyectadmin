import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ShiftMatrix } from './components/matrix/ShiftMatrix';
import { EmployeePortal } from './components/employee/EmployeePortal';
import { RequestsManager } from './components/admin/RequestsManager';
import { LegalAuditPanel } from './components/legal/LegalAuditPanel';
import { StaffManager } from './components/admin/StaffManager';
import { AIOptimizerModal } from './components/ai/AIOptimizerModal';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { Employee, MonthlyRoster, ShiftCode, StaffRequirement, SuggestionRequest, ThemeMode } from './types';
import { storageService } from './services/storageService';
import { auditEntireRoster } from './services/legalEngine';
import { exportRosterToExcel } from './services/excelExport';
import { getDaysInMonth, MONTH_NAMES } from './data/constants';

export const App: React.FC = () => {
  // Modo Día / Modo Noche (arranca en Modo Día por defecto)
  const [theme, setTheme] = useState<ThemeMode>(() => storageService.getTheme());

  // Período Activo del Diagrama (Año y Mes)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(11);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      document.body.className = 'bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden transition-colors duration-300';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      document.body.className = 'bg-[#f4f7fb] text-slate-900 min-h-screen overflow-x-hidden transition-colors duration-300';
    }
    storageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(next === 'dark' ? '🌙 Modo Noche (Oscuro) activado' : '☀️ Modo Día (Claro) activado');
      return next;
    });
  };

  const handleSetTheme = (newTheme: ThemeMode) => {
    if (newTheme === theme) return;
    setTheme(newTheme);
    showToast(newTheme === 'dark' ? '🌙 Modo Noche (Oscuro) activado' : '☀️ Modo Día (Claro) activado');
  };

  // Estado principal persistente
  const [employees, setEmployees] = useState<Employee[]>(() => storageService.getEmployees());
  const [roster, setRoster] = useState<MonthlyRoster>(() => storageService.getRoster(2026, 11));
  const [suggestions, setSuggestions] = useState<SuggestionRequest[]>(() => storageService.getSuggestions());
  const [requirements, setRequirements] = useState<StaffRequirement[]>(() => storageService.getRequirements());

  // Navegación multimes dinámica con persistencia independiente
  const handleChangeMonth = (newYear: number, newMonth: number) => {
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    const nextRoster = storageService.getRoster(newYear, newMonth);
    setRoster(nextRoster);
    showToast(`Diagrama de ${MONTH_NAMES[newMonth - 1]} ${newYear} cargado.`);
  };

  // Usuario simulado actual
  const [currentUserId, setCurrentUserId] = useState<string>(() => storageService.getCurrentUserId());
  const currentUser = useMemo(() => {
    return employees.find((e) => e.id === currentUserId) || employees[0];
  }, [employees, currentUserId]);

  // Navegación de pestañas
  const [activeTab, setActiveTab] = useState<'matrix' | 'portal' | 'requests' | 'audit' | 'staff'>(
    currentUser.role === 'SUPER_ADMIN' ? 'matrix' : 'portal'
  );

  // Modales
  const [isAIOptimizerOpen, setIsAIOptimizerOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Cada vez que cambie de rol, sincronizar pestaña por defecto
  useEffect(() => {
    if (currentUser.role === 'OPERATIVO' && activeTab !== 'portal') {
      setActiveTab('portal');
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastNotification(msg);
    toastTimerRef.current = window.setTimeout(() => {
      setToastNotification(null);
      toastTimerRef.current = null;
    }, 3500);
  };

  // Auditoría en tiempo real del diagrama mensual completo
  const auditSummary = useMemo(() => {
    return auditEntireRoster(employees, roster);
  }, [employees, roster]);

  // Actualización individual de celda en la matriz
  const handleUpdateShift = (employeeId: string, day: number, newShift: ShiftCode) => {
    setRoster((prev) => {
      const nextAsignaciones = {
        ...prev.asignaciones,
        [employeeId]: {
          ...(prev.asignaciones[employeeId] || {}),
          [day]: newShift,
        },
      };

      const updatedRoster: MonthlyRoster = {
        ...prev,
        asignaciones: nextAsignaciones,
        updatedAt: new Date().toISOString(),
      };

      storageService.saveRoster(updatedRoster);
      return updatedRoster;
    });
  };

  // Actualización en lote (por ejemplo plantillas de francos o IA)
  const handleBulkUpdate = (newAssignments: MonthlyRoster['asignaciones']) => {
    setRoster((prev) => {
      const updatedRoster: MonthlyRoster = {
        ...prev,
        asignaciones: newAssignments,
        updatedAt: new Date().toISOString(),
      };
      storageService.saveRoster(updatedRoster);
      showToast('Diagrama actualizado con plantilla rápida');
      return updatedRoster;
    });
  };

  // Aplicación del resultado de la IA
  const handleApplyOptimization = (newAssignments: MonthlyRoster['asignaciones']) => {
    setRoster((prev) => {
      const updatedRoster: MonthlyRoster = {
        ...prev,
        estado: 'OPTIMIZADO_IA',
        asignaciones: newAssignments,
        updatedAt: new Date().toISOString(),
      };
      storageService.saveRoster(updatedRoster);
      showToast('¡Diagrama optimizado con IA aplicado con éxito! Cumplimiento legal 100%');
      return updatedRoster;
    });
  };

  // Aprobación de solicitudes de cambio de turno con actualización instantánea en la grilla
  const handleApproveRequest = (requestId: string) => {
    const sug = suggestions.find((s) => s.id === requestId);
    if (!sug) return;

    const updatedSuggestions = suggestions.map((s) =>
      s.id === requestId ? { ...s, estado: 'APROBADA' as const } : s
    );
    setSuggestions(updatedSuggestions);
    storageService.saveSuggestions(updatedSuggestions);

    if (sug.tipo === 'PERMUTA_1_A_1' && sug.companeroId && sug.turnoDeseado) {
      // Impacto atómico simultáneo en ambas filas de la matriz
      setRoster((prev) => {
        const nextAsignaciones = {
          ...prev.asignaciones,
          [sug.usuarioId]: {
            ...(prev.asignaciones[sug.usuarioId] || {}),
            [sug.dia]: sug.turnoDeseado!,
          },
          [sug.companeroId!]: {
            ...(prev.asignaciones[sug.companeroId!] || {}),
            [sug.dia]: sug.turnoActual,
          },
        };

        const updatedRoster: MonthlyRoster = {
          ...prev,
          asignaciones: nextAsignaciones,
          updatedAt: new Date().toISOString(),
        };

        storageService.saveRoster(updatedRoster);
        return updatedRoster;
      });

      showToast(`✅ Permuta 1 a 1 entre ${sug.usuarioNombre} y ${sug.companeroNombre} aprobada e impactada en el diagrama.`);
    } else if (sug.turnoDeseado) {
      handleUpdateShift(sug.usuarioId, sug.dia, sug.turnoDeseado);
      showToast(`Solicitud de ${sug.usuarioNombre} aprobada e impactada en el diagrama.`);
    }
  };

  // Rechazo de solicitud
  const handleRejectRequest = (requestId: string) => {
    const updatedSuggestions = suggestions.map((s) =>
      s.id === requestId ? { ...s, estado: 'RECHAZADA' as const } : s
    );
    setSuggestions(updatedSuggestions);
    storageService.saveSuggestions(updatedSuggestions);
    showToast('Solicitud rechazada');
  };

  // Aceptar / Homologar Perfil de Chofer, Mecánico o Inspector
  const handleApproveProfile = (employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    const nextEmployees = employees.map((e) =>
      e.id === employeeId
        ? {
            ...e,
            estadoPerfil: 'APROBADO' as const,
            activo: true,
            motivoRechazo: undefined,
          }
        : e
    );
    setEmployees(nextEmployees);
    storageService.saveEmployees(nextEmployees);

    // Si aún no tiene turnos asignados en el mes, generarle un esquema base 6x1
    setRoster((prev) => {
      if (!prev.asignaciones[employeeId]) {
        const daysInMonth = getDaysInMonth(prev.anio, prev.mes);
        const empShifts: Record<number, ShiftCode> = {};
        for (let d = 1; d <= daysInMonth; d++) {
          if (d % 6 === 0) {
            empShifts[d] = 'F';
          } else {
            empShifts[d] = emp.preferenciaTurno === 'ROTATIVO' ? 'M' : emp.preferenciaTurno;
          }
        }
        const updatedRoster: MonthlyRoster = {
          ...prev,
          asignaciones: {
            ...prev.asignaciones,
            [employeeId]: empShifts,
          },
        };
        storageService.saveRoster(updatedRoster);
        return updatedRoster;
      }
      return prev;
    });

    showToast(`✅ Perfil de ${emp.nombre} ${emp.apellido} (${emp.puesto}) APROBADO e incorporado al diagrama.`);
  };

  // Denegar / Suspender Perfil de Chofer, Mecánico o Inspector
  const handleDenyProfile = (employeeId: string, reason: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    const nextEmployees = employees.map((e) =>
      e.id === employeeId
        ? {
            ...e,
            estadoPerfil: 'DENEGADO' as const,
            activo: false,
            motivoRechazo: reason,
          }
        : e
    );
    setEmployees(nextEmployees);
    storageService.saveEmployees(nextEmployees);

    showToast(`❌ Perfil de ${emp.nombre} ${emp.apellido} DENEGADO. Motivo: ${reason}`);
  };

  // Alta de solicitud por el empleado
  const handleSubmitRequest = (newReq: SuggestionRequest) => {
    const next = [newReq, ...suggestions];
    setSuggestions(next);
    storageService.saveSuggestions(next);
    showToast('Tu solicitud ha sido enviada a Gerencia de Operaciones.');
  };

  // Actualización de datos de empleado
  const handleUpdateEmployee = (updatedEmp: Employee) => {
    const next = employees.map((e) => (e.id === updatedEmp.id ? updatedEmp : e));
    setEmployees(next);
    storageService.saveEmployees(next);
    showToast(`Datos de ${updatedEmp.nombre} actualizados.`);
  };

  // Alta de nuevo empleado
  const handleAddEmployee = (newEmp: Employee) => {
    const next = [...employees, newEmp];
    setEmployees(next);
    storageService.saveEmployees(next);

    // Si fue creado directamente como aprobado, generarle turnos
    if (newEmp.estadoPerfil === 'APROBADO') {
      const daysInMonth = getDaysInMonth(roster.anio, roster.mes);
      const empShifts: Record<number, ShiftCode> = {};
      for (let d = 1; d <= daysInMonth; d++) {
        if (d % 6 === 0) empShifts[d] = 'F';
        else empShifts[d] = newEmp.preferenciaTurno === 'ROTATIVO' ? 'M' : newEmp.preferenciaTurno;
      }
      const updatedRoster: MonthlyRoster = {
        ...roster,
        asignaciones: {
          ...roster.asignaciones,
          [newEmp.id]: empShifts,
        },
      };
      setRoster(updatedRoster);
      storageService.saveRoster(updatedRoster);
    }

    showToast(`Personal ${newEmp.nombre} ${newEmp.apellido} registrado (${newEmp.estadoPerfil}).`);
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('¿Deseas reiniciar los datos a la versión inicial de prueba?')) {
      storageService.resetAllData();
      const freshEmployees = storageService.getEmployees();
      const freshRoster = storageService.getRoster(2026, 11);
      const freshSuggestions = storageService.getSuggestions();
      const freshRequirements = storageService.getRequirements();

      setEmployees(freshEmployees);
      setRoster(freshRoster);
      setSuggestions(freshSuggestions);
      setRequirements(freshRequirements);
      showToast('Datos reiniciados al estado demo.');
    }
  };

  // Exportar Excel de forma asíncrona (Code-Splitting diferido)
  const handleExportExcel = async () => {
    showToast('Generando y descargando archivo Excel (.xlsx)...');
    try {
      await exportRosterToExcel(roster, employees);
    } catch (err) {
      console.error(err);
      showToast('Error al exportar Excel');
    }
  };

  const pendingRequestsCount = suggestions.filter((s) => s.estado === 'PENDIENTE').length;
  const pendingProfilesCount = employees.filter(
    (e) => e.role === 'OPERATIVO' && e.estadoPerfil === 'PENDIENTE'
  ).length;

  return (
    <div className="min-h-screen bg-[#f4f7fb] bg-[radial-gradient(ellipse_90%_45%_at_50%_-10%,rgba(14,165,233,0.08),transparent)] dark:bg-slate-950 dark:bg-none text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 w-full overflow-x-hidden">
      {/* Barra de Navegación Principal */}
      <Navbar
        currentUser={currentUser}
        employees={employees}
        onSelectUser={(u) => {
          setCurrentUserId(u.id);
          storageService.saveCurrentUserId(u.id);
        }}
        auditSummary={auditSummary}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAIOptimizer={() => setIsAIOptimizerOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onResetData={handleResetData}
        onExportExcel={handleExportExcel}
        pendingRequestsCount={pendingRequestsCount}
        pendingProfilesCount={pendingProfilesCount}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSetTheme={handleSetTheme}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onChangeMonth={handleChangeMonth}
      />

      {/* Notificación Toast flotante */}
      {toastNotification && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 max-w-md z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-sky-100 font-semibold text-xs px-4 py-3 rounded-2xl shadow-popover dark:shadow-xl border border-sky-200/90 dark:border-sky-500/40 flex items-center gap-2.5 animate-toast-in">
          <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 animate-pulse" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Contenido Principal según Pestaña Activa */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-3 sm:p-5 lg:p-6 xl:p-8">
        <div key={activeTab} className="animate-tab-enter">
          {activeTab === 'matrix' && (
            <ShiftMatrix
              roster={roster}
              employees={employees}
              requirements={requirements}
              onUpdateShift={handleUpdateShift}
              onBulkUpdate={handleBulkUpdate}
              onOpenAIOptimizer={() => setIsAIOptimizerOpen(true)}
              onExportExcel={handleExportExcel}
            />
          )}

          {activeTab === 'portal' && (
            <EmployeePortal
              currentUser={currentUser}
              employees={employees}
              roster={roster}
              suggestions={suggestions}
              onSubmitRequest={handleSubmitRequest}
            />
          )}

          {activeTab === 'requests' && (
            <RequestsManager
              suggestions={suggestions}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              roster={roster}
            />
          )}

          {activeTab === 'audit' && (
            <LegalAuditPanel
              auditSummary={auditSummary}
              roster={roster}
              onOpenAIOptimizer={() => setIsAIOptimizerOpen(true)}
            />
          )}

          {activeTab === 'staff' && (
            <StaffManager
              employees={employees}
              onUpdateEmployee={handleUpdateEmployee}
              onAddEmployee={handleAddEmployee}
              onApproveProfile={handleApproveProfile}
              onDenyProfile={handleDenyProfile}
            />
          )}
        </div>
      </main>

      {/* Modal de Optimización con IA */}
      <AIOptimizerModal
        isOpen={isAIOptimizerOpen}
        onClose={() => setIsAIOptimizerOpen(false)}
        employees={employees}
        requirements={requirements}
        onUpdateRequirements={(reqs) => {
          setRequirements(reqs);
          storageService.saveRequirements(reqs);
        }}
        roster={roster}
        onApplyOptimization={handleApplyOptimization}
      />

      {/* Modal de Clave API de Gemini */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {
          showToast('Clave de Gemini guardada.');
        }}
      />
    </div>
  );
};
