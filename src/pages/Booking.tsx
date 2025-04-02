
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Minus, Users, Clock, MapPin, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { experiencesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      try {
        const data = await experiencesApi.getById(id);
        setExperience(data);
        setTotalPrice(data.price);
      } catch (error) {
        console.error("Failed to fetch experience:", error);
        toast({
          title: "Error",
          description: "Failed to load experience details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperience();
  }, [id, toast]);
  
  useEffect(() => {
    if (experience) {
      setTotalPrice(experience.price * participants);
    }
  }, [participants, experience]);
  
  const handleParticipantsChange = (change: number) => {
    const newValue = participants + change;
    if (newValue >= 1 && newValue <= (experience?.maxParticipants || 10)) {
      setParticipants(newValue);
    }
  };
  
  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to book this experience.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/booking/${id}` } });
      return;
    }

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for your booking.",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to payment page with booking details
    navigate(`/payment`, {
      state: {
        experienceId: id,
        experienceName: experience?.title,
        date: date,
        participants: participants,
        totalAmount: totalPrice,
        hostId: experience?.hostId,
      }
    });
  };
  
  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
      </div>
    );
  }
  
  if (!experience) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Experience not found</h2>
          <p className="mt-4 text-gray-600">The experience you're looking for doesn't exist or has been removed.</p>
          <Button
            className="mt-6 bg-eco-600 hover:bg-eco-700"
            onClick={() => navigate("/explore")}
          >
            Explore Other Experiences
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Book Your Experience</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Experience Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Experience Details</CardTitle>
              <CardDescription>You're booking the following experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-video rounded-md overflow-hidden">
                    <img 
                      src={experience.images[0] || "/placeholder.svg"} 
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-xl font-semibold">{experience.title}</h2>
                  
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{experience.location}</span>
                  </div>
                  
                  <div className="flex items-center mt-2 text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Duration: {experience.duration} hours</span>
                  </div>
                  
                  <div className="flex items-center mt-2 text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">Max participants: {experience.maxParticipants}</span>
                  </div>
                  
                  <p className="mt-4 text-gray-600 line-clamp-3">{experience.description}</p>
                  
                  <div className="mt-4">
                    <span className="font-medium text-lg text-eco-700">${experience.price}</span>
                    <span className="text-gray-500 text-sm"> / person</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Booking Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Select date and number of participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Participants */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Participants</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleParticipantsChange(-1)}
                    disabled={participants <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center font-medium">{participants}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleParticipantsChange(1)}
                    disabled={participants >= (experience?.maxParticipants || 10)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price per person</span>
                  <span>${experience.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants</span>
                  <span>x {participants}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-eco-600 hover:bg-eco-700"
                onClick={handleProceedToPayment}
                disabled={!date || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;
