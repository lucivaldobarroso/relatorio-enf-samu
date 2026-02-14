import { useState, useEffect } from 'react';
import { ChecklistItem } from '@/types/samu';
import { normalizar } from '@/lib/utils';

interface ChecklistSectionProps {
  secao: string;
  itens: ChecklistItem[];
  profissao: string;
  modoCME: boolean;
  bancoItensPorItem: Map<string, ChecklistItem>;
  onEnviarSecao: (itensData: ChecklistPayload[]) => Promise<boolean>;
  onEnviarItem: (itemData: ChecklistPayload) => Promise<boolean>;
  onVoltarCME: () => void;
}

export interface ChecklistPayload {
  secao: string;
  item: string;
  inicio: number;
  gasto: number;
  reposicao: number;
  inconstancia: number;
  excesso: number;
  retirar: number;
  inconsistencia_msg: string;
  saldo_final: number;
}

interface ItemState {
  gasto: string;
  reposicao: string;
  inconst: string;
  retirar: string;
}

const ChecklistSection = ({
  secao,
  itens,
  profissao,
  modoCME,
  bancoItensPorItem,
  onEnviarSecao,
  onEnviarItem,
  onVoltarCME,
}: ChecklistSectionProps) => {
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>(() => {
    const initial: Record<string, ItemState> = {};
    itens.forEach((i) => {
      initial[i.item] = { gasto: '', reposicao: '', inconst: '', retirar: '' };
    });
    return initial;
  });

  const [enviados, setEnviados] = useState<Set<string>>(new Set(itens.filter((i) => i.concluido_turno).map((i) => i.item)));
  const [enviando, setEnviando] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setEnviados(new Set(itens.filter((i) => i.concluido_turno).map((i) => i.item)));
  }, [itens]);

  const getInicio = (item: ChecklistItem) => {
    return item.inicio_vtr !== undefined && item.inicio_vtr !== null ? item.inicio_vtr : item.qtd_padrao;
  };

  const calcular = (item: ChecklistItem, state: ItemState) => {
    const parseNonNegative = (raw: string) => {
      const parsed = Number.parseInt(raw, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    };

    const inicio = getInicio(item);
    const gasto = parseNonNegative(state.gasto);
    const repos = parseNonNegative(state.reposicao);
    const retirar = parseNonNegative(state.retirar);
    const inconstRaw = state.inconst;
    const inconstParsed = Number.parseInt(inconstRaw, 10);
    const hasInconst =
      inconstRaw.trim() !== '' && Number.isFinite(inconstParsed) && inconstParsed > 0;
    const inconst = hasInconst ? inconstParsed : 0;
    const baseReal = hasInconst ? inconst : inicio;
    const saldoFinal = baseReal - gasto + repos - retirar;
    const excesso = saldoFinal > item.qtd_padrao ? saldoFinal - item.qtd_padrao : 0;

    let situacao = 'OK / COMPLETO';
    let statusClass = 'bg-[hsl(var(--status-ok-bg))] text-[hsl(var(--status-ok-fg))] border border-green-200';
    if (saldoFinal < item.qtd_padrao) {
      situacao = `REPOR ${item.qtd_padrao - saldoFinal}`;
      statusClass = 'bg-[hsl(var(--status-repor-bg))] text-[hsl(var(--status-repor-fg))] border border-red-200';
    } else if (saldoFinal > item.qtd_padrao) {
      situacao = `RETIRAR ${saldoFinal - item.qtd_padrao}`;
      statusClass = 'bg-[hsl(var(--status-retirar-bg))] text-[hsl(var(--status-retirar-fg))] border border-blue-200';
    }

    return { saldoFinal, excesso, situacao, statusClass, gasto, repos, retirar, inconst };
  };

  const updateField = (itemName: string, field: keyof ItemState, value: string) => {
    setItemStates((prev) => ({
      ...prev,
      [itemName]: { ...prev[itemName], [field]: value },
    }));
  };

  const isBloqueado = (item: ChecklistItem) => {
    if (modoCME) return false;
    const respItem = normalizar(item.responsavel);
    const minhaProf = normalizar(profissao);
    if (minhaProf.includes('COORD')) return false;
    if (minhaProf === 'MEDICO' && respItem === 'ENFERMEIRO') return true;
    if (minhaProf === 'ENFERMEIRO' && respItem === 'MEDICO') return true;
    return false;
  };

  const isIndisponivelCME = (item: ChecklistItem) => normalizar(item.estoque) === 'NAO TEM';

  const buildItemData = (item: ChecklistItem) => {
    const state = itemStates[item.item] || { gasto: '', reposicao: '', inconst: '', retirar: '' };
    const calc = calcular(item, state);
    return {
      secao,
      item: item.item,
      inicio: getInicio(item),
      gasto: calc.gasto,
      reposicao: calc.repos,
      inconstancia: calc.inconst,
      excesso: calc.excesso,
      retirar: calc.retirar,
      inconsistencia_msg: calc.situacao,
      saldo_final: calc.saldoFinal,
    };
  };

  const handleEnviarItem = async (item: ChecklistItem) => {
    setEnviando(item.item);
    const data = buildItemData(item);
    const success = await onEnviarItem(data);
    if (success) {
      setEnviados((prev) => new Set([...prev, item.item]));
      setItemStates((prev) => ({
        ...prev,
        [item.item]: { gasto: '', reposicao: '', inconst: '', retirar: '' },
      }));
    }
    setEnviando(null);
  };

  const handleEnviarSecao = async () => {
    setSalvando(true);
    const allData = itens.filter((i) => !isBloqueado(i) && !isIndisponivelCME(i)).map((i) => buildItemData(i));
    const success = await onEnviarSecao(allData);
    if (success) {
      setEnviados((prev) => new Set([...prev, ...allData.map((i) => i.item)]));
    }
    setSalvando(false);
  };

  const totalBloqueados = itens.filter((i) => isBloqueado(i) || isIndisponivelCME(i)).length;
  const secaoBloqueada = totalBloqueados === itens.length;

  const primeiroItem = itens[0];
  const ultimoSubmit = primeiroItem?.ultimo_submit;

  return (
    <div>
      <h2 className={`text-xl font-bold mb-1 ${modoCME ? 'text-accent' : 'text-primary'}`}>
        {secao} {modoCME ? '(VISÃO CME)' : ''}
      </h2>

      {ultimoSubmit ? (
        <div className="text-xs text-muted-foreground mb-4">
          Último registro: <strong>{ultimoSubmit.nome}</strong> em {ultimoSubmit.data}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground mb-4">Sem registros anteriores nesta secao.</div>
      )}

      {modoCME && (
        <button onClick={onVoltarCME} className="bg-transparent border-none text-primary font-bold cursor-pointer mb-4 text-sm">
          Voltar ao Resumo CME
        </button>
      )}

      <div className="space-y-3">
        {itens.map((item) => {
          const bloqueadoRegra = isBloqueado(item);
          const faltaCME = isIndisponivelCME(item);
          const bloqueado = bloqueadoRegra || faltaCME;
          const state = itemStates[item.item] || { gasto: '', reposicao: '', inconst: '', retirar: '' };
          const calc = calcular(item, state);
          const isEnviado = enviados.has(item.item);
          const isEnviando = enviando === item.item;
          const inicio = getInicio(item);

          return (
            <div
              key={item.item}
              className={`glass rounded-xl p-4 border transition-transform hover:-translate-y-0.5
                ${bloqueadoRegra ? 'opacity-50 grayscale pointer-events-none relative' : ''}
                ${faltaCME ? 'border-4 border-red-600 bg-red-50 pointer-events-none relative shadow-[0_0_0_2px_rgba(220,38,38,0.35)]' : 'border-white'}
                ${isEnviado ? 'bg-green-50 border-4 border-green-700 shadow-[0_0_0_2px_rgba(21,128,61,0.45)]' : ''}
              `}
            >
              {bloqueado && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="bg-destructive text-destructive-foreground px-4 py-1 rounded-full font-orbitron text-xs">
                    {faltaCME ? 'INDISPONIVEL CME' : 'BLOQUEADO'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-primary font-bold text-base">{item.item}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">PADRÃO: {item.qtd_padrao}</span>
                    {!bloqueado && (
                      <button
                        onClick={() => handleEnviarItem(item)}
                        disabled={isEnviando}
                        className={`text-[0.65rem] font-bold px-2 py-1 rounded border cursor-pointer uppercase transition
                          ${isEnviado ? 'bg-green-500 text-white border-green-500' : 'bg-muted text-primary border-input hover:bg-primary hover:text-primary-foreground'}`}
                      >
                        {isEnviando ? 'ENVIANDO...' : isEnviado ? 'ENVIADO OK' : 'ENVIAR ITEM'}
                      </button>
                    )}
                  </div>
                  {faltaCME && <div className="text-destructive text-[0.6rem] font-bold">INDISPONIVEL CME</div>}
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                <div className="flex flex-col items-center">
                  <label className="text-[0.65rem] text-primary font-bold uppercase mb-1">Inicio</label>
                  <input
                    type="number"
                    value={inicio}
                    readOnly
                    className="w-full p-2 bg-muted border-transparent rounded-lg text-center font-bold text-sm cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-[0.65rem] text-primary font-bold uppercase mb-1">Gasto</label>
                  <input
                    type="number"
                    value={state.gasto}
                    onChange={(e) => updateField(item.item, 'gasto', e.target.value)}
                    onFocus={(e) => e.target.select()}
                    readOnly={modoCME || bloqueado}
                    placeholder="0"
                    className="w-full p-2 border border-red-200 rounded-lg text-center font-bold text-sm text-red-700"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-[0.65rem] text-primary font-bold uppercase mb-1">Repos.</label>
                  <input
                    type="number"
                    value={state.reposicao}
                    onChange={(e) => updateField(item.item, 'reposicao', e.target.value)}
                    onFocus={(e) => e.target.select()}
                    readOnly={bloqueado}
                    placeholder="0"
                    className="w-full p-2 border border-green-200 rounded-lg text-center font-bold text-sm text-green-700"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-[0.65rem] text-primary font-bold uppercase mb-1">Inconst.</label>
                  <input
                    type="number"
                    value={state.inconst}
                    onChange={(e) => updateField(item.item, 'inconst', e.target.value)}
                    onFocus={(e) => e.target.select()}
                    readOnly={modoCME || bloqueado}
                    placeholder="0"
                    className="w-full p-2 border border-yellow-200 rounded-lg text-center font-bold text-sm text-yellow-700"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-[0.65rem] text-primary font-bold uppercase mb-1">Excesso</label>
                  <input
                    type="number"
                    value={calc.excesso || ''}
                    readOnly
                    className="w-full p-2 bg-blue-50 border-transparent rounded-lg text-center font-bold text-sm cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-[0.65rem] text-primary font-bold uppercase mb-1">Retirar</label>
                  <input
                    type="number"
                    value={state.retirar}
                    onChange={(e) => updateField(item.item, 'retirar', e.target.value)}
                    onFocus={(e) => e.target.select()}
                    readOnly={bloqueado}
                    placeholder="0"
                    className="w-full p-2 border border-blue-200 rounded-lg text-center font-bold text-sm text-blue-800"
                  />
                </div>
              </div>

              <div className={`mt-3 font-orbitron text-[0.65rem] font-bold p-2 rounded-lg text-center uppercase ${calc.statusClass}`}>
                {calc.situacao}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleEnviarSecao}
        disabled={secaoBloqueada || salvando}
        className={`w-full p-4 mt-5 mb-10 rounded-xl font-orbitron font-bold text-base cursor-pointer uppercase shadow-lg transition
          ${secaoBloqueada ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none' : 'samu-gradient text-primary-foreground hover:-translate-y-0.5 hover:shadow-xl'}`}
      >
        {salvando ? 'SALVANDO...' : secaoBloqueada ? 'SECAO BLOQUEADA (OUTRA PROFISSAO)' : 'ENVIAR TODA A SECAO'}
      </button>
    </div>
  );
};

export default ChecklistSection;
