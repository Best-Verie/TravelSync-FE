
import { GraduationCap, Globe, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Registration = () => {
  return (
    <section id="register" className="section bg-gradient-to-b from-gray-50 to-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="rounded-xl overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop" 
              alt="Young Rwandans in tourism training" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div>
          <span className="subtitle-badge">Youth Registration</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Rwanda's Tourism Revolution</h2>
          <p className="text-gray-700 mb-6">
            Are you a young Rwandan between 18-35 years old with passion for your culture and environment? Join our platform to offer your services and build sustainable income.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <GraduationCap className="text-eco-600 mb-3" size={32} />
              <h3 className="font-semibold text-lg mb-2">Free RDB Training</h3>
              <p className="text-gray-600">Access Rwanda Development Board certified courses</p>
            </div>
            
            <div className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <Globe className="text-eco-600 mb-3" size={32} />
              <h3 className="font-semibold text-lg mb-2">International Platform</h3>
              <p className="text-gray-600">Connect with visitors from around the world</p>
            </div>
            
            <div className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <Users className="text-eco-600 mb-3" size={32} />
              <h3 className="font-semibold text-lg mb-2">Community Network</h3>
              <p className="text-gray-600">Join Rwanda's growing tourism community</p>
            </div>
            
            <div className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <Award className="text-eco-600 mb-3" size={32} />
              <h3 className="font-semibold text-lg mb-2">RDB Certification</h3>
              <p className="text-gray-600">Earn recognized credentials in tourism</p>
            </div>
          </div>
          
          <Button className="bg-eco-600 hover:bg-eco-700 w-full sm:w-auto">
            <Link to="/register" className="w-full h-full inline-flex items-center justify-center">
              Register Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Registration;
