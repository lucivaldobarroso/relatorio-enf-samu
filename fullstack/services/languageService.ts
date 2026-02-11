
type TranslationMap = {
  [key: string]: {
    PT: string;
    EN: string;
    ES: string;
  };
};

const translations: TranslationMap = {
  welcome: { PT: 'Olá', EN: 'Hello', ES: 'Hola' },
  greeting_morning: { PT: 'Bom dia', EN: 'Good morning', ES: 'Buen día' },
  greeting_afternoon: { PT: 'Boa tarde', EN: 'Good afternoon', ES: 'Buenas tardes' },
  greeting_night: { PT: 'Boa noite', EN: 'Good evening', ES: 'Buenas noches' },
  home: { PT: 'Início', EN: 'Home', ES: 'Inicio' },
  menu: { PT: 'Cardápio', EN: 'Menu', ES: 'Menú' },
  stock: { PT: 'Estoque', EN: 'Stock', ES: 'Inventario' },
  history: { PT: 'Pedidos', EN: 'Orders', ES: 'Pedidos' },
  logout: { PT: 'Sair', EN: 'Logout', ES: 'Salir' },
  search_placeholder: { PT: 'O que vamos comer hoje?', EN: 'What are we eating today?', ES: '¿Qué vamos a comer hoy?' },
  checkout: { PT: 'Finalizar Pedido', EN: 'Checkout', ES: 'Finalizar' },
  balance: { PT: 'Seu Saldo', EN: 'Your Balance', ES: 'Tu Saldo' },
  total: { PT: 'Total', EN: 'Total', ES: 'Total' },
  payment_method: { PT: 'Método de Pagamento', EN: 'Payment Method', ES: 'Método de Pago' },
  confirm_payment: { PT: 'Confirmar Pagamento', EN: 'Confirm Payment', ES: 'Confirmar Pago' },
  back: { PT: 'Voltar', EN: 'Back', ES: 'Volver' },
  libras_title: { PT: 'Suporte Libras', EN: 'Sign Language', ES: 'Lengua de Señas' },
  libras_desc: { PT: 'Iniciando intérprete virtual...', EN: 'Starting virtual interpreter...', ES: 'Iniciando intérprete virtual...' },
  order_number: { PT: 'Número do Pedido', EN: 'Order Number', ES: 'Número del Pedido' },
  estimate: { PT: 'Estimativa', EN: 'Estimate', ES: 'Estimación' },
  order_received: { PT: 'Recebido', EN: 'Received', ES: 'Recibido' },
  order_preparing: { PT: 'Preparando', EN: 'Preparing', ES: 'Preparando' },
  order_pickup: { PT: 'Retirada', EN: 'Pickup', ES: 'Retirada' },
  status_title: { PT: 'Status do Pedido', EN: 'Order Status', ES: 'Estado del Pedido' },
  order_details: { PT: 'Ver detalhes do pedido', EN: 'View order details', ES: 'Ver detalles del pedido' },
  success_thanks: { PT: 'Obrigado pela preferência!', EN: 'Thank you for your preference!', ES: '¡Gracias por su preferencia!' },
  success_msg: { PT: 'está sendo preparado com todo carinho.', EN: 'is being prepared with care.', ES: 'se está preparando con cuidado.' },
  want_more: { PT: 'Quero mais um!', EN: 'I want more!', ES: '¡Quiero más!' },
  go_home: { PT: 'Voltar ao Início', EN: 'Go Home', ES: 'Volver al Inicio' },
  cash_flow: { PT: 'Fluxo de Caixa', EN: 'Cash Flow', ES: 'Flujo de Caja' },
  profits: { PT: 'Gestão de Lucros', EN: 'Profit Management', ES: 'Gestión de Ganancias' },
  my_orders: { PT: 'Meus Pedidos', EN: 'My Orders', ES: 'Mis Pedidos' },
  order_history: { PT: 'Histórico de Consumo', EN: 'Consumption History', ES: 'Historial de Consumo' },
  no_orders: { PT: 'Você ainda não realizou pedidos.', EN: 'You have no orders yet.', ES: 'Aún no has realizado pedidos.' },
  support: { PT: 'Fale Comigo', EN: 'Contact Me', ES: 'Habla Conmigo' },
  contact_desc: { PT: 'Estamos prontos para te ajudar com pedidos, créditos ou sugestões.', EN: 'We are ready to help you with orders, credits or suggestions.', ES: 'Estamos listos para ayudarte con pedidos, créditos o sugerencias.' }
};

export const languageService = {
  get: (key: string, lang: string): string => {
    return translations[key] ? translations[key][lang as 'PT' | 'EN' | 'ES'] : key;
  },
  setLang: (lang: string) => localStorage.setItem('app_lang', lang),
  getLang: () => localStorage.getItem('app_lang') || 'PT'
};
