
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { experiencesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, MapPin, Clock, ArrowLeft, CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";

const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { data: experience, isLoading, error } = useQuery({
    queryKey: ['experience', id],
    queryFn: () => id ? experiencesApi.getById(id) : null,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <Skeleton className="h-[500px] w-full rounded-xl mb-8" />
              <Skeleton className="h-12 w-1/3 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <Skeleton className="h-40 w-full mb-6" />
                  <Skeleton className="h-60 w-full" />
                </div>
                <div>
                  <Skeleton className="h-96 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Experience not found</h1>
            <p className="text-gray-600 mb-6">Sorry, we couldn't find the experience you were looking for.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to book this experience",
        variant: "destructive",
      });
      navigate('/login', { state: { from: `/experience/${id}` } });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Date required",
        description: "Please select a date for your booking",
        variant: "destructive",
      });
      return;
    }

    navigate(`/booking/${id}?date=${selectedDate.toISOString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="h-[500px] relative">
          <img
            src={experience.images?.[0] || "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop"}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <Button 
                variant="outline" 
                className="bg-white/80 mb-4" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Badge className="mb-4 bg-eco-600">{experience.category}</Badge>
              <h1 className="text-4xl font-bold text-white mb-2">{experience.title}</h1>
              <div className="flex items-center text-white space-x-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{experience.duration} hours</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>4.8 (24 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">About this experience</h2>
                  <p className="text-gray-700 whitespace-pre-line">{experience.description}</p>
                </section>
                
                <Separator />
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">What to expect</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Highlights</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Explore pristine natural environments</li>
                        <li>Learn about local conservation efforts</li>
                        <li>Connect with experienced local guides</li>
                        <li>Contribute to sustainable tourism</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Includes</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Professional guide</li>
                        <li>Transportation</li>
                        <li>Refreshments</li>
                        <li>Safety equipment</li>
                      </ul>
                    </div>
                  </div>
                </section>
                
                <Separator />
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">Meet your host</h2>
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={experience.host?.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop"}
                        alt={experience.host?.firstName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {experience.host?.firstName} {experience.host?.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">Host since 2020</p>
                      <p className="text-gray-700">{experience.host?.bio || "Passionate about sharing the beauty and culture of my country with visitors from around the world."}</p>
                    </div>
                  </div>
                </section>
                
                <Separator />
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016404.178198387!2d27.992313750000004!3d-1.9407267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c29654e73637d5%3A0x7490b026cbcca5cb!2sRwanda!5e0!3m2!1sen!2sus!4v1646254361534!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      loading="lazy">
                    </iframe>
                  </div>
                </section>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-lg border p-6 sticky top-24">
                  <div className="text-2xl font-bold mb-6">
                    ${experience.price.toFixed(2)} <span className="text-base font-normal text-gray-600">/ person</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => 
                              date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                              date > new Date(new Date().setMonth(new Date().getMonth() + 6))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Guests
                      </label>
                      <div className="flex justify-between items-center border rounded-md p-2">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Guests</span>
                        </span>
                        <div>
                          <select
                            className="border-0 bg-transparent text-right focus:ring-0 focus:outline-none"
                            defaultValue="1"
                          >
                            {[...Array(experience.maxParticipants || 8)].map((_, i) => (
                              <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-eco-600 hover:bg-eco-700"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </Button>
                    
                    <div className="text-center text-sm text-gray-500">
                      You won't be charged yet
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <div>${experience.price.toFixed(2)} x 1 person</div>
                        <div>${experience.price.toFixed(2)}</div>
                      </div>
                      <div className="flex justify-between mb-2">
                        <div>Service fee</div>
                        <div>${(experience.price * 0.10).toFixed(2)}</div>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-4 mt-4">
                        <div>Total</div>
                        <div>${(experience.price * 1.10).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExperienceDetails;
