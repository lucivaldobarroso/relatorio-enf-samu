import { useState, useEffect } from 'react';
import { TurnoKey, SHIFTS } from '@/types/samu';
import { getShiftStatus } from '@/services/samuService';

interface ShiftBarProps {
  turnoSelecionado: TurnoKey | undefined | '';
  onSelectTurno: (turno: TurnoKey) => void;
}

type ShiftStatus = 'atual' | 'encerrando' | 'bloqueado';

const ShiftBar = ({ turnoSelecionado, onSelectTurno }: ShiftBarProps) => {
  const [shiftStatuses, setShiftStatuses] = useState<Record<TurnoKey, ShiftStatus>>({} as Record<TurnoKey, ShiftStatus>);

  useEffect(() => {
    const update = () => {
      const statuses = {} as Record<TurnoKey, ShiftStatus>;
      (Object.keys(SHIFTS) as TurnoKey[]).forEach(t => {
        statuses[t] = getShiftStatus(t);
      });
      setShiftStatuses(statuses);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2 px-4 md:px-8 py-2 pb-4 glass overflow-x-auto">
      {(Object.keys(SHIFTS) as TurnoKey[]).map(turno => {
        const config = SHIFTS[turno];
        const status = shiftStatuses[turno] || 'bloqueado';
        const isSelected = turnoSelecionado === turno;
        const isDisabled = status === 'bloqueado';

        return (
          <button
            key={turno}
            disabled={isDisabled}
            onClick={() => onSelectTurno(turno)}
            className={`relative flex flex-col items-center gap-1 min-w-[140px] p-3 rounded-2xl font-bold text-sm cursor-pointer transition-all
              ${isSelected
                ? 'border-2 border-primary bg-primary/5'
                : 'border border-input bg-card'}
              ${isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:shadow-md'}
            `}
          >
            <span className="whitespace-nowrap">{config.icon} {config.label}</span>
            {status === 'atual' && (
              <span className="text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded bg-primary text-primary-foreground">
                TURNO ATUAL
              </span>
            )}
            {status === 'encerrando' && (
              <span className="text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded bg-accent text-accent-foreground">
                ENCERRANDO (+1h)
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ShiftBar;
