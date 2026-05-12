// Currency formatter
export const formatCurrency = (amount: number, currency: string = 'GHS'): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Calculate profit
export const calculateProfit = (sourcePrice: number, sellingPrice: number, shippingCost: number = 0): number => {
  return sellingPrice - sourcePrice - shippingCost;
};

// Calculate markup percentage
export const calculateMarkup = (sourcePrice: number, sellingPrice: number): number => {
  if (sourcePrice === 0) return 0;
  return ((sellingPrice - sourcePrice) / sourcePrice) * 100;
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Generate slug
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate Ghana phone number
export const validateGhanaPhone = (phone: string): boolean => {
  const re = /^(\+233|0)?\d{9,}$/;
  return re.test(phone.replace(/\s/g, ''));
};

// Format date
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

// Format time ago
export const timeAgo = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return formatDate(d);
};

// Get cart summary
export interface CartSummary {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export const calculateCartSummary = (items: any[], shippingCost: number = 0): CartSummary => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;
  
  return {
    itemCount,
    subtotal,
    shipping: shippingCost,
    total,
  };
};

// Format phone for WhatsApp
export const formatPhoneForWhatsApp = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '233' + cleaned.substring(1);
  }
  if (!cleaned.startsWith('233')) {
    cleaned = '233' + cleaned;
  }
  return cleaned;
};

// Generate WhatsApp message
export const generateWhatsAppMessage = (
  customerName: string,
  products: any[],
  total: number,
  address: string
): string => {
  let message = `Hello! I'd like to place a preorder:\n\n`;
  message += `*Customer:* ${customerName}\n`;
  message += `*Delivery Address:* ${address}\n\n`;
  message += `*Products:*\n`;
  
  products.forEach((p) => {
    message += `• ${p.title} (${p.quantity}x) - GHS ${p.price}\n`;
  });
  
  message += `\n*Total:* GHS ${total.toFixed(2)}\n`;
  message += `\nPlease confirm and send payment details.`;
  
  return message;
};
