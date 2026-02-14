import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardEstatisticoData, RankingProfissaoEntry } from '@/services/samuService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface StatsDashboardProps {
  data: DashboardEstatisticoData | null;
  loading: boolean;
  periodoDias: number;
  onChangePeriodoDias: (days: number) => void;
  onAtualizar: () => void;
}

const chartConfig = {
  acessos: { label: 'Acessos', color: 'hsl(var(--primary))' },
  ajustes: { label: 'Ajustes', color: 'hsl(var(--accent))' },
  concluidos: { label: 'Concluidos', color: 'hsl(142 71% 45%)' },
  incompletos: { label: 'Incompletos', color: 'hsl(var(--destructive))' },
} as const;

function KpiCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-xl" />
      <p className="text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-2 font-orbitron text-2xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function RankingTable({
  titulo,
  data,
}: {
  titulo: string;
  data: RankingProfissaoEntry[];
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm">
      <h4 className="mb-3 font-orbitron text-sm font-bold text-primary">{titulo}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground">
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-right">Acessos</th>
              <th className="p-2 text-right">Concluidos</th>
              <th className="p-2 text-right">Incompleto</th>
              <th className="p-2 text-right">Nao realizado</th>
              <th className="p-2 text-right">Taxa</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={`${row.nome}_${idx}`} className="border-t border-border/40">
                <td className="p-2 font-semibold">{row.nome}</td>
                <td className="p-2 text-right">{row.acessos}</td>
                <td className="p-2 text-right text-green-700">{row.concluidos}</td>
                <td className="p-2 text-right text-amber-700">{row.incompletos}</td>
                <td className="p-2 text-right text-red-700">{row.naoRealizados}</td>
                <td className="p-2 text-right font-bold text-primary">{row.taxaConclusao.toFixed(1)}%</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="p-2 text-muted-foreground" colSpan={6}>
                  Sem dados no periodo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListCard({
  titulo,
  rows,
}: {
  titulo: string;
  rows: Array<{ item: string; secao: string; ajustes: number }>;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm">
      <h4 className="mb-3 font-orbitron text-sm font-bold text-primary">{titulo}</h4>
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={`${row.item}_${idx}`} className="flex items-center justify-between rounded-lg bg-muted/50 px-2 py-1.5">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{row.item}</p>
              <p className="truncate text-[0.65rem] text-muted-foreground">{row.secao}</p>
            </div>
            <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[0.65rem] font-bold text-accent-foreground">
              {row.ajustes}
            </span>
          </div>
        ))}
        {rows.length === 0 && <p className="text-xs text-muted-foreground">Sem dados no periodo.</p>}
      </div>
    </div>
  );
}

