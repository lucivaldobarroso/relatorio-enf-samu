
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dataService } from '../services/dataService';
import { geminiService } from '../services/geminiService';
import { languageService } from '../services/languageService';
import { AppState, Product, Category } from '../types';

const Estoque: React.FC = () => {
  const [state, setState] = useState<AppState>(dataService.getState());
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [lang, setLang] = useState(languageService.getLang());
  const navigate = useNavigate();

  useEffect(() => {
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const t = (key: string) => languageService.get(key, lang);

  useEffect(() => {
    // Fetch AI insight when state changes
    const fetchInsight = async () => {
      setIsAnalyzing(true);
      try {
        const insight = await geminiService.analyzeStock(state);
        setAiInsight(insight);
      } catch (err) {
        console.error("Erro ao analisar estoque:", err);
        setAiInsight("Não foi possível carregar o insight da IA no momento.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    fetchInsight();
  }, [state]);

  const filteredProducts = state.products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setIsAdding(true);
    setEditingProduct({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      price: 0,
      category: Category.Salgados,
      stock: 0,
      minStock: 5,
      image: '',
      emoji: '📦'
    });
  };

  const handleOpenEditModal = (product: Product) => {
    setIsAdding(false);
    setEditingProduct({ ...product });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      if (isAdding) {
        dataService.addProduct(editingProduct);
      } else {
        dataService.updateProduct(editingProduct);
      }
      setState(dataService.getState());
      setEditingProduct(null);
      setIsAdding(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      dataService.deleteProduct(id);
      setState(dataService.getState());
    }
  };

  return (
    <Layout>
      <header className="px-5 pt-4 pb-4 flex flex-col gap-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-icons-round">dashboard</span>
            </button>
            <h1 className="text-2xl font-bold tracking-tight">Estoque</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-icons-round text-slate-800 dark:text-white">inventory_2</span>
          </div>
        </div>

        <div className="relative">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-inner outline-none"
            placeholder="Buscar produto..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {(aiInsight || isAnalyzing) && (
          <div className="bg-primary/10 dark:bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-3">
            <span className={`material-icons-round text-primary ${isAnalyzing ? 'animate-spin' : ''}`}>
              {isAnalyzing ? 'sync' : 'auto_awesome'}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">IA Insight</p>
              {isAnalyzing ? (
                <p className="text-xs text-slate-400 italic">Analisando tendências de estoque...</p>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{aiInsight}</p>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="px-5 pt-6 pb-32 space-y-3">
        {filteredProducts.map(product => {
          const isLow = product.stock < product.minStock;

          return (
            <div key={product.id} className={`bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-l-4 flex items-center justify-between transition-all ${isLow ? 'border-red-500 bg-red-50/30 dark:bg-red-900/10' : 'border-slate-100 dark:border-slate-700'}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center relative">
                  {product.image ? (
                    <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                  ) : (
                    <span className="text-3xl">{product.emoji}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">R$ {product.price.toFixed(2)}</p>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">{product.category}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <span className={`block text-xl font-black ${isLow ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
                    {product.stock.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase">unids</span>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-primary transition-colors"
                  >
                    <span className="material-icons-round text-base">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                  >
                    <span className="material-icons-round text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4 sm:items-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingProduct(null)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl p-6 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-xl font-bold mb-6">{isAdding ? 'Novo Produto' : 'Editar Produto'}</h2>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Nome do Produto</label>
                <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Preço (R$)</label>
                  <input type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Estoque</label>
                  <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Mínimo para Alerta</label>
                <input type="number" value={editingProduct.minStock} onChange={e => setEditingProduct({ ...editingProduct, minStock: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4" required />
              </div>
              <button type="submit" className="w-full bg-primary p-4 rounded-xl font-bold text-slate-900 mt-4 shadow-lg shadow-primary/20">Salvar no Inventário</button>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={handleOpenAddModal}
          className="w-16 h-16 bg-primary text-slate-900 rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="material-icons-round text-4xl">add</span>
        </button>
      </div>
    </Layout>
  );
};

export default Estoque;
