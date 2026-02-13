import { useState, useEffect, useCallback } from 'react';
import { UserSession, ChecklistItem, TurnoKey } from '@/types/samu';
import {
  fetchDadosIniciais,
  realizarLogin,
  validarIdentidadeCadastro,
  registrarSenha,
  carregarItens,
  salvarChecklist,
  obterDashboardEstatistico,
} from '@/services/samuService';

const SESSION_KEY = 'usuario_samu';

export function useSession() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = useCallback((session: UserSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const setTurno = useCallback((turno: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, turno };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { user, login, logout, setTurno };
}

export {
  fetchDadosIniciais,
  realizarLogin,
  validarIdentidadeCadastro,
  registrarSenha,
  carregarItens,
  salvarChecklist,
  obterDashboardEstatistico,
};
