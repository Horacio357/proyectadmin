import { Employee, MonthlyRoster, SuggestionRequest } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  // Super Admin
  {
    id: 'emp-admin-1',
    legajo: 'ADM-001',
    nombre: 'Dante',
    apellido: 'Alighieri',
    email: 'gerencia@transporte-tucuman.com.ar',
    role: 'SUPER_ADMIN',
    puesto: 'INSPECTOR',
    preferenciaTurno: 'M',
    activo: true,
    estadoPerfil: 'APROBADO',
    antiguedadAnios: 12,
  },
  // Choferes Aprobados (Línea Urbana e Interurbana Tucumán)
  {
    id: 'emp-chof-1',
    legajo: 'CH-101',
    nombre: 'Carlos',
    apellido: 'Benítez',
    email: 'carlos.benitez@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'M',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-455-1234',
    antiguedadAnios: 8,
  },
  {
    id: 'emp-chof-2',
    legajo: 'CH-102',
    nombre: 'Juan Pablo',
    apellido: 'Mansilla',
    email: 'juan.mansilla@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'M',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-498-5678',
    antiguedadAnios: 5,
  },
  {
    id: 'emp-chof-3',
    legajo: 'CH-103',
    nombre: 'Esteban',
    apellido: 'Palavecino',
    email: 'esteban.palavecino@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'T',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-512-3490',
    antiguedadAnios: 10,
  },
  {
    id: 'emp-chof-4',
    legajo: 'CH-104',
    nombre: 'Gustavo',
    apellido: 'Medina',
    email: 'gustavo.medina@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'T',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-678-9012',
    antiguedadAnios: 3,
  },
  {
    id: 'emp-chof-5',
    legajo: 'CH-105',
    nombre: 'Miguel Ángel',
    apellido: 'Roldán',
    email: 'miguel.roldan@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'N',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-432-1098',
    antiguedadAnios: 7,
  },
  {
    id: 'emp-chof-6',
    legajo: 'CH-106',
    nombre: 'Rodrigo',
    apellido: 'Albornoz',
    email: 'rodrigo.albornoz@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'ROTATIVO',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-544-7788',
    antiguedadAnios: 2,
  },
  {
    id: 'emp-chof-7',
    legajo: 'CH-107',
    nombre: 'Fernando',
    apellido: 'Chávez',
    email: 'fernando.chavez@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'M',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-411-9900',
    antiguedadAnios: 6,
  },
  {
    id: 'emp-chof-8',
    legajo: 'CH-108',
    nombre: 'Lucas',
    apellido: 'Ceballos',
    email: 'lucas.ceballos@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'T',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-422-3344',
    antiguedadAnios: 4,
  },
  {
    id: 'emp-chof-9',
    legajo: 'CH-109',
    nombre: 'Matías',
    apellido: 'Argañaraz',
    email: 'matias.arganaraz@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'N',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-588-2211',
    antiguedadAnios: 9,
  },
  {
    id: 'emp-chof-10',
    legajo: 'CH-110',
    nombre: 'Alejandro',
    apellido: 'Díaz',
    email: 'alejandro.diaz@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'ROTATIVO',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-466-5544',
    antiguedadAnios: 1,
  },

  // Mecánicos Aprobados (Taller Central de Mantenimiento)
  {
    id: 'emp-mec-1',
    legajo: 'MEC-201',
    nombre: 'Roberto',
    apellido: 'Gómez',
    email: 'roberto.gomez@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'MECANICO',
    preferenciaTurno: 'M',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-555-1122',
    antiguedadAnios: 15,
  },
  {
    id: 'emp-mec-2',
    legajo: 'MEC-202',
    nombre: 'Javier',
    apellido: 'Peralta',
    email: 'javier.peralta@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'MECANICO',
    preferenciaTurno: 'T',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-555-3344',
    antiguedadAnios: 7,
  },
  {
    id: 'emp-mec-3',
    legajo: 'MEC-203',
    nombre: 'Jorge',
    apellido: 'Suárez',
    email: 'jorge.suarez@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'MECANICO',
    preferenciaTurno: 'N',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-555-5566',
    antiguedadAnios: 4,
  },
  {
    id: 'emp-mec-4',
    legajo: 'MEC-204',
    nombre: 'Nicolás',
    apellido: 'Barrientos',
    email: 'nicolas.barrientos@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'MECANICO',
    preferenciaTurno: 'ROTATIVO',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-555-7788',
    antiguedadAnios: 3,
  },

  // Inspectores Aprobados (Control de Líneas y Boletos)
  {
    id: 'emp-insp-1',
    legajo: 'INS-301',
    nombre: 'Marcos',
    apellido: 'Díaz',
    email: 'marcos.diaz@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'INSPECTOR',
    preferenciaTurno: 'M',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-444-1212',
    antiguedadAnios: 11,
  },
  {
    id: 'emp-insp-2',
    legajo: 'INS-302',
    nombre: 'Héctor',
    apellido: 'Luna',
    email: 'hector.luna@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'INSPECTOR',
    preferenciaTurno: 'T',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-444-3434',
    antiguedadAnios: 8,
  },
  {
    id: 'emp-insp-3',
    legajo: 'INS-303',
    nombre: 'Cristian',
    apellido: 'Villalba',
    email: 'cristian.villalba@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'INSPECTOR',
    preferenciaTurno: 'ROTATIVO',
    activo: true,
    estadoPerfil: 'APROBADO',
    telefono: '381-444-5656',
    antiguedadAnios: 6,
  },

  // Perfiles PENDIENTES DE APROBACIÓN (para prueba del Super Administrador)
  {
    id: 'emp-pend-1',
    legajo: 'CH-115',
    nombre: 'Ramón',
    apellido: 'Valdez',
    email: 'ramon.valdez@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'CHOFER',
    preferenciaTurno: 'M',
    activo: false,
    estadoPerfil: 'PENDIENTE',
    telefono: '381-622-4411',
    antiguedadAnios: 0,
  },
  {
    id: 'emp-pend-2',
    legajo: 'MEC-205',
    nombre: 'Mauricio',
    apellido: 'Luna',
    email: 'mauricio.luna@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'MECANICO',
    preferenciaTurno: 'T',
    activo: false,
    estadoPerfil: 'PENDIENTE',
    telefono: '381-533-8822',
    antiguedadAnios: 0,
  },

  // Perfil DENEGADO (ejemplo histórico)
  {
    id: 'emp-den-1',
    legajo: 'INS-305',
    nombre: 'Esteban',
    apellido: 'Juárez',
    email: 'esteban.juarez@transporte-tucuman.com.ar',
    role: 'OPERATIVO',
    puesto: 'INSPECTOR',
    preferenciaTurno: 'N',
    activo: false,
    estadoPerfil: 'DENEGADO',
    motivoRechazo: 'Licencia Nacional Habilitante vencida y falta de homologación médica.',
    telefono: '381-400-9911',
    antiguedadAnios: 0,
  },
];

