import { normalizar } from '@/lib/utils';

export interface HistoryEntry {
  nome: string;
  profissao: string;
  turno: string;
  data: string;
  secoes_ok: string[];
}

interface HistoryTableProps {
  historico: HistoryEntry[];
  secoes: string[];
}

const HistoryTable = ({ historico, secoes }: HistoryTableProps) => {
  if (!historico || historico.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-5">
        Nenhum histórico recente encontrado.
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b-2 border-primary pb-2">
        <h3 className="text-primary font-orbitron text-sm font-bold">🕒 ÚLTIMOS 10 ACESSOS (DETALHADO)</h3>
        <div className="flex gap-4 text-xs font-bold">
          <span className="text-green-600">● FEITO</span>
          <span className="text-red-600">● FALTOU</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left p-3 text-primary font-bold text-[0.7rem] uppercase border-b border-border">QUEM / CARGO</th>
              <th className="text-left p-3 text-primary font-bold text-[0.7rem] uppercase border-b border-border">TURNO</th>
              <th className="text-left p-3 text-primary font-bold text-[0.7rem] uppercase border-b border-border hidden md:table-cell">DATA / HORA</th>
              <th className="text-left p-3 text-primary font-bold text-[0.7rem] uppercase border-b border-border">STATUS DAS SEÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {historico.slice(0, 10).map((reg, idx) => {
              const secoesOk = (reg.secoes_ok || []).map(s => normalizar(s));

              return (
                <tr key={idx}>
                  <td className="p-3 border-b border-border min-w-[150px]">
                    <div className="font-bold text-primary">{reg.nome || '---'}</div>
                    <div className="text-[0.7rem] text-muted-foreground italic">{reg.profissao || 'Servidor'}</div>
                  </td>
                  <td className="p-3 border-b border-border">
                    <span className="bg-muted px-2 py-0.5 rounded-xl text-xs font-bold">{reg.turno || '---'}</span>
                  </td>
                  <td className="p-3 border-b border-border whitespace-nowrap hidden md:table-cell">{reg.data || '---'}</td>
                  <td className="p-3 border-b border-border">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-1.5 max-h-[150px] overflow-y-auto p-1 border-l-2 border-border">
                      {secoes.map(s => {
                        const isDone = secoesOk.includes(normalizar(s));
                        return (
                          <div
                            key={s}
                            className={`flex items-center gap-1.5 text-[0.65rem] px-1 py-0.5 rounded ${isDone ? 'bg-green-50' : 'bg-red-50'}`}
                          >
                            <span className={`inline-block w-2 h-2 rounded-full ${isDone ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`font-bold ${isDone ? 'text-green-700' : 'text-red-700'}`}>{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
