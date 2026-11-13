import React, { useState, useRef, useEffect } from 'react';
import { ShiftCode, LegalAlert } from '../../types';
import { SHIFTS } from '../../data/constants';
import { X } from 'lucide-react';

interface MatrixCellProps {
  employeeId: string;
  day: number;
  shift: ShiftCode;
  onUpdateShift: (employeeId: string, day: number, newShift: ShiftCode) => void;
  dayAlert?: LegalAlert;
  isWeekend?: boolean;
}

const MatrixCellBase: React.FC<MatrixCellProps> = ({
  employeeId,
  day,
  shift,
  onUpdateShift,
  dayAlert,
  isWeekend,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shiftDef = SHIFTS[shift] || SHIFTS.F;

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Soporte para atajos de teclado cuando el elemento tiene foco
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (key === 'M' || key === 'T' || key === 'N' || key === 'F' || key === 'V' || key === 'L') {
      e.preventDefault();
      onUpdateShift(employeeId, day, key as ShiftCode);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative min-w-[32px] sm:min-w-[34px] w-full h-9 flex items-center justify-center border-r border-b border-slate-200 dark:border-slate-800 select-none ${
        isWeekend ? 'bg-slate-100/60 dark:bg-slate-900/40' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        title={`${shiftDef.label} (${shiftDef.timeRange})${dayAlert ? ` - [ALERTA] ${dayAlert.title}: ${dayAlert.message}` : ''}`}
        className={`w-7 h-7 rounded-md text-xs font-bold transition-all active:scale-90 flex items-center justify-center relative border shadow-xs ${shiftDef.bgClass}`}
      >
        <span>{shift}</span>

        {/* Punto de Alerta Legal en la celda */}
        {dayAlert && (
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 ${
              dayAlert.severity === 'DANGER' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
            }`}
          />
        )}
      </button>

      {/* Popover flotante o bottom-sheet táctil */}
      {isOpen && (
        <>
          {/* Backdrop para móviles */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed bottom-4 left-4 right-4 z-50 md:absolute md:bottom-auto md:left-1/2 md:top-10 md:right-auto md:-translate-x-1/2 md:w-52 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl md:rounded-xl p-3 md:p-2 text-left animate-in fade-in zoom-in-95 duration-100">
            <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-2 px-1 flex items-center justify-between">
              <span>Día {day} • Seleccionar Turno</span>
              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-1">
              {(Object.keys(SHIFTS) as ShiftCode[]).map((code) => {
                const item = SHIFTS[code];
                const isSelected = code === shift;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onUpdateShift(employeeId, day, code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 md:py-1.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-sky-600 text-white font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-black border ${item.badgeBg}`}
                      >
                        {code}
                      </span>
                      <span className="font-semibold">{item.shortLabel}</span>
                    </div>
                    <span className="text-[10px] opacity-75 hidden sm:inline">{item.timeRange}</span>
                  </button>
                );
              })}
            </div>

            {dayAlert && (
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900/50">
                <span className="font-bold block text-rose-700 dark:text-rose-400">{dayAlert.title}</span>
                <span>{dayAlert.message}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const areCellPropsEqual = (prevProps: MatrixCellProps, nextProps: MatrixCellProps): boolean => {
  return (
    prevProps.shift === nextProps.shift &&
    prevProps.day === nextProps.day &&
    prevProps.employeeId === nextProps.employeeId &&
    prevProps.isWeekend === nextProps.isWeekend &&
    prevProps.dayAlert?.id === nextProps.dayAlert?.id &&
    prevProps.dayAlert?.severity === nextProps.dayAlert?.severity &&
    prevProps.dayAlert?.message === nextProps.dayAlert?.message &&
    prevProps.onUpdateShift === nextProps.onUpdateShift
  );
};

export const MatrixCell = React.memo(MatrixCellBase, areCellPropsEqual);

