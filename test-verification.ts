import assert from 'node:assert/strict';
import {
  getRequiredFrancos,
  calculateInterShiftRestHours,
  auditEmployeeRoster,
  auditEntireRoster,
} from './src/services/legalEngine';
import {
  INITIAL_EMPLOYEES,
  generateInitialAssignments,
} from './src/data/seedData';
import { generateHeuristicRoster } from './src/services/aiOptimizer';
import { DEFAULT_STAFF_REQUIREMENTS } from './src/data/constants';

console.log('--- Iniciando Verificación de Reglas y Lógica de Negocio ---');

// 1. Prueba de Francos Requeridos
assert.equal(getRequiredFrancos(30), 6, 'En meses de 30 días deben ser 6 francos obligatorios');
assert.equal(getRequiredFrancos(31), 7, 'En meses de 31 días deben ser 7 francos obligatorios');
assert.equal(getRequiredFrancos(28), 5, 'En febrero de 28 días deben ser 5 francos obligatorios');
console.log('✓ Prueba 1 superada: Francos obligatorios 6 (30d) y 7 (31d) calculados correctamente.');

// 2. Prueba de Descanso Interjornada
const restTM = calculateInterShiftRestHours('T', 'M');
assert.equal(restTM, 8, 'Turno Tarde seguido de Mañana debe dar 8 horas de descanso');
assert.ok(restTM < 12, '8 horas es menor a las 12 horas mínimas legales');

const restNM = calculateInterShiftRestHours('N', 'M');
assert.equal(restNM, 0, 'Turno Noche seguido de Mañana debe dar 0 horas');

const restMM = calculateInterShiftRestHours('M', 'M');
assert.equal(restMM, 16, 'Turno Mañana seguido de Mañana debe dar 16 horas');
assert.ok(restMM >= 12, '16 horas cumple el mínimo de 12 horas');
console.log('✓ Prueba 2 superada: Descansos entre turnos y detección de descansos < 12h.');

// 3. Auditoría de datos semilla
const initialRoster = generateInitialAssignments(2026, 11);
const audit = auditEntireRoster(INITIAL_EMPLOYEES, initialRoster);
console.log(`Auditoría inicial: ${audit.totalViolations} violaciones detectadas a propósito en seed data.`);
assert.ok(audit.totalViolations > 0, 'Deben existir infracciones de prueba en el seed data');
assert.ok(audit.estimatedFinesAvoidedArs > 0, 'Debe calcular multa potencial en ARS');
console.log('✓ Prueba 3 superada: Auditoría de diagrama y semáforo legal funcionan correctamente.');

// 4. Prueba del Solver de Optimización IA
const opt = generateHeuristicRoster(INITIAL_EMPLOYEES, DEFAULT_STAFF_REQUIREMENTS, 2026, 11);
const optRoster = {
  ...initialRoster,
  asignaciones: opt.assignments,
};
const auditOpt = auditEntireRoster(INITIAL_EMPLOYEES, optRoster);
console.log(`Auditoría tras optimización: ${auditOpt.totalViolations} violaciones.`);
assert.equal(auditOpt.totalViolations, 0, 'Tras optimización con IA no debe haber ninguna violación legal!');
assert.equal(auditOpt.totalWarnings, 0, 'No debe haber alertas preventivas críticas');
console.log('✓ Prueba 4 superada: Asistente IA genera diagrama con 100% de cumplimiento legal.');

console.log('=============================================');
console.log(' ¡TODAS LAS PRUEBAS DE NEGOCIO PASARON (4/4)! ');
console.log('=============================================');
