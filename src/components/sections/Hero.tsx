
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1612450622914-f922e053bd82?auto=format&fit=crop')",
          filter: "brightness(0.7)"
        }}
      />
      
      <div className="container relative z-10 text-white">
        <div className="max-w-3xl animate-fade-in">
          <span className="subtitle-badge bg-white/20 backdrop-blur-sm text-white">Iwacu Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Empowering Rwandan Youth Through Tourism
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl">
            Connect with trained local Rwandan guides, find authentic experiences, 
            and discover handcrafted goods while supporting sustainable community development.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-eco-600 hover:bg-eco-700 text-white text-base"
              onClick={() => navigate('/explore')}
            >
              Explore Rwanda
              <ArrowRight size={18} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 text-white text-base"
              onClick={() => navigate('/guide/register')}
            >
              Register as Guide
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
