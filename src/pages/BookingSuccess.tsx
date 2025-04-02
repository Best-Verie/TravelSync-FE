
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, Users, ArrowRight } from "lucide-react";
import { bookingsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BookingSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      
      try {
        const data = await bookingsApi.getById(id);
        setBooking(data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <p>Loading your booking details...</p>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Booking Not Found</CardTitle>
            <CardDescription>We couldn't find the booking you're looking for.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/explore")}>
              Browse Experiences
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8 md:py-12 max-w-3xl mx-auto">
      <Card className="border-green-100">
        <CardHeader className="text-center bg-green-50 border-b border-green-100">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Booking Confirmed!</CardTitle>
          <CardDescription>
            Thank you for your booking. Your adventure is all set.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{booking.experience?.title}</h3>
              <p className="text-muted-foreground mt-1">
                {booking.experience?.location}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Participants</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Booking Reference</span>
                <span className="font-mono">{booking.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Status</span>
                <span className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-medium">${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 bg-gray-50 border-t">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate("/explore")}
          >
            Explore More
          </Button>
          <Button
            className="w-full sm:w-auto bg-eco-600 hover:bg-eco-700"
            onClick={() => {
              // Navigate to user's bookings page if available, or home otherwise
              navigate("/");
            }}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingSuccess;
