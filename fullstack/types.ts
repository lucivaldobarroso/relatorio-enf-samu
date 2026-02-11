
export enum Category {
  Salgados = 'Salgados',
  Bebidas = 'Bebidas',
  Doces = 'Doces',
  Frutas = 'Frutas',
  Lanches = 'Lanches'
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  avatar: string;
  balance: number;
  favorites: string[]; // IDs dos produtos favoritos
  hasActiveContract: boolean;
  contractSignedAt?: string;
  contractExpiresAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  stock: number;
  minStock: number;
  image: string;
  emoji: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'Dinheiro' | 'PIX' | 'Cartão' | 'Fiado' | 'Plano Quinzenal';
  type: 'sale' | 'expense' | 'payment';
  orderType: 'immediate' | 'pickup';
  description?: string;
  userId?: string;
}

export interface AppState {
  products: Product[];
  transactions: Transaction[];
  users: User[];
  auth: {
    isAuthenticated: boolean;
    role: 'admin' | 'user' | null;
    currentUserId: string | null;
  };
}
