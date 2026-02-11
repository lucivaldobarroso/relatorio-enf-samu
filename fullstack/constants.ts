
import { Category, Product } from './types';

export const CONTACT_INFO = {
  company: 'Cantina Fácil',
  whatsapp: '5511999999999',
  phone: '(11) 99999-9999',
  email: 'contato@cantinafacil.com.br',
  instagram: '@cantinafacil',
  facebook: 'cantinafacil.oficial'
};

export const INITIAL_PRODUCTS: Product[] = [
  // --- SALGADOS (8) ---
  { id: 's1', name: 'Coxinha de Frango', price: 7.50, category: Category.Salgados, stock: 30, minStock: 10, image: 'https://images.unsplash.com/photo-1619096279114-bb42626bdd56?w=400&h=400&fit=crop', emoji: '🍗' },
  { id: 's2', name: 'Esfirra de Carne', price: 7.00, category: Category.Salgados, stock: 25, minStock: 10, image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400&h=400&fit=crop', emoji: '🥟' },
  { id: 's3', name: 'Kibe com Requeijão', price: 8.00, category: Category.Salgados, stock: 20, minStock: 8, image: 'https://images.unsplash.com/photo-1623961990059-28356e226a77?w=400&h=400&fit=crop', emoji: '🧆' },
  { id: 's4', name: 'Pão de Queijo', price: 4.50, category: Category.Salgados, stock: 50, minStock: 15, image: 'https://images.unsplash.com/photo-1598143158332-68316dfaf51d?w=400&h=400&fit=crop', emoji: '🧀' },
  { id: 's5', name: 'Enrolado P&Q', price: 7.50, category: Category.Salgados, stock: 20, minStock: 5, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', emoji: '🥖' },
  { id: 's6', name: 'Empada Frango', price: 6.50, category: Category.Salgados, stock: 15, minStock: 5, image: 'https://images.unsplash.com/photo-1583002623348-73599971933a?w=400&h=400&fit=crop', emoji: '🥧' },
  { id: 's7', name: 'Rissole Presunto', price: 6.00, category: Category.Salgados, stock: 18, minStock: 5, image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400&h=400&fit=crop', emoji: '🌽' },
  { id: 's8', name: 'Folhado Integral', price: 9.00, category: Category.Salgados, stock: 12, minStock: 5, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop', emoji: '🥐' },

  // --- BEBIDAS (8) ---
  { id: 'b1', name: 'Suco Laranja 300ml', price: 8.50, category: Category.Bebidas, stock: 20, minStock: 5, image: 'https://images.unsplash.com/photo-1613478223719-2ab80260f003?w=400&h=400&fit=crop', emoji: '🍊' },
  { id: 'b2', name: 'Coca-Cola 350ml', price: 6.00, category: Category.Bebidas, stock: 48, minStock: 12, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop', emoji: '🥤' },
  { id: 'b3', name: 'Água s/ Gás 500ml', price: 3.50, category: Category.Bebidas, stock: 60, minStock: 20, image: 'https://images.unsplash.com/photo-1548919973-5dea5846f669?w=400&h=400&fit=crop', emoji: '💧' },
  { id: 'b4', name: 'Chá Gelado Limão', price: 7.00, category: Category.Bebidas, stock: 25, minStock: 10, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', emoji: '☕' },
  { id: 'b5', name: 'Suco Uva Integral', price: 9.50, category: Category.Bebidas, stock: 15, minStock: 5, image: 'https://images.unsplash.com/photo-1533512930330-4ac257c86793?w=400&h=400&fit=crop', emoji: '🍇' },
  { id: 'b6', name: 'Guaraná Lata 350ml', price: 6.00, category: Category.Bebidas, stock: 36, minStock: 12, image: 'https://images.unsplash.com/photo-1527960669566-f882ba85a4c6?w=400&h=400&fit=crop', emoji: '🥤' },
  { id: 'b7', name: 'Café Expresso G', price: 5.50, category: Category.Bebidas, stock: 100, minStock: 0, image: 'https://images.unsplash.com/photo-1510970174576-799d74afddfe?w=400&h=400&fit=crop', emoji: '☕' },
  { id: 'b8', name: 'Iogurte Morango', price: 7.50, category: Category.Bebidas, stock: 12, minStock: 5, image: 'https://images.unsplash.com/photo-1571290274554-e915f6944c4a?w=400&h=400&fit=crop', emoji: '🍓' },

  // --- LANCHES (8) ---
  { id: 'l1', name: 'Burger Artesanal', price: 18.50, category: Category.Lanches, stock: 15, minStock: 5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', emoji: '🍔' },
  { id: 'l2', name: 'Misto Quente', price: 12.00, category: Category.Lanches, stock: 25, minStock: 5, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop', emoji: '🥪' },
  { id: 'l3', name: 'Hot Dog Especial', price: 14.00, category: Category.Lanches, stock: 20, minStock: 8, image: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=400&h=400&fit=crop', emoji: '🌭' },
  { id: 'l4', name: 'Beirute de Frango', price: 22.00, category: Category.Lanches, stock: 10, minStock: 3, image: 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=400&h=400&fit=crop', emoji: '🥙' },
  { id: 'l5', name: 'Wrap Integral', price: 16.00, category: Category.Lanches, stock: 15, minStock: 5, image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400&h=400&fit=crop', emoji: '🌯' },
  { id: 'l6', name: 'Baguete Salame', price: 17.50, category: Category.Lanches, stock: 12, minStock: 5, image: 'https://images.unsplash.com/photo-1553909489-cd47e0907d3f?w=400&h=400&fit=crop', emoji: '🥖' },
  { id: 'l7', name: 'Omelete Recheado', price: 13.00, category: Category.Lanches, stock: 20, minStock: 5, image: 'https://images.unsplash.com/photo-1494597564530-84758d760773?w=400&h=400&fit=crop', emoji: '🍳' },
  { id: 'l8', name: 'Sanduíche Natural', price: 15.00, category: Category.Lanches, stock: 10, minStock: 3, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop', emoji: '🥪' },

  // --- FRUTAS (8) ---
  { id: 'f1', name: 'Maçã Argentina', price: 3.50, category: Category.Frutas, stock: 30, minStock: 10, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', emoji: '🍎' },
  { id: 'f2', name: 'Banana Prata', price: 2.50, category: Category.Frutas, stock: 40, minStock: 15, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b3b7?w=400&h=400&fit=crop', emoji: '🍌' },
  { id: 'f3', name: 'Salada de Frutas', price: 12.00, category: Category.Frutas, stock: 15, minStock: 5, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop', emoji: '🥗' },
  { id: 'f4', name: 'Pera Williams', price: 4.50, category: Category.Frutas, stock: 18, minStock: 5, image: 'https://images.unsplash.com/photo-1514756331096-242f390efe22?w=400&h=400&fit=crop', emoji: '🍐' },
  { id: 'f5', name: 'Uva s/ Semente', price: 7.00, category: Category.Frutas, stock: 12, minStock: 4, image: 'https://images.unsplash.com/photo-1596333522248-1018528d03e3?w=400&h=400&fit=crop', emoji: '🍇' },
  { id: 'f6', name: 'Manga Picada', price: 6.50, category: Category.Frutas, stock: 10, minStock: 3, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop', emoji: '🥭' },
  { id: 'f7', name: 'Mamão Papaia', price: 8.00, category: Category.Frutas, stock: 8, minStock: 2, image: 'https://images.unsplash.com/photo-1517282003859-74002f935653?w=400&h=400&fit=crop', emoji: '🍈' },
  { id: 'f8', name: 'Melancia Fatiada', price: 6.50, category: Category.Frutas, stock: 12, minStock: 4, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop', emoji: '🍉' },

  // --- DOCES (8) ---
  { id: 'd1', name: 'Bolo de Chocolate', price: 9.50, category: Category.Doces, stock: 8, minStock: 3, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', emoji: '🍰' },
  { id: 'd2', name: 'Brigadeiro G', price: 4.50, category: Category.Doces, stock: 40, minStock: 10, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop', emoji: '🍫' },
  { id: 'd3', name: 'Pudim de Leite', price: 8.00, category: Category.Doces, stock: 12, minStock: 4, image: 'https://images.unsplash.com/photo-1590080874088-eec64895b423?w=400&h=400&fit=crop', emoji: '🍮' },
  { id: 'd4', name: 'Cookie Triple', price: 7.50, category: Category.Doces, stock: 20, minStock: 5, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', emoji: '🍪' },
  { id: 'd5', name: 'Mousse Maracujá', price: 7.00, category: Category.Doces, stock: 15, minStock: 5, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', emoji: '🍧' },
  { id: 'd6', name: 'Brownie Caseiro', price: 8.50, category: Category.Doces, stock: 18, minStock: 5, image: 'https://images.unsplash.com/photo-1461009112044-3b6647189d7a?w=400&h=400&fit=crop', emoji: '🍫' },
  { id: 'd7', name: 'Sonho de Creme', price: 6.50, category: Category.Doces, stock: 10, minStock: 3, image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=400&h=400&fit=crop', emoji: '🍩' },
  { id: 'd8', name: 'Torta de Limão', price: 9.00, category: Category.Doces, stock: 10, minStock: 3, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop', emoji: '🍋' },
];
