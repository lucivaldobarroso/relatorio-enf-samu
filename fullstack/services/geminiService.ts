
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

// Helper to instantiate AI client with latest env variables, 
// ensuring we use the most up-to-date key if selection occurs.
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Analyzes stock levels and provides a short recommendation.
   * Uses gemini-3-flash-preview for basic text task.
   */
  async analyzeStock(state: AppState): Promise<string> {
    try {
      const lowStockItems = state.products.filter(p => p.stock <= p.minStock);
      if (lowStockItems.length === 0) return "Tudo em ordem com o estoque.";

      const prompt = `Analise os seguintes itens de estoque baixo em uma cantina:
      ${lowStockItems.map(p => `- ${p.name}: ${p.stock} unidades (Mínimo: ${p.minStock})`).join('\n')}
      
      Dê uma recomendação curta e profissional sobre o que repor primeiro.`;

      const ai = getAIClient();
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || "Não foi possível gerar uma análise no momento.";
    } catch (error) {
      console.error("Gemini analyzeStock error:", error);
      throw new Error("Falha na comunicação com a IA de estoque.");
    }
  },

  /**
   * Provides financial insights based on sales and expenses.
   * Uses gemini-1.5-pro for more complex reasoning/math task.
   */
  async getFinancialInsight(state: AppState): Promise<string> {
    try {
      const sales = state.transactions.filter(t => t.type === 'sale');
      const expenses = state.transactions.filter(t => t.type === 'expense');

      const totalSales = sales.reduce((acc, curr) => acc + curr.total, 0);
      const totalExpenses = expenses.reduce((acc, curr) => acc + curr.total, 0);

      const prompt = `Resumo financeiro da Cantina:
      Vendas Totais: R$ ${totalSales.toFixed(2)}
      Despesas Totais: R$ ${totalExpenses.toFixed(2)}
      
      Dê um insight profissional e rápido sobre a saúde financeira do negócio baseado nesses números.`;

      const ai = getAIClient();
      const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || "Análise financeira indisponível.";
    } catch (error) {
      console.error("Gemini getFinancialInsight error:", error);
      throw new Error("Falha na comunicação com a IA financeira.");
    }
  }
};
