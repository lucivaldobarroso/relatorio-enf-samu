export interface Servidor {
  id: number;
  nome: string;
  codigo_servidor?: string | null;
  cpf: string;
  profissao: string;
  data_nasc: string;
  vtr_padrao: string | null;
  senha: string | null;
  conf_senha: string | null;
  created_at: string;
}

export interface Vtr {
  id: number;
  nome: string;
}

export interface LogAcesso {
  id: number;
  data_hora: string;
  nome_servidor: string;
  vtr_selecionada: string;
}

export interface ConfigChecklist {
  secao: string;
  item: string;
  qtd_padrao: number;
  responsavel: string;
  estoque: string;
}

export interface SubmitChecklist {
  id: string;
  data_hora: string;
  servidor: string;
  vtr: string;
  turno: string;
  secao: string;
  item: string;
  inicio: number;
  gasto: number;
  reposicao: number;
  excesso: number;
  inconsistencia: number;
  retirar: number;
  situacao: string;
  bypass_trava: boolean;
  perfil_envio: string;
  saldo_final: number;
}

export interface UserSession {
  nome: string;
  codigo_servidor?: string;
  vtr: string;
  profissao: string;
  turno: string;
}

export interface ChecklistItem extends ConfigChecklist {
  inicio_vtr: number | null;
  concluido_turno: boolean;
  ultimo_submit?: {
    nome: string;
    data: string;
  };
}

export const SHIFTS = {
  "MANHÃ": { start: 6, end: 12, icon: "🌅", label: "06:00 às 12:00" },
  "TARDE": { start: 12, end: 18, icon: "☀️", label: "12:00 às 18:00" },
  "DIA": { start: 6, end: 18, icon: "🕒", label: "06:00 às 18:00" },
  "NOITE": { start: 18, end: 6, icon: "🌙", label: "18:00 às 06:00" },
} as const;

export type TurnoKey = keyof typeof SHIFTS;
