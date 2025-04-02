
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// This is a mock Stripe payment component for learning purposes
// In a real application, you would use the actual Stripe React components

interface StripePaymentProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export const StripePayment = ({
  amount,
  currency = "USD",
  description,
  onSuccess,
  onError
}: StripePaymentProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  // For testing/learning purposes only
  const testCards = [
    { number: "4242 4242 4242 4242", result: "success" },
    { number: "4000 0000 0000 0002", result: "decline" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const testCard = testCards.find(card => cardNumber.replace(/\s/g, "") === card.number.replace(/\s/g, ""));
      
      if (testCard && testCard.result === "success") {
        const mockPaymentId = `pi_${Math.random().toString(36).substr(2, 9)}`;
        onSuccess(mockPaymentId);
      } else {
        onError("Payment failed. Please try a different card or contact support.");
      }
      setProcessing(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          {description} - {amount.toFixed(2)} {currency}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              For testing, use: 4242 4242 4242 4242 (success) or 4000 0000 0000 0002 (decline)
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                type="password"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-eco-600 hover:bg-eco-700"
            disabled={processing}
          >
            {processing ? "Processing..." : `Pay ${amount.toFixed(2)} ${currency}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
