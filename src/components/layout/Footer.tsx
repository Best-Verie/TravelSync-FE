
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 pt-16 pb-8 px-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div>
            <div className="mb-6">
              <a href="/" className="text-2xl font-bold text-eco-700 flex items-center">
                <span className="mr-2">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 6V12C4 15.31 6.69 20.5 12 22C17.31 20.5 20 15.31 20 12V6L12 2Z" 
                          fill="#337334" stroke="#337334" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Iwacu
              </a>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Empowering Rwandan youth through tourism opportunities while showcasing Rwanda's natural beauty and cultural heritage.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-eco-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-eco-700 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-eco-700 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-eco-700 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>payment
            <h3 className="font-semibold text-lg mb-4">Experiences</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Gorilla Trekking</a></li>
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Cultural Tours</a></li>
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Kigali City Tours</a></li>
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Lake Kivu Activities</a></li>
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Local Cuisine</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">RDB Training Programs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Guide Registration</a></li>
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Rwanda Tourism Info</a></li>
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-gray-600 hover:text-eco-700 transition-colors">Support Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-eco-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-600">KG 7 Ave, Kigali, Rwanda</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-eco-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">+250 787 313 219</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-eco-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">info@iwacu.rw</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-500 mb-4 md:mb-0">
            © {currentYear} Iwacu. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2">
            <a href="#" className="text-gray-500 hover:text-eco-700 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-eco-700 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-eco-700 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
