import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Home, MapPin, Calendar, User, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { experiencesApi, bookingsApi } from "@/lib/api";

interface ProviderLayoutProps {
  children: ReactNode;
}

const ProviderLayout = ({ children }: ProviderLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { toast } = useToast();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    // Check if user is a guide, accept both 'provider' and 'guide' account type values
    if (!user || (user.accountType !== 'provider' && user.accountType !== 'guide' && !user.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the guide portal",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  // Fetch guide stats
  const { data: experiences = [] } = useQuery({
    queryKey: ['guide-experiences', user?.id],
    queryFn: () => experiencesApi.getAll({ hostId: user?.id }),
    enabled: !!user?.id,
  });
  
  const { data: bookings = [] } = useQuery({
    queryKey: ['guide-bookings', user?.id],
    queryFn: () => bookingsApi.getAll({ hostId: user?.id }),
    enabled: !!user?.id,
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/guide/dashboard",
    },
    {
      name: "Experiences",
      icon: MapPin,
      path: "/guide/experiences",
    },
    {
      name: "Bookings",
      icon: Calendar,
      path: "/guide/bookings",
    },
    {
      name: "Profile",
      icon: User,
      path: "/guide/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="text-2xl font-bold text-eco-700 flex items-center">
              <span className="mr-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 6V12C4 15.31 6.69 20.5 12 22C17.31 20.5 20 15.31 20 12V6L12 2Z" 
                        fill="#337334" stroke="#337334" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              TravelSync
            </Link>
            <span className="hidden md:inline-block text-sm font-medium text-gray-500 ml-2">Guide Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">Guide</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-white border-r border-gray-200 w-64 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative h-[calc(100vh-4rem)] z-20`}
        >
          <div className="p-4">
            <div className="mb-6">
              <Button
                variant="outline" 
                size="sm"
                className="md:hidden ml-auto flex"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-md group ${
                    isActive(item.path)
                      ? "bg-eco-50 text-eco-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive(item.path) ? "text-eco-600" : "text-gray-500"
                  }`} />
                  {item.name}
                  {isActive(item.path) && (
                    <ChevronRight className="ml-auto h-4 w-4 text-eco-600" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {sidebarOpen && isMobile && (
            <div 
              className="fixed inset-0 bg-black/50 z-10 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
