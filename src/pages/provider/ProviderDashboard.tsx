import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Calendar, MapPin, Users, ArrowRight, TrendingUp, TrendingDown, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import ProviderLayout from "@/components/layout/ProviderLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { experiencesApi, bookingsApi } from "@/lib/api";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch the provider's experiences
  const { data: experiences = [], isLoading: loadingExperiences } = useQuery({
    queryKey: ['provider-experiences', user?.id],
    queryFn: () => {
      console.log('Fetching experiences for host:', user?.id);
      return experiencesApi.getAll({ hostId: user?.id });
    },
    enabled: !!user?.id,
  });
  
  // Fetch the provider's bookings
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['provider-bookings', user?.id],
    queryFn: () => {
      console.log('Fetching bookings for host:', user?.id);
      return bookingsApi.getAll({ hostId: user?.id });
    },
    enabled: !!user?.id,
  });

  console.log('Experiences:', experiences);
  console.log('Bookings:', bookings);

  // Calculate stats based on real data
  const calculateAverageRating = () => {
    if (experiences.length === 0) return 0;
    const totalRating = experiences.reduce((sum, exp) => sum + (exp.rating || 0), 0);
    return (totalRating / experiences.length).toFixed(1);
  };

  const getBookingsThisMonth = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return bookings.filter(booking => 
      new Date(booking.createdAt) >= firstDayOfMonth
    ).length;
  };

  const getTotalVisitors = () => {
    return bookings.reduce((total, booking) => total + (booking.participants || 1), 0);
  };

  // Set loading state based on data fetching
  useEffect(() => {
    if (!loadingExperiences && !loadingBookings) {
      setIsLoading(false);
    }
  }, [loadingExperiences, loadingBookings]);

  // Stats based on real data
  const stats = [
    {
      title: "Total Experiences",
      value: experiences.length.toString(),
      icon: MapPin,
      change: experiences.length ? `+${experiences.length}` : "0",
      trend: "up"
    },
    {
      title: "Bookings This Month",
      value: getBookingsThisMonth().toString(),
      icon: Calendar,
      change: getBookingsThisMonth() ? `+${getBookingsThisMonth()}` : "0",
      trend: "up"
    },
    {
      title: "Total Visitors",
      value: getTotalVisitors().toString(),
      icon: Users,
      change: getTotalVisitors() ? `+${getTotalVisitors()}` : "0",
      trend: "up"
    },
    {
      title: "Average Rating",
      value: calculateAverageRating(),
      icon: BarChart,
      change: calculateAverageRating() ? `+${calculateAverageRating()}` : "0",
      trend: "up"
    }
  ];

  // Get recent bookings
  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Button 
            onClick={() => navigate("/guide/experiences/new")}
            className="bg-eco-600 hover:bg-eco-700"
          >
            Add New Experience
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs flex items-center mt-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                        {stat.change} from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>You have {recentBookings.length} recent bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No bookings yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{booking.experience?.title || "Experience"}</h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.user?.firstName} {booking.user?.lastName} · 
                              {new Date(booking.date).toLocaleDateString()} · 
                              {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/guide/bookings`)}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                      onClick={() => navigate("/guide/bookings")}
                  >
                    View All Bookings
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your experiences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                      onClick={() => navigate("/guide/experiences")}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Manage Experiences
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                      onClick={() => navigate("/guide/experiences/new")}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Add New Experience
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                      onClick={() => navigate("/guide/bookings")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    View Bookings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/guide/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderDashboard;
