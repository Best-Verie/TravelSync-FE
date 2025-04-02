
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <section id="about" className="section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 animate-fade-in">
          <span className="subtitle-badge">About Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sustainable Tourism For Rwanda's Future</h2>
          <p className="text-gray-700 mb-6">
            Iwacu connects tourists with trained Rwandan youth who offer authentic experiences while 
            creating sustainable economic opportunities across Rwanda's beautiful landscapes.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <CheckCircle className="text-eco-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Youth Employment</h3>
                <p className="text-gray-600">Creating sustainable tourism careers for Rwanda's youth</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="text-eco-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Cultural Heritage</h3>
                <p className="text-gray-600">Preserving and sharing Rwanda's rich traditions and artistry</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="text-eco-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Conservation Efforts</h3>
                <p className="text-gray-600">Supporting Rwanda's commitment to environmental protection</p>
              </div>
            </div>
          </div>
          
          <Button 
            className="bg-eco-600 hover:bg-eco-700"
            onClick={() => navigate('/explore')}
          >
            Discover Our Impact
          </Button>
        </div>
        
        <div className="order-1 lg:order-2 relative">
          <div className="rounded-2xl overflow-hidden shadow-xl relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1557141441-31eefe119158?auto=format&fit=crop" 
              alt="Virunga National Park landscape in Rwanda" 
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 h-64 w-64 rounded-full bg-eco-100 z-0"></div>
          <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-sky-100 z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default About;
