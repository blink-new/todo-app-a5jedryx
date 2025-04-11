
import { useState } from 'react';
import { PaymentForm } from './PaymentForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ProductCheckout = () => {
  const [showPayment, setShowPayment] = useState(false);
  const amount = 2999; // Example: $29.99

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="p-6 mb-4">
        <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
        <p className="text-gray-600 mb-4">Get access to all premium features</p>
        <div className="text-3xl font-bold mb-4">${(amount / 100).toFixed(2)}</div>
        <Button 
          onClick={() => setShowPayment(true)} 
          className="w-full"
          disabled={showPayment}
        >
          Purchase Now
        </Button>
      </Card>

      {showPayment && (
        <div className="mt-4">
          <PaymentForm amount={amount} />
        </div>
      )}
    </div>
  );
};