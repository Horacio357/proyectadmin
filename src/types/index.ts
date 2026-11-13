export type Role = 'SUPER_ADMIN' | 'OPERATIVO';

export type JobPosition = 'CHOFER' | 'MECANICO' | 'INSPECTOR';

export type ShiftCode = 'M' | 'T' | 'N' | 'F' | 'V' | 'L';

export type ThemeMode = 'light' | 'dark';

export type MatrixViewMode = 'grid' | 'agenda';

export type ProfileStatus = 'APROBADO' | 'PENDIENTE' | 'DENEGADO';

export interface ShiftDefinition {
  code: ShiftCode;
  label: string;
  shortLabel: string;
  timeRange: string;
  hours: number;
  isRest: boolean;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
}

export interface Employee {
  id: string;
  legajo: string;
  nombre: string;
  apellido: string;
  email: string;
  role: Role;
  puesto: JobPosition;
  preferenciaTurno: 'M' | 'T' | 'N' | 'ROTATIVO';
  activo: boolean;
  estadoPerfil: ProfileStatus;
  motivoRechazo?: string;
  telefono?: string;
  antiguedadAnios: number;
}

export type MonthlyAssignments = Record<string, Record<number, ShiftCode>>;

export interface MonthlyRoster {
  id: string;
  anio: number;
  mes: number; // 1-12
  nombre: string;
  estado: 'BORRADOR' | 'OPTIMIZADO_IA' | 'PUBLICADO';
  asignaciones: MonthlyAssignments;
  updatedAt: string;
}

export type LegalAlertSeverity = 'OK' | 'WARNING' | 'DANGER';

export interface LegalAlert {
  id: string;
  employeeId: string;
  employeeName: string;
  severity: LegalAlertSeverity;
  ruleCode: 'FRANCOS_MINIMOS' | 'MAX_DIAS_CONSECUTIVOS' | 'DESCANSO_INTERJORNADA' | 'DESCANSO_SEMANAL';
  title: string;
  message: string;
  day?: number;
  articleRef: string;
}

export interface EmployeeCompliance {
  employeeId: string;
  totalFrancos: number;
  francosRequeridos: number;
  maxConsecutiveWorkDays: number;
  totalHorasMes: number;
  alerts: LegalAlert[];
  overallSeverity: LegalAlertSeverity;
}

export interface RosterAuditSummary {
  totalEmployees: number;
  totalCompliant: number;
  totalViolations: number;
  totalWarnings: number;
  estimatedFinesAvoidedArs: number;
  alertsList: LegalAlert[];
}

export interface StaffRequirement {
  puesto: JobPosition;
  minManana: number;
  minTarde: number;
  minNoche: number;
}

export type SuggestionType = 'CAMBIO_TURNO' | 'PEDIDO_FRANCO' | 'PERMUTA_1_A_1' | 'OBSERVACION';

export interface SuggestionRequest {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  puesto: JobPosition;
  dia: number;
  mes: number;
  anio: number;
  tipo: SuggestionType;
  turnoActual: ShiftCode;
  turnoDeseado?: ShiftCode;
  // Campos específicos para Permuta 1 a 1 entre compañeros
  companeroId?: string;
  companeroNombre?: string;
  companeroTurnoActual?: ShiftCode;
  motivo: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  respuestaAdmin?: string;
  fechaCreacion: string;
}
