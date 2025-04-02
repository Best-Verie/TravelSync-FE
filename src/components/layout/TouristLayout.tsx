
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookOpen, User } from 'lucide-react';

interface TouristLayoutProps {
  children: ReactNode;
}

const TouristLayout = ({ children }: TouristLayoutProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'My Profile', href: '/tourist/profile', icon: User },
    { name: 'My Courses', href: '/tourist/my-courses', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {isAuthenticated && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <nav className="flex overflow-x-auto py-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mr-4 ${
                      isActive
                        ? 'bg-eco-50 text-eco-700'
                        : 'text-gray-600 hover:text-eco-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TouristLayout;
