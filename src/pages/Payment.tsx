
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsApi } from "@/lib/api";
import { StripePayment } from "@/components/payment/StripePayment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";

const Payment = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  // Booking details passed from the booking page
  const bookingDetails = location.state;

  useEffect(() => {
    if (!bookingDetails) {
      toast.error("No booking details found. Please start over.");
      navigate("/explore");
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to make a booking.");
      navigate("/login");
      return;
    }

    setBookingData(bookingDetails);
  }, [bookingDetails, navigate, isAuthenticated, user]);

  const handlePaymentSuccess = async (paymentId: string) => {
    setIsProcessing(true);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Create booking in the database
      const bookingPayload = {
        userId: user.id,
        experienceId: bookingData.experienceId,
        date: bookingData.date,
        participants: bookingData.participants,
        totalAmount: bookingData.totalAmount,
        status: "confirmed", // Automatically confirm since payment is successful
        paymentId: paymentId
      };

      console.log("Creating booking with payload:", bookingPayload);
      const response = await bookingsApi.create(bookingPayload);
      console.log("Booking created successfully:", response);

      toast.success("Booking confirmed successfully!");
      // Navigate to a success page or booking details
      navigate(`/booking-success/${response.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("There was an error confirming your booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
    setIsProcessing(false);
  };

  const handleBack = () => {
    if (bookingData?.experienceId) {
      navigate(`/booking/${bookingData.experienceId}`);
    } else {
      navigate("/explore");
    }
  };

  if (!bookingData) {
    return (
      <div className="container py-12 flex justify-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container py-12 flex justify-center">
        <p>Please log in to complete your booking.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Booking
      </Button>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Complete Your Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Review your booking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-lg">{bookingData.experienceName}</p>
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{new Date(bookingData.date).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{bookingData.participants} {bookingData.participants === 1 ? 'person' : 'people'}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>${bookingData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <StripePayment
            amount={bookingData.totalAmount}
            currency="USD"
            description={`Booking for ${bookingData.experienceName}`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;