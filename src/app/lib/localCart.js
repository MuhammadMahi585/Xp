export const LOCAL_CART_KEY = 'xp_cart';

export const loadLocalCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveLocalCart = (items) => {
  if (typeof window !== 'undefined')
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
};

export const clearLocalCart = () => {
  if (typeof window !== 'undefined') localStorage.removeItem(LOCAL_CART_KEY);
};