const StatsDashboard = ({ data, loading, periodoDias, onChangePeriodoDias, onAtualizar }: StatsDashboardProps) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card/80 p-8 text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
        <p className="text-sm text-muted-foreground">Calculando metricas do dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card/80 p-8 text-center">
        <p className="text-sm text-muted-foreground">Nao foi possivel carregar as estatisticas.</p>
      </div>
    );
  }

  const completionData = [
    { name: 'Concluidos', value: data.sessoesConcluidas, fill: 'hsl(142 71% 45%)' },
    { name: 'Incompletos', value: data.sessoesIncompletas, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/40 p-4 md:p-6">
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-orbitron text-lg font-bold text-primary">Dashboard Estatistico</h3>
          <p className="text-xs text-muted-foreground">Visao analitica completa da operacao da VTR</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[7, 15, 30, 60].map(days => (
            <button
              key={days}
              onClick={() => onChangePeriodoDias(days)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                periodoDias === days ? 'samu-gradient text-primary-foreground' : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
            >
              {days} dias
            </button>
          ))}
          <button
            onClick={onAtualizar}
            className="rounded-lg border border-primary px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard title="Tempo medio checklist" value={`${data.tempoMedioChecklistMin.toFixed(1)} min`} subtitle="Media das sessoes concluidas" />
        <KpiCard title="Taxa de conclusao" value={`${data.taxaConclusaoGeral.toFixed(1)}%`} subtitle="Sessoes concluidas / total de sessoes" />
        <KpiCard title="Turnos incompletos" value={String(data.sessoesIncompletas)} subtitle="Sessoes com pendencias por secao" />
        <KpiCard title="Acessos no periodo" value={String(data.totalAcessos)} subtitle="Entradas registradas no sistema" />
        <KpiCard
          title="Sessoes concluidas"
          value={String(data.sessoesConcluidas)}
          subtitle="Checklists finalizados no periodo"
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm">
          <h4 className="mb-3 font-orbitron text-sm font-bold text-primary">Picos de acesso por hora</h4>
          <ChartContainer className="h-[260px] w-full" config={chartConfig}>
            <LineChart data={data.picosAcesso}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hora" tickLine={false} axisLine={false} interval={1} minTickGap={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="acessos" stroke="var(--color-acessos)" strokeWidth={3} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm">
          <h4 className="mb-3 font-orbitron text-sm font-bold text-primary">Concluidos x incompletos</h4>
          <ChartContainer className="h-[260px] w-full" config={chartConfig}>
            <PieChart>
              <Pie data={completionData} dataKey="value" nameKey="name" outerRadius={96} innerRadius={60}>
                {completionData.map((entry, idx) => (
                  <Cell key={`cell_${idx}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <RankingTable titulo="Top 10 Enfermeiros (acesso e conclusao)" data={data.rankingEnfermeiros} />
        <RankingTable titulo="Top 10 Medicos (acesso e conclusao)" data={data.rankingMedicos} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <ListCard titulo="Itens mais ajustados" rows={data.itensMaisAjustados} />
        <ListCard titulo="Ranking de medicamentos" rows={data.rankingMedicamentos} />
        <ListCard titulo="Ranking de psicotropicos" rows={data.rankingPsicotropicos} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm">
          <h4 className="mb-3 font-orbitron text-sm font-bold text-primary">Turnos incompletos (mais criticos)</h4>
          <div className="max-h-[280px] overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card">
                <tr className="text-muted-foreground">
                  <th className="p-2 text-left">Servidor</th>
                  <th className="p-2 text-left">Turno</th>
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-right">Secoes</th>
                </tr>
              </thead>
              <tbody>
                {data.turnosIncompletos.map((row, idx) => (
                  <tr key={`${row.servidor}_${idx}`} className="border-t border-border/40">
                    <td className="p-2 font-semibold">{row.servidor}</td>
                    <td className="p-2">{row.turno}</td>
                    <td className="p-2">{row.data}</td>
                    <td className="p-2 text-right font-bold text-destructive">
                      {row.secoesConcluidas}/{row.totalSecoes}
                    </td>
                  </tr>
                ))}
                {data.turnosIncompletos.length === 0 && (
                  <tr>
                    <td className="p-2 text-muted-foreground" colSpan={4}>
                      Sem turnos incompletos no periodo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm space-y-4">
          <div>
            <h4 className="mb-2 font-orbitron text-sm font-bold text-primary">Rastreio de antecessor - Enfermeiro</h4>
            <ChartContainer className="h-[130px] w-full" config={chartConfig}>
              <BarChart data={data.rastreioAntecessorEnfermeiros.slice(0, 6)}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="sucessor" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => (
                        <div className="text-xs">
                          <div className="font-semibold">{item.payload.sucessor}</div>
                          <div>Antecessor: {item.payload.antecessor}</div>
                          <div>Turno: {item.payload.turno}</div>
                          <div>Intervalo: {value} min</div>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="intervaloMin" fill="var(--color-acessos)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          <div>
            <h4 className="mb-2 font-orbitron text-sm font-bold text-primary">Rastreio de antecessor - Medico</h4>
            <ChartContainer className="h-[130px] w-full" config={chartConfig}>
              <BarChart data={data.rastreioAntecessorMedicos.slice(0, 6)}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="sucessor" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => (
                        <div className="text-xs">
                          <div className="font-semibold">{item.payload.sucessor}</div>
                          <div>Antecessor: {item.payload.antecessor}</div>
                          <div>Turno: {item.payload.turno}</div>
                          <div>Intervalo: {value} min</div>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="intervaloMin" fill="var(--color-acessos)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
