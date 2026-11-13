import { Employee, MonthlyRoster, ShiftCode } from '../types';
import { getDaysInMonth, SHIFTS } from '../data/constants';
import { auditEmployeeRoster } from './legalEngine';

export async function exportRosterToExcel(
  roster: MonthlyRoster,
  employees: Employee[]
): Promise<void> {
  // Carga diferida dinámica de XLSX para no penalizar el bundle inicial
  const XLSX = await import('xlsx');
  const daysInMonth = getDaysInMonth(roster.anio, roster.mes);
  const activeOperativos = employees.filter((e) => e.activo && e.role === 'OPERATIVO');

  // Construir cabeceras
  const headers = ['Legajo', 'Empleado', 'Puesto'];
  for (let d = 1; d <= daysInMonth; d++) {
    headers.push(`Día ${d}`);
  }
  headers.push('Francos Totales', 'Horas Mes', 'Estado Legal');

  // Construir filas
  const rows: any[][] = [headers];

  activeOperativos.forEach((emp) => {
    const userAssignments = roster.asignaciones[emp.id] || {};
    const compliance = auditEmployeeRoster(emp, userAssignments, roster.anio, roster.mes);

    const row: any[] = [
      emp.legajo,
      `${emp.nombre} ${emp.apellido}`,
      emp.puesto,
    ];

    for (let d = 1; d <= daysInMonth; d++) {
      const shift: ShiftCode = userAssignments[d] || 'F';
      row.push(shift);
    }

    row.push(
      compliance.totalFrancos,
      compliance.totalHorasMes,
      compliance.overallSeverity === 'OK' ? 'CONFORME (100%)' : compliance.overallSeverity === 'WARNING' ? 'ALERTA PREVENTIVA' : 'INFRACCIÓN'
    );

    rows.push(row);
  });

  // Crear hoja de cálculo
  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Ajustar anchos de columnas
  const colWidths = [
    { wch: 10 }, // Legajo
    { wch: 22 }, // Empleado
    { wch: 12 }, // Puesto
    ...Array.from({ length: daysInMonth }, () => ({ wch: 4 })), // Días
    { wch: 14 }, // Francos
    { wch: 12 }, // Horas
    { wch: 18 }, // Estado
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Turnos_${roster.mes}_${roster.anio}`);

  // Descargar archivo
  XLSX.writeFile(workbook, `Diagrama_Turnos_${roster.mes}_${roster.anio}_Transporte.xlsx`);
}
