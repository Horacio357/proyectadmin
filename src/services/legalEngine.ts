import {
  Employee,
  EmployeeCompliance,
  LegalAlert,
  LegalAlertSeverity,
  MonthlyRoster,
  RosterAuditSummary,
  ShiftCode,
} from '../types';
import { ESTIMATED_FINE_PER_VIOLATION_ARS, getDaysInMonth, SHIFTS } from '../data/constants';

/**
 * Calcula los francos mensuales obligatorios requeridos por ley:
 * - 6 días para meses de 30 días
 * - 7 días para meses de 31 días
 * - 5 días para febrero (28 días) o 6 para 29 días
 */
export function getRequiredFrancos(daysInMonth: number): number {
  if (daysInMonth >= 31) return 7;
  if (daysInMonth === 30) return 6;
  if (daysInMonth === 29) return 6;
  return 5;
}

/**
 * Calcula el descanso en horas entre el turno del día 1 y el turno del día 2 consecutivos.
 * Turno M: 06:00 a 14:00
 * Turno T: 14:00 a 22:00
 * Turno N: 22:00 a 06:00 (día siguiente)
 */
export function calculateInterShiftRestHours(shift1: ShiftCode, shift2: ShiftCode): number {
  if (shift1 === 'F' || shift1 === 'V' || shift1 === 'L') {
    return 32;
  }
  if (shift2 === 'F' || shift2 === 'V' || shift2 === 'L') {
    return 32;
  }

  // Ambos son turnos de trabajo consecutivos:
  if (shift1 === 'M') {
    if (shift2 === 'M') return 16;
    if (shift2 === 'T') return 24;
    if (shift2 === 'N') return 32;
  }

  if (shift1 === 'T') {
    if (shift2 === 'M') return 8; // Infracción < 12hs
    if (shift2 === 'T') return 16;
    if (shift2 === 'N') return 24;
  }

  if (shift1 === 'N') {
    if (shift2 === 'M') return 0; // Infracción grave 0hs
    if (shift2 === 'T') return 8; // Infracción < 12hs
    if (shift2 === 'N') return 16;
  }

  return 16;
}

/**
 * Calcula las horas de descanso continuo durante un bloque de francos
 */
export function calculateContinuousRestDuringFrancos(
  prevWorkShift: ShiftCode,
  nextWorkShift: ShiftCode,
  consecutiveRestDays: number
): number {
  // Horas desde fin de prevWorkShift hasta medianoche:
  let hoursDayBefore = 10; // Mañana termina a las 14:00 -> 10hs
  if (prevWorkShift === 'T') hoursDayBefore = 2; // Tarde termina a las 22:00 -> 2hs
  if (prevWorkShift === 'N') hoursDayBefore = -6; // Noche termina a las 06:00 del día de franco!

  // Días completos de descanso:
  const hoursFullRestDays = (consecutiveRestDays - 1) * 24;

  // Horas desde medianoche hasta inicio de nextWorkShift:
  let hoursDayAfter = 6; // Mañana inicia a las 06:00 -> 6hs
  if (nextWorkShift === 'T') hoursDayAfter = 14; // Tarde inicia a las 14:00 -> 14hs
  if (nextWorkShift === 'N') hoursDayAfter = 22; // Noche inicia a las 22:00 -> 22hs

  return hoursDayBefore + 24 + hoursFullRestDays + hoursDayAfter;
}

/**
 * Valida el cumplimiento legal para un empleado individual en el mes
 */
