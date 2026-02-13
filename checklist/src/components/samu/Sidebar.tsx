import { ChecklistItem } from '@/types/samu';

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
          const concluido = bancoItens.some(i => i.secao === s && i.concluido_turno);
          const isActive = secaoAtual === s;

          return (
            <button
              key={s}
              onClick={() => onSelectSecao(s)}
              className={`w-full p-4 border-none bg-transparent text-left cursor-pointer border-b border-border/10 text-sm font-medium relative transition-colors
                ${isActive ? 'bg-primary/10 text-primary border-r-4 border-r-primary font-bold' : 'text-foreground/70 hover:bg-primary/5'}`}
            >
              {s}
              {turnoSelecionado && (
                <span
                  className={`absolute bottom-1 left-[10%] w-[80%] h-1 rounded-sm transition-colors
                    ${concluido ? 'bg-green-500 shadow-[0_0_5px_rgba(0,200,81,0.5)]' : 'bg-red-400'}`}
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
