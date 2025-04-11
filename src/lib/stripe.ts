
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (we'll add the key later)
export const getStripe = () => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    console.warn('Stripe key not found. Using test mode.');
    return null;
  }
  
  return loadStripe(stripeKey);
};