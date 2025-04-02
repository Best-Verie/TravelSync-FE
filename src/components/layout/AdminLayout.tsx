
import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  Shield,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { statsApi } from "@/lib/api";

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExperiences: 0,
    totalBookings: 0,
    totalCourses: 0
  });
  
  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      console.log("Non-admin user attempted to access admin area:", user);
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      console.log("Admin user authenticated:", user);
    }
    
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const data = await statsApi.getAppStats();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalExperiences: data.totalExperiences || 0,
          totalBookings: data.totalBookings || 0,
          totalCourses: data.userRegistrations || 0
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    
    fetchStats();
  }, [user, navigate, toast]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/admin/login");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // If not authenticated as admin, render nothing
  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/admin/dashboard" className="flex items-center">
            {sidebarOpen ? (
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-eco-600 mr-2" />
                <span className="text-xl font-semibold text-eco-600">TravelSync</span>
              </div>
            ) : (
              <Shield className="h-6 w-6 text-eco-600" />
            )}
          </Link>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1">
            {sidebarOpen ? <ChevronDown className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <nav className="flex flex-col flex-1 pt-5 overflow-y-auto">
          <div className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-md group ${
                    isActive 
                      ? "bg-eco-50 text-eco-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    isActive ? "text-eco-600" : "text-gray-500 group-hover:text-eco-600"
                  }`} />
                  {sidebarOpen && (
                    <span className={`ml-3 text-sm ${isActive ? "font-medium" : ""}`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">Admin Portal</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-eco-600 flex items-center justify-center text-white">
                  {user?.firstName?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