// Generador de asignaciones iniciales realistas para el mes de Noviembre (30 días)
export function generateInitialAssignments(year: number = 2026, month: number = 11): MonthlyRoster {
  const daysInMonth = 30;
  const asignaciones: Record<string, Record<number, any>> = {};

  // Solo generar turnos para empleados que estén APROBADOS
  INITIAL_EMPLOYEES.filter(e => e.role === 'OPERATIVO' && e.estadoPerfil === 'APROBADO').forEach((emp, index) => {
    asignaciones[emp.id] = {};
    const cycleOffset = index % 7;

    for (let day = 1; day <= daysInMonth; day++) {
      const isRestDay = (day + cycleOffset) % 5 === 0;

      if (isRestDay) {
        asignaciones[emp.id][day] = 'F';
      } else {
        if (emp.preferenciaTurno === 'M') {
          asignaciones[emp.id][day] = 'M';
        } else if (emp.preferenciaTurno === 'T') {
          asignaciones[emp.id][day] = 'T';
        } else if (emp.preferenciaTurno === 'N') {
          asignaciones[emp.id][day] = 'N';
        } else {
          const week = Math.floor((day - 1) / 7);
          const rotShifts = ['M', 'T', 'N'];
          asignaciones[emp.id][day] = rotShifts[(week + index) % 3];
        }
      }
    }
  });

  // Infracciones intencionales para demonstración del semáforo legal:
  // 1) Chofer Carlos Benítez: 7 días seguidos trabajados (días 10 al 17 sin franco)
  if (asignaciones['emp-chof-1']) {
    for (let d = 10; d <= 17; d++) {
      asignaciones['emp-chof-1'][d] = 'M';
    }
  }

  // 2) Chofer Juan Pablo Mansilla: turno Tarde el día 5 y turno Mañana el día 6 (< 12h descanso)
  if (asignaciones['emp-chof-2']) {
    asignaciones['emp-chof-2'][5] = 'T';
    asignaciones['emp-chof-2'][6] = 'M';
  }

  return {
    id: `roster-${year}-${month}`,
    anio: year,
    mes: month,
    nombre: `Diagrama Mensual - Noviembre ${year}`,
    estado: 'BORRADOR',
    asignaciones,
    updatedAt: new Date().toISOString(),
  };
}

export const INITIAL_SUGGESTIONS: SuggestionRequest[] = [
  {
    id: 'sug-1',
    usuarioId: 'emp-chof-1',
    usuarioNombre: 'Carlos Benítez',
    puesto: 'CHOFER',
    dia: 14,
    mes: 11,
    anio: 2026,
    tipo: 'PEDIDO_FRANCO',
    turnoActual: 'M',
    turnoDeseado: 'F',
    motivo: 'Trámite urgente de renovación de Licencia Nacional Habilitante (LNH) en San Miguel de Tucumán.',
    estado: 'PENDIENTE',
    fechaCreacion: '2026-10-28T09:30:00Z',
  },
  {
    id: 'sug-2',
    usuarioId: 'emp-mec-1',
    usuarioNombre: 'Roberto Gómez',
    puesto: 'MECANICO',
    dia: 18,
    mes: 11,
    anio: 2026,
    tipo: 'CAMBIO_TURNO',
    turnoActual: 'T',
    turnoDeseado: 'M',
    motivo: 'Permuta acordada con Javier Peralta para cubrir guardia de fosa por la mañana.',
    estado: 'PENDIENTE',
    fechaCreacion: '2026-10-29T14:15:00Z',
  },
];
