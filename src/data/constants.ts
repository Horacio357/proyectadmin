import { JobPosition, ShiftCode, ShiftDefinition, StaffRequirement } from '../types';

export const SHIFTS: Record<ShiftCode, ShiftDefinition> = {
  M: {
    code: 'M',
    label: 'Turno Mañana',
    shortLabel: 'Mañana',
    timeRange: '06:00 - 14:00',
    hours: 8,
    isRest: false,
    bgClass: 'bg-sky-50/95 text-sky-700 border-sky-200/90 hover:bg-sky-100 hover:border-sky-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60 dark:hover:bg-blue-900/50',
    textClass: 'text-sky-700 dark:text-blue-300',
    borderClass: 'border-sky-200 dark:border-blue-700/50',
    badgeBg: 'bg-sky-100/90 text-sky-800 border-sky-300/80 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
    badgeText: 'text-sky-800 dark:text-blue-300',
  },
  T: {
    code: 'T',
    label: 'Turno Tarde',
    shortLabel: 'Tarde',
    timeRange: '14:00 - 22:00',
    hours: 8,
    isRest: false,
    bgClass: 'bg-amber-50/95 text-amber-800 border-amber-200/90 hover:bg-amber-100 hover:border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 dark:hover:bg-amber-900/50',
    textClass: 'text-amber-800 dark:text-amber-300',
    borderClass: 'border-amber-200 dark:border-amber-700/50',
    badgeBg: 'bg-amber-100/90 text-amber-800 border-amber-300/80 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
    badgeText: 'text-amber-800 dark:text-amber-300',
  },
  N: {
    code: 'N',
    label: 'Turno Noche',
    shortLabel: 'Noche',
    timeRange: '22:00 - 06:00',
    hours: 8,
    isRest: false,
    bgClass: 'bg-indigo-50/95 text-indigo-700 border-indigo-200/90 hover:bg-indigo-100 hover:border-indigo-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60 dark:hover:bg-purple-900/50',
    textClass: 'text-indigo-700 dark:text-purple-300',
    borderClass: 'border-indigo-200 dark:border-purple-700/50',
    badgeBg: 'bg-indigo-100/90 text-indigo-800 border-indigo-300/80 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30',
    badgeText: 'text-indigo-800 dark:text-purple-300',
  },
  F: {
    code: 'F',
    label: 'Franco / Descanso',
    shortLabel: 'Franco',
    timeRange: 'Descanso 24h',
    hours: 0,
    isRest: true,
    bgClass: 'bg-emerald-50/95 text-emerald-700 border-emerald-200/90 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60 dark:hover:bg-emerald-900/60',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    borderClass: 'border-emerald-200 dark:border-emerald-700/50',
    badgeBg: 'bg-emerald-100/90 text-emerald-800 border-emerald-300/80 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
  },
  V: {
    code: 'V',
    label: 'Vacaciones',
    shortLabel: 'Vacaciones',
    timeRange: 'Licencia Anual',
    hours: 0,
    isRest: true,
    bgClass: 'bg-teal-50/95 text-teal-800 border-teal-200/90 hover:bg-teal-100 hover:border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60 dark:hover:bg-teal-900/50',
    textClass: 'text-teal-800 dark:text-teal-300',
    borderClass: 'border-teal-200 dark:border-teal-700/50',
    badgeBg: 'bg-teal-100/90 text-teal-800 border-teal-300/80 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30',
    badgeText: 'text-teal-800 dark:text-teal-300',
  },
  L: {
    code: 'L',
    label: 'Licencia Médica / Esp.',
    shortLabel: 'Licencia',
    timeRange: 'Justificada',
    hours: 0,
    isRest: true,
    bgClass: 'bg-rose-50/95 text-rose-700 border-rose-200/90 hover:bg-rose-100 hover:border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 dark:hover:bg-rose-900/50',
    textClass: 'text-rose-700 dark:text-rose-300',
    borderClass: 'border-rose-200 dark:border-rose-700/50',
    badgeBg: 'bg-rose-100/90 text-rose-800 border-rose-300/80 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30',
    badgeText: 'text-rose-800 dark:text-rose-300',
  },
};

export const POSITION_CONFIG: Record<JobPosition, {
  label: string;
  plural: string;
  colorHex: string;
  badgeClass: string;
  pillClass: string;
  borderAccent: string;
  icon: string;
}> = {
  CHOFER: {
    label: 'Chofer',
    plural: 'Choferes',
    colorHex: '#0284c7',
    badgeClass: 'bg-sky-50/90 text-sky-700 border border-sky-200/90 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30',
    pillClass: 'bg-sky-600 text-white',
    borderAccent: 'border-l-4 border-l-sky-500',
    icon: 'Bus',
  },
  MECANICO: {
    label: 'Mecánico',
    plural: 'Mecánicos',
    colorHex: '#d97706',
    badgeClass: 'bg-amber-50/90 text-amber-700 border border-amber-200/90 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    pillClass: 'bg-amber-600 text-white',
    borderAccent: 'border-l-4 border-l-amber-500',
    icon: 'Wrench',
  },
  INSPECTOR: {
    label: 'Inspector',
    plural: 'Inspectores',
    colorHex: '#16a34a',
    badgeClass: 'bg-emerald-50/90 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    pillClass: 'bg-emerald-600 text-white',
    borderAccent: 'border-l-4 border-l-emerald-500',
    icon: 'ShieldCheck',
  },
};

export const DEFAULT_STAFF_REQUIREMENTS: StaffRequirement[] = [
  {
    puesto: 'CHOFER',
    minManana: 6,
    minTarde: 6,
    minNoche: 3,
  },
  {
    puesto: 'MECANICO',
    minManana: 2,
    minTarde: 2,
    minNoche: 1,
  },
  {
    puesto: 'INSPECTOR',
    minManana: 2,
    minTarde: 2,
    minNoche: 1,
  },
];

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DAY_NAMES_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getDayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay();
}

// Multa estimativa promedio por infracción laboral no subsanada (LCT 20.744 / Ley 25.212 en Tucumán/Argentina)
export const ESTIMATED_FINE_PER_VIOLATION_ARS = 280000;
