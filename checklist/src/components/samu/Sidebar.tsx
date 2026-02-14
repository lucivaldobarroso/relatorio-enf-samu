import { ChecklistItem } from '@/types/samu';
import { normalizar } from '@/lib/utils';

interface SidebarProps {
  secoes: string[];
  secaoAtual: string;
  bancoItens: ChecklistItem[];
  onSelectSecao: (secao: string) => void;
  onOpenEstatisticas: () => void;
  onSair: () => void;
  isOpen: boolean;
  turnoSelecionado: boolean;
}

const Sidebar = ({
  secoes,
  secaoAtual,
  bancoItens,
  onSelectSecao,
  onOpenEstatisticas,
  onSair,
  isOpen,
  turnoSelecionado,
}: SidebarProps) => {
  return (
    <div
      className={`w-[280px] glass border-r border-border flex flex-col shadow-sm z-20
        fixed md:relative h-[100dvh] md:h-full transition-all duration-300
        ${isOpen ? 'left-0' : '-left-[280px]'} md:left-0`}
    >
      <div className="p-6 samu-gradient text-primary-foreground font-orbitron font-bold text-center text-sm">
        CHECK LIST USA - SAMU 192 BOA VISTA
      </div>

      <div
        className="flex-1 overflow-y-auto transition-opacity"
        style={{
          pointerEvents: turnoSelecionado ? 'auto' : 'none',
          opacity: turnoSelecionado ? 1 : 0.5,
        }}
      >
        {secoes.map(s => {
          const itensSecao = bancoItens.filter(i => i.secao === s);
          const itensValidos = itensSecao.filter(i => normalizar(i.estoque) !== 'NAO TEM');
          const totalItens = itensValidos.length;
          const totalConcluidos = itensValidos.filter(i => i.concluido_turno).length;
          const concluido = totalItens > 0 && totalConcluidos === totalItens;
          const parcial = totalConcluidos > 0 && totalConcluidos < totalItens;
          const somenteIndisponivel = totalItens === 0 && itensSecao.length > 0;
          const isActive = secaoAtual === s;

          return (
            <button
              key={s}
              onClick={() => onSelectSecao(s)}
              className={`group w-full p-4 border-none bg-transparent text-left cursor-pointer border-b border-border/10 text-sm relative transition-colors
                ${isActive ? 'bg-primary/15 text-primary border-r-4 border-r-primary font-extrabold tracking-[0.01em] shadow-[inset_0_0_0_1px_rgba(25,96,184,0.25)]' : 'text-foreground/70'}
                ${
                  !isActive
                    ? (concluido || somenteIndisponivel)
                      ? 'hover:bg-green-50 hover:text-green-800 hover:font-bold'
                      : parcial
                        ? 'hover:bg-amber-50 hover:text-amber-800 hover:font-bold'
                        : 'hover:bg-red-50 hover:text-red-800 hover:font-bold'
                    : ''
                }`}
            >
              {s}
              {turnoSelecionado && (
                <span
                  className={`absolute bottom-1 left-[10%] w-[80%] h-1 rounded-sm transition-colors group-hover:h-[5px]
                    ${
                      concluido || somenteIndisponivel
                        ? 'bg-green-500 shadow-[0_0_6px_rgba(0,200,81,0.55)]'
                        : parcial
                          ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                          : 'bg-red-400 shadow-[0_0_5px_rgba(239,68,68,0.3)]'
                    }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5 border-t border-border/10">
        <button
          onClick={onOpenEstatisticas}
          className="w-full mb-3 bg-transparent border border-primary text-primary px-3 py-2 rounded-lg font-orbitron text-xs font-bold cursor-pointer hover:bg-primary hover:text-primary-foreground transition"
        >
          ESTATISTICA
        </button>
        <button
          onClick={onSair}
          className="w-full bg-transparent border border-destructive text-destructive px-3 py-2 rounded-lg font-orbitron text-xs font-bold cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition"
        >
          SAIR DO SISTEMA
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

