
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext"; 
import { LanguageSelector } from "@/components/ui/LanguageSelector";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationLinks = [
    { name: t('home'), href: "/" },
    { name: t('explore'), href: "/explore" },
    { name: t('contact'), href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="mr-2">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V12C4 15.31 6.69 20.5 12 22C17.31 20.5 20 15.31 20 12V6L12 2Z" 
                      fill="#337334" stroke="#337334" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-xl font-bold text-eco-700">TravelSync</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-eco-700 ${
                  isActive(link.href) ? "text-eco-700" : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons & Language Selector */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSelector />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.accountType === "guide" && (
                  <Link to="/guide/dashboard">
                    <Button
                      variant="ghost"
                      className="text-sm font-medium hover:text-eco-600"
                    >
                      {t('dashboard')}
                    </Button>
                  </Link>
                )}
                {user?.isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button
                      variant="ghost"
                      className="text-sm font-medium hover:text-eco-600"
                    >
                      {t('admin')}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="text-sm font-medium hover:text-eco-600"
                  onClick={handleLogout}
                >
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-eco-600"
                  >
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="bg-eco-600 hover:bg-eco-700">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="ml-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-eco-700 ${
                    isActive(link.href) ? "text-eco-700" : "text-gray-700"
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