export function auditEmployeeRoster(
  employee: Employee,
  assignments: Record<number, ShiftCode>,
  year: number,
  month: number
): EmployeeCompliance {
  const daysInMonth = getDaysInMonth(year, month);
  const requiredFrancos = getRequiredFrancos(daysInMonth);
  const alerts: LegalAlert[] = [];

  let totalFrancos = 0;
  let totalHoras = 0;
  let currentConsecutiveWork = 0;
  let maxConsecutiveWork = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const shift = assignments[day] || 'F';
    const shiftDef = SHIFTS[shift];

    if (shiftDef.isRest) {
      if (shift === 'F') totalFrancos++;
      currentConsecutiveWork = 0;
    } else {
      totalHoras += shiftDef.hours;
      currentConsecutiveWork++;
      if (currentConsecutiveWork > maxConsecutiveWork) {
        maxConsecutiveWork = currentConsecutiveWork;
      }

      // Regla: Alerta si pasan más de 6 días consecutivos sin descanso
      if (currentConsecutiveWork === 6) {
        alerts.push({
          id: `warn-cons-${employee.id}-${day}`,
          employeeId: employee.id,
          employeeName: `${employee.nombre} ${employee.apellido}`,
          severity: 'WARNING',
          ruleCode: 'MAX_DIAS_CONSECUTIVOS',
          title: 'Límite de jornadas consecutivas',
          message: `Acumula 6 días continuos trabajados hasta el día ${day}. Se requiere franco inminente.`,
          day,
          articleRef: 'LCT Art. 204 / CCT 460/73',
        });
      } else if (currentConsecutiveWork > 6) {
        alerts.push({
          id: `err-cons-${employee.id}-${day}`,
          employeeId: employee.id,
          employeeName: `${employee.nombre} ${employee.apellido}`,
          severity: 'DANGER',
          ruleCode: 'MAX_DIAS_CONSECUTIVOS',
          title: 'Infracción: > 6 días seguidos trabajados',
          message: `Supera el máximo legal con ${currentConsecutiveWork} días consecutivos de servicio sin franco (día ${day}).`,
          day,
          articleRef: 'LCT Art. 204 y Ley 11.544',
        });
      }
    }

    // Regla de Descanso Interjornada entre turnos consecutivos
    if (day < daysInMonth) {
      const nextShift = assignments[day + 1];
      if (nextShift) {
        const restHours = calculateInterShiftRestHours(shift, nextShift);
        if (restHours < 12 && !shiftDef.isRest && !SHIFTS[nextShift].isRest) {
          alerts.push({
            id: `err-rest-${employee.id}-${day}`,
            employeeId: employee.id,
            employeeName: `${employee.nombre} ${employee.apellido}`,
            severity: 'DANGER',
            ruleCode: 'DESCANSO_INTERJORNADA',
            title: 'Descanso entre turnos insuficiente',
            message: `Solo ${restHours} hs de pausa entre ${shiftDef.label} (día ${day}) y ${SHIFTS[nextShift].label} (día ${day + 1}). Mínimo legal: 12 hs.`,
            day: day + 1,
            articleRef: 'LCT Art. 197 (Pausa interjornada)',
          });
        }
      }
    }
  }

  // Regla: Descanso semanal continuo menor a 48 horas
  // Evaluar cada bloque de francos aislados rodeados de trabajo
  for (let day = 1; day <= daysInMonth; day++) {
    const shift = assignments[day];
    if (shift === 'F' && day > 1 && day < daysInMonth) {
      const prevShift = assignments[day - 1];
      const nextShift = assignments[day + 1];

      // Si es un franco simple entre dos turnos de trabajo:
      if (prevShift && nextShift && !SHIFTS[prevShift].isRest && !SHIFTS[nextShift].isRest) {
        const continuousRest = calculateContinuousRestDuringFrancos(prevShift, nextShift, 1);
        if (continuousRest < 48) {
          alerts.push({
            id: `warn-weekly-rest-${employee.id}-${day}`,
            employeeId: employee.id,
            employeeName: `${employee.nombre} ${employee.apellido}`,
            severity: 'WARNING',
            ruleCode: 'DESCANSO_SEMANAL',
            title: 'Descanso semanal menor a 48 horas',
            message: `El franco del día ${day} solo otorga ${continuousRest} hs continuas entre ${SHIFTS[prevShift].shortLabel} y ${SHIFTS[nextShift].shortLabel} (pauta aconsejada: 48 hs continuas).`,
            day,
            articleRef: 'Régimen de Descanso Semanal / CCT Transporte',
          });
        }
      }
    }
  }

  // Regla: Control de francos mensuales obligatorios (6 en 30 días, 7 en 31 días)
  if (totalFrancos < requiredFrancos) {
    const diff = requiredFrancos - totalFrancos;
    alerts.push({
      id: `err-francos-${employee.id}`,
      employeeId: employee.id,
      employeeName: `${employee.nombre} ${employee.apellido}`,
      severity: 'DANGER',
      ruleCode: 'FRANCOS_MINIMOS',
      title: 'Francos mensuales insuficientes',
      message: `Tiene ${totalFrancos} francos asignados de los ${requiredFrancos} obligatorios para este mes (-${diff} francos).`,
      articleRef: 'Convenio Colectivo de Trabajo / Régimen de Descansos',
    });
  }

  // Determinar severidad general
  let overallSeverity: LegalAlertSeverity = 'OK';
  if (alerts.some((a) => a.severity === 'DANGER')) {
    overallSeverity = 'DANGER';
  } else if (alerts.some((a) => a.severity === 'WARNING')) {
    overallSeverity = 'WARNING';
  }

  return {
    employeeId: employee.id,
    totalFrancos,
    francosRequeridos: requiredFrancos,
    maxConsecutiveWorkDays: maxConsecutiveWork,
    totalHorasMes: totalHoras,
    alerts,
    overallSeverity,
  };
}

/**
 * Audita el diagrama completo de todos los empleados
 */
export function auditEntireRoster(
  employees: Employee[],
  roster: MonthlyRoster
): RosterAuditSummary {
  const activeOperativos = employees.filter(
    (e) => e.activo && e.role === 'OPERATIVO' && (e.estadoPerfil === undefined || e.estadoPerfil === 'APROBADO')
  );
  const allAlerts: LegalAlert[] = [];

  let compliantCount = 0;
  let violationsCount = 0;
  let warningsCount = 0;

  activeOperativos.forEach((emp) => {
    const userAssignments = roster.asignaciones[emp.id] || {};
    const compliance = auditEmployeeRoster(emp, userAssignments, roster.anio, roster.mes);

    allAlerts.push(...compliance.alerts);

    if (compliance.overallSeverity === 'DANGER') {
      violationsCount++;
    } else if (compliance.overallSeverity === 'WARNING') {
      warningsCount++;
    } else {
      compliantCount++;
    }
  });

  const dangerAlertsCount = allAlerts.filter((a) => a.severity === 'DANGER').length;
  const estimatedSavings = dangerAlertsCount * ESTIMATED_FINE_PER_VIOLATION_ARS;

  return {
    totalEmployees: activeOperativos.length,
    totalCompliant: compliantCount,
    totalViolations: violationsCount,
    totalWarnings: warningsCount,
    estimatedFinesAvoidedArs: estimatedSavings,
    alertsList: allAlerts,
  };
}
