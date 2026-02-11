
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dataService } from '../services/dataService';
import { languageService } from '../services/languageService';
import { AppState, Category, Product, CartItem, User } from '../types';

const PDV: React.FC = () => {
  const [state, setState] = useState<AppState>(dataService.getState());
  const [user, setUser] = useState<User>(dataService.getCurrentUser());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<string>('Todos');
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState(languageService.getLang());
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('languageChange', handleLang);
    };
  }, []);

  const t = (key: string) => languageService.get(key, lang);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === productId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== productId);
    });
  };

  const toggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dataService.toggleFavorite(id);
    setUser(dataService.getCurrentUser());
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const filteredProducts = state.products.filter(p => {
    const matchesCategory = filter === 'Todos' || p.category === filter;
    const cleanSearch = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanName = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return matchesCategory && cleanName.includes(cleanSearch);
  });

  const categories = ['Todos', ...Object.values(Category)];

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - 200 : scrollLeft + 200, behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 relative pb-32">
        <div className="flex-1 space-y-8">
          <header className="space-y-6 sticky top-0 z-40 pt-2 pb-4">
            <div className="bg-white px-8 py-4 rounded-[2.5rem] shadow-xl border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center tap-active">
                  <span className="material-icons-round text-black">arrow_back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-black leading-none">{t('menu')}</h1>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Cantina Fácil</p>
                </div>
              </div>
            </div>

            <div className="relative group bg-white rounded-[2.5rem] shadow-2xl p-1.5">
              <span className="material-icons-round absolute left-7 top-1/2 -translate-y-1/2 text-primary font-bold">search</span>
              <input
                className="w-full bg-transparent border-none rounded-[2.2rem] py-4 pl-14 pr-6 focus:ring-0 text-black font-bold text-base placeholder:text-slate-300 transition-all"
                placeholder={t('search_placeholder')}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative flex items-center bg-white py-3 px-5 rounded-[2.5rem] shadow-xl border border-slate-50">
              <button onClick={() => scrollCategories('left')} className="w-8 h-8 flex-shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-md active:scale-90"><span className="material-icons-round text-sm">chevron_left</span></button>
              <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide py-1 flex-1 scroll-smooth px-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${filter === cat ? 'bg-primary text-black' : 'bg-white text-slate-400 border border-slate-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={() => scrollCategories('right')} className="w-8 h-8 flex-shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-md active:scale-90"><span className="material-icons-round text-sm">chevron_right</span></button>
            </div>
          </header>

          <main className="pb-24 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-5 rounded-[2.8rem] shadow-xl relative overflow-hidden tap-active hover-float group transition-all flex flex-col border border-white"
              >
                <div className="w-full aspect-video flex items-center justify-center bg-slate-50 rounded-[2.2rem] mb-5 overflow-hidden relative shadow-inner">
                  <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />

                  <button
                    onClick={(e) => toggleFav(e, product.id)}
                    className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center transition-all z-20 active:scale-90"
                  >
                    <span className={`material-icons-round text-xl ${user.favorites.includes(product.id) ? 'text-red-500' : 'text-slate-300 hover:text-red-200'}`}>
                      {user.favorites.includes(product.id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>

                  {product.stock < product.minStock && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-xl text-[8px] font-black uppercase shadow-lg z-10">Esgotando</div>
                  )}
                </div>

                <div className="bg-slate-50 px-5 py-3.5 rounded-[1.8rem] mb-4 flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="font-black text-black text-base leading-tight line-clamp-2">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase">Preço</span>
                    <p className="text-black font-black text-xl tracking-tighter leading-none">R$ {product.price.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-all">
                    <span className="material-icons-round text-black text-2xl font-bold">add</span>
                  </div>
                </div>
              </div>
            ))}
          </main>
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-32 left-4 right-4 md:left-auto md:right-8 lg:sticky lg:top-24 lg:w-80 h-fit z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.4)] border-4 border-primary/20 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="material-icons-round text-xl font-bold text-black">shopping_bag</span>
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest leading-none">Subtotal</p>
                    <p className="text-xl font-black text-black tracking-tighter">R$ {cartTotal.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <span className="text-[10px] font-black text-black">{cartCount} itens</span>
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-50">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm">{item.emoji}</div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-black truncate leading-tight">{item.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-10 h-10 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-90 shrink-0 group"
                      title="Excluir Item"
                    >
                      <span className="material-icons-round text-lg font-bold group-hover:animate-pulse">delete</span>
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { sessionStorage.setItem('pending_cart', JSON.stringify(cart)); navigate('/checkout'); }}
                className="w-full py-4.5 bg-black text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                Finalizar Pedido
                <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PDV;
