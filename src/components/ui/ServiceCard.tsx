
import { useState } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  image: string;
  title: string;
  category: string;
  location: string;
  price: string;
  rating: number;
  onClick?: () => void;
}

const ServiceCard = ({ image, title, category, location, price, rating, onClick }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center transform transition-transform duration-700 ease-out"
          style={{ 
            backgroundImage: `url(${image})`,
            transform: isHovered ? 'scale(1.03)' : 'scale(1)'
          }}
        />
        <div 
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-eco-700 shadow-sm">
          {category}
        </div>
      </div>
      
      <div className="p-5 border border-t-0 rounded-b-xl">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight mb-1">{title}</h3>
          <div className="flex items-center space-x-0.5 bg-eco-50 px-2 py-0.5 rounded text-eco-700">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-3">{location}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-eco-700 font-semibold">{price}</div>
          {onClick ? (
            <button 
              className="flex items-center text-sm text-eco-600 hover:text-eco-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <span className="mr-1">View details</span>
              <ChevronRight size={16} className={`transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`} />
            </button>
          ) : (
            <Link 
              to="/experience/1" 
              className="flex items-center text-sm text-eco-600 hover:text-eco-800 transition-colors"
            >
              <span className="mr-1">View details</span>
              <ChevronRight size={16} className={`transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
