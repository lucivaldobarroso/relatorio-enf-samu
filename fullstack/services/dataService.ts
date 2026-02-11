
import { AppState, Product, Transaction, User, Category } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const STORAGE_KEY = 'cantina_facil_state_v5';

const defaultAdmin: User = {
  id: 'admin_01',
  username: 'adm',
  password: '1234',
  name: 'Administrador',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  balance: 0,
  favorites: [],
  hasActiveContract: false
};

const defaultUser: User = {
  id: 'user_01',
  username: 'cliente',
  password: '1234',
  name: 'Cliente Padrão',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  balance: 0,
  favorites: [],
  hasActiveContract: false
};

const initialState: AppState = {
  products: INITIAL_PRODUCTS,
  transactions: [],
  users: [defaultAdmin, defaultUser],
  auth: {
    isAuthenticated: false,
    role: null,
    currentUserId: null
  }
};

export const dataService = {
  getState: (): AppState => {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : initialState;
    
    // Recalcular saldos para garantir que as dívidas de "Plano Quinzenal" apareçam no perfil do usuário
    parsed.users.forEach((user: User) => {
      const debt = parsed.transactions
        .filter((t: Transaction) => t.userId === user.id && t.paymentMethod === 'Plano Quinzenal' && t.type === 'sale')
        .reduce((acc: number, curr: Transaction) => acc + curr.total, 0);
      
      const payments = parsed.transactions
        .filter((t: Transaction) => t.userId === user.id && t.type === 'payment')
        .reduce((acc: number, curr: Transaction) => acc + curr.total, 0);
        
      user.balance = Math.max(0, debt - payments);
      if (!user.favorites) user.favorites = [];
    });

    return parsed;
  },

  saveState: (state: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  login: (username: string, password: string): boolean => {
    const state = dataService.getState();
    const user = state.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      state.auth = { 
        isAuthenticated: true, 
        role: user.role, 
        currentUserId: user.id 
      };
      dataService.saveState(state);
      return true;
    }
    return false;
  },

  toggleFavorite: (productId: string) => {
    const state = dataService.getState();
    const user = state.users.find(u => u.id === state.auth.currentUserId);
    if (user) {
      if (!user.favorites) user.favorites = [];
      const index = user.favorites.indexOf(productId);
      if (index === -1) {
        user.favorites.push(productId);
      } else {
        user.favorites.splice(index, 1);
      }
      dataService.saveState(state);
    }
  },

  getCurrentUser: (): User => {
    const state = dataService.getState();
    return state.users.find(u => u.id === state.auth.currentUserId) || defaultUser;
  },

  register: (name: string, username: string, password: string) => {
    const state = dataService.getState();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      password,
      name,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=eeee2b&color=1a1a1a`,
      balance: 0,
      favorites: [],
      hasActiveContract: false
    };
    state.users.push(newUser);
    state.auth = { isAuthenticated: true, role: 'user', currentUserId: newUser.id };
    dataService.saveState(state);
  },

  logout: () => {
    const state = dataService.getState();
    state.auth = { isAuthenticated: false, role: null, currentUserId: null };
    dataService.saveState(state);
  },

  updateCurrentUser: (name: string) => {
    const state = dataService.getState();
    const user = state.users.find(u => u.id === state.auth.currentUserId);
    if (user) { 
      user.name = name; 
      dataService.saveState(state); 
    }
  },

  addTransaction: (transaction: Transaction) => {
    const state = dataService.getState();
    // Vincular pedido ao usuário atual para histórico
    if (!transaction.userId) {
      transaction.userId = state.auth.currentUserId || undefined;
    }
    state.transactions.unshift(transaction);
    
    // Atualizar estoque
    if (transaction.type === 'sale') {
      transaction.items.forEach(item => {
        const product = state.products.find(p => p.id === item.id);
        if (product) product.stock = Math.max(0, product.stock - item.quantity);
      });
    }
    dataService.saveState(state);
  },

  // Fix: Added missing updateTransaction method
  updateTransaction: (updatedTx: Transaction) => {
    const state = dataService.getState();
    const index = state.transactions.findIndex(t => t.id === updatedTx.id);
    if (index !== -1) {
      state.transactions[index] = updatedTx;
      dataService.saveState(state);
    }
  },

  // Fix: Added missing deleteTransaction method
  deleteTransaction: (transactionId: string) => {
    const state = dataService.getState();
    state.transactions = state.transactions.filter(t => t.id !== transactionId);
    dataService.saveState(state);
  },

  addProduct: (newProduct: Product) => {
    const state = dataService.getState();
    state.products.push(newProduct);
    dataService.saveState(state);
  },

  updateProduct: (updatedProduct: Product) => {
    const state = dataService.getState();
    const index = state.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) { state.products[index] = updatedProduct; dataService.saveState(state); }
  },

  deleteProduct: (productId: string) => {
    const state = dataService.getState();
    state.products = state.products.filter(p => p.id !== productId);
    dataService.saveState(state);
  },

  // Fix: Added missing signContract method
  signContract: (signature: string) => {
    const state = dataService.getState();
    const user = state.users.find(u => u.id === state.auth.currentUserId);
    if (user) {
      user.hasActiveContract = true;
      user.contractSignedAt = new Date().toISOString();
      user.contractExpiresAt = new Date(Date.now() + 15552000000).toISOString(); // Approx 6 months
      dataService.saveState(state);
    }
  }
};
