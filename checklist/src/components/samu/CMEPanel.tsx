import { ChecklistItem } from '@/types/samu';
import { normalizar } from '@/lib/utils';

interface CMEPanelProps {
  bancoItens: ChecklistItem[];
  onSelectSecao: (secao: string) => void;
}

const CMEPanel = ({ bancoItens, onSelectSecao }: CMEPanelProps) => {
  const secoes = [...new Set(bancoItens.map(i => i.secao))];

  const calcularStatus = (secao: string) => {
    const itens = bancoItens.filter(i => i.secao === secao);
    let precisaRepor = false;
    let temExcesso = false;

    itens.forEach(i => {
      const inicio = i.inicio_vtr !== undefined && i.inicio_vtr !== null ? i.inicio_vtr : i.qtd_padrao;
      if (inicio < i.qtd_padrao) precisaRepor = true;
      if (inicio > i.qtd_padrao) temExcesso = true;
    });

    if (precisaRepor && temExcesso) return { gradient: 'from-red-700 to-blue-600', texto: '⚠️ REPOR / RETIRAR' };
    if (precisaRepor) return { gradient: 'from-red-700 to-red-500', texto: '🔺 REPOSIÇÃO NECESSÁRIA' };
    if (temExcesso) return { gradient: 'from-blue-700 to-blue-500', texto: '🔹 EXCESSO PARA RETIRAR' };
    return { gradient: 'from-green-700 to-green-500', texto: '✅ TUDO OK' };
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-accent font-orbitron font-bold text-xl mb-2">PAINEL DE RESUMO CME</h2>
      {secoes.map(secao => {
        const status = calcularStatus(secao);
        return (
          <div
            key={secao}
            onClick={() => onSelectSecao(secao)}
            className={`bg-gradient-to-r ${status.gradient} p-5 rounded-2xl text-white cursor-pointer flex justify-between items-center font-orbitron text-sm shadow-lg hover:scale-[1.02] transition border-2 border-white/20`}
          >
            <span>{secao}</span>
            <span className="bg-white/20 px-2.5 py-1 rounded-xl text-xs font-sans">{status.texto}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CMEPanel;
