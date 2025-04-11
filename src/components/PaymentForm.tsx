
import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    // For now, just show a success message
    // We'll add actual payment processing when keys are added
    setTimeout(() => {
      setIsLoading(false);
      alert('Payment simulation complete! Add Stripe keys to process real payments.');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </Button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
};

export const PaymentForm = ({ amount }: { amount: number }) => {
  const stripePromise = getStripe();

  if (!stripePromise) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>Stripe is in test mode. Add your Stripe keys to process real payments.</p>
          <Button 
            onClick={() => alert('Please add your Stripe keys to enable payments.')}
            className="mt-4"
          >
            Test Payment Flow
          </Button>
        </div>
      </Card>
    );
  }

  const options = {
    mode: 'payment' as const,
    amount: amount,
    currency: 'usd',
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Card className="p-6">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </Card>
  );
};