import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Filter, MapPin, Search, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProviderLayout from "@/components/layout/ProviderLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['provider-bookings', user?.id, { date: date ? format(date, "yyyy-MM-dd") : undefined, status }],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const filters: any = {};
      
      if (date) {
        filters.date = format(date, "yyyy-MM-dd");
      }
      
      if (status) {
        filters.status = status;
      }
      
      return bookingsApi.getProviderBookings(user.id, filters);
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
  });
  
  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return bookingsApi.update(id, { status });
    },
    onSuccess: () => {
      toast.success("Booking status updated successfully");
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
    onError: (error: any) => {
      console.error("Error updating booking:", error);
      toast.error(error.response?.data?.message || "Failed to update booking status");
    }
  });
  
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.experience?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        booking.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        booking.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        booking.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBookingMutation.mutate({ id: bookingId, status: newStatus });
  };
  
  const clearFilters = () => {
    setDate(undefined);
    setStatus(undefined);
  };
  
  const viewBookingDetails = (bookingId: string) => {
    navigate(`/guide/bookings/${bookingId}`);
  };

  const currentDate = new Date();
  const upcomingBookings = filteredBookings.filter(booking => 
    new Date(booking.date) >= currentDate
  );
  
  const pastBookings = filteredBookings.filter(booking => 
    new Date(booking.date) < currentDate
  );

  useEffect(() => {
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
    }
  }, [user?.id, queryClient]);

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage reservations for your experiences</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            {(date || status) && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Bookings ({filteredBookings.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {isLoadingBookings ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4">
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-muted-foreground">
                  {(searchTerm || date || status) 
                    ? "Try adjusting your search or filters" 
                    : "You haven't received any bookings yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{booking.experience?.title || "Experience"}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {booking.experience?.location || "Location not specified"}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Select 
                          defaultValue={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="pending">Set Pending</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewBookingDetails(booking.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Customer</p>
                          <p className="font-medium">{booking.user?.firstName} {booking.user?.lastName}</p>
                          <p className="text-sm">{booking.user?.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Group Size</p>
                          <p className="font-medium">{booking.participants} {booking.participants === 1 ? 'person' : 'people'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-medium">${booking.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p>{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-6">
            {isLoadingBookings ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4">
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground">
                  You have no upcoming bookings at this time
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{booking.experience?.title || "Experience"}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {booking.experience?.location || "Location not specified"}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Select 
                          defaultValue={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="pending">Set Pending</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewBookingDetails(booking.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Customer</p>
                          <p className="font-medium">{booking.user?.firstName} {booking.user?.lastName}</p>
                          <p className="text-sm">{booking.user?.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Group Size</p>
                          <p className="font-medium">{booking.participants} {booking.participants === 1 ? 'person' : 'people'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-medium">${booking.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            {isLoadingBookings ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4">
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pastBookings.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                <p className="text-muted-foreground">
                  You have no completed bookings yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{booking.experience?.title || "Experience"}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {booking.experience?.location || "Location not specified"}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewBookingDetails(booking.id)}
                      >
                        View Details
                      </Button>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Customer</p>
                          <p className="font-medium">{booking.user?.firstName} {booking.user?.lastName}</p>
                          <p className="text-sm">{booking.user?.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Group Size</p>
                          <p className="font-medium">{booking.participants} {booking.participants === 1 ? 'person' : 'people'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-medium">${booking.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProviderLayout>
  );
};

export default ProviderBookings;
