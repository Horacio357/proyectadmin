import { Employee, MonthlyRoster, StaffRequirement, SuggestionRequest, ThemeMode } from '../types';
import {
  DEFAULT_STAFF_REQUIREMENTS,
} from '../data/constants';
import {
  generateInitialAssignments,
  INITIAL_EMPLOYEES,
  INITIAL_SUGGESTIONS,
} from '../data/seedData';

const STORAGE_KEYS = {
  EMPLOYEES: 'turnosmart_employees_v1',
  ROSTER: 'turnosmart_roster_v1',
  SUGGESTIONS: 'turnosmart_suggestions_v1',
  REQUIREMENTS: 'turnosmart_requirements_v1',
  API_KEY: 'turnosmart_gemini_key_v1',
  CURRENT_USER_ID: 'turnosmart_current_user_id_v1',
  THEME: 'turnosmart_theme_v2',
};

export const storageService = {
  getTheme(): ThemeMode {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw === 'light' || raw === 'dark') {
      return raw;
    }
    // Modo Día por defecto al iniciar la aplicación; luego el usuario puede cambiar manualmente a Modo Noche
    return 'light';
  },

  saveTheme(theme: ThemeMode): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getEmployees(): Employee[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (!raw) {
      this.saveEmployees(INITIAL_EMPLOYEES);
      return INITIAL_EMPLOYEES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EMPLOYEES;
    }
  },

  saveEmployees(employees: Employee[]): void {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getRosterKey(year: number, month: number): string {
    return `turnosmart_roster_${year}_${month}`;
  },

  getRoster(year: number = 2026, month: number = 11): MonthlyRoster {
    const dynamicKey = this.getRosterKey(year, month);
    let raw = localStorage.getItem(dynamicKey);
    // Compatibilidad hacia atrás si era Noviembre 2026
    if (!raw && year === 2026 && month === 11) {
      raw = localStorage.getItem(STORAGE_KEYS.ROSTER);
    }

    if (!raw) {
      const initial = generateInitialAssignments(year, month);
      this.saveRoster(initial);
      return initial;
    }
    try {
      const parsed: MonthlyRoster = JSON.parse(raw);
      if (parsed.anio !== year || parsed.mes !== month) {
        const initial = generateInitialAssignments(year, month);
        this.saveRoster(initial);
        return initial;
      }
      return parsed;
    } catch {
      const initial = generateInitialAssignments(year, month);
      this.saveRoster(initial);
      return initial;
    }
  },

  saveRoster(roster: MonthlyRoster): void {
    const key = this.getRosterKey(roster.anio, roster.mes);
    localStorage.setItem(key, JSON.stringify(roster));
    if (roster.anio === 2026 && roster.mes === 11) {
      localStorage.setItem(STORAGE_KEYS.ROSTER, JSON.stringify(roster));
    }
  },

  getSuggestions(): SuggestionRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
    if (!raw) {
      this.saveSuggestions(INITIAL_SUGGESTIONS);
      return INITIAL_SUGGESTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUGGESTIONS;
    }
  },

  saveSuggestions(suggestions: SuggestionRequest[]): void {
    localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(suggestions));
  },

  getRequirements(): StaffRequirement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUIREMENTS);
    if (!raw) {
      this.saveRequirements(DEFAULT_STAFF_REQUIREMENTS);
      return DEFAULT_STAFF_REQUIREMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_STAFF_REQUIREMENTS;
    }
  },

  saveRequirements(reqs: StaffRequirement[]): void {
    localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(reqs));
  },

  getApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  },

  saveApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  },

  getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || INITIAL_EMPLOYEES[0].id;
  },

  saveCurrentUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.ROSTER);
    localStorage.removeItem(STORAGE_KEYS.SUGGESTIONS);
    localStorage.removeItem(STORAGE_KEYS.REQUIREMENTS);
    // Limpiar claves dinámicas de meses
    if (typeof localStorage !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('turnosmart_roster_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    }
  },
};
