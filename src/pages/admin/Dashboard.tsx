
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Calendar, TrendingUp, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { statsApi, bookingsApi } from "@/lib/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Fetch statistics from the backend
  const { data: appStats, isLoading: statsLoading } = useQuery({
    queryKey: ["appStats"],
    queryFn: statsApi.getAppStats,
  });
  
  // Fetch real bookings
  const { data: bookingsData = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["recentBookings"],
    queryFn: async () => {
      const bookings = await bookingsApi.getAll({ limit: 4 });
      return bookings;
    },
  });

  const isLoading = statsLoading || bookingsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
      </div>
    );
  }

  // Create stats array from backend data
  const stats = [
    {
      title: "Total Users",
      value: appStats?.totalUsers || 0,
      icon: Users,
      change: "+12%",
      timeframe: "from last month",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Experiences",
      value: appStats?.totalExperiences || 0,
      icon: MapPin,
      change: "+4",
      timeframe: "new this week",
      iconColor: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Bookings",
      value: appStats?.totalBookings || 0,
      icon: Calendar,
      change: "+18%",
      timeframe: "from last month",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Courses",
      value: appStats?.userRegistrations || 0,
      icon: BookOpen,
      change: "+3",
      timeframe: "new this month",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Welcome back, Admin!</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-md`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">{stat.change}</span> {stat.timeframe}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {bookingsData.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No bookings found</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Experience</th>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Amount</th>
                      <th className="text-left py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsData.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">{booking.id.slice(0, 6)}</td>
                        <td className="py-3 px-2">{booking.user?.firstName} {booking.user?.lastName}</td>
                        <td className="py-3 px-2">{booking.experience?.title || "N/A"}</td>
                        <td className="py-3 px-2">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="py-3 px-2">${booking.totalAmount?.toFixed(2)}</td>
                        <td className="py-3 px-2">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/admin/courses">
              <Button className="w-full">Manage Courses</Button>
            </Link>
            <Link to="/admin/users">
              <Button className="w-full" variant="outline">Manage Users</Button>
            </Link>
            <Link to="/admin/settings">
              <Button className="w-full" variant="outline">System Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
