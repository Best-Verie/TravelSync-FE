
import { useState } from 'react';
import { MapPin, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { experiencesApi } from '@/lib/api';
import { useNavigate } from "react-router-dom";

const ExploreRwanda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => experiencesApi.getAll(),
  });

  const filteredDestinations = searchTerm 
    ? destinations.filter(dest => 
        dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : destinations;

  const getDestinationsByCategory = (category) => {
    return filteredDestinations.filter(d => d.category.toLowerCase() === category.toLowerCase());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="container relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Rwanda</h1>
          <p className="text-xl mb-6 max-w-2xl">Discover the breathtaking landscapes, vibrant culture, and unforgettable experiences across the Land of a Thousand Hills.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <Input 
              placeholder="Search destinations, activities..." 
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="bg-eco-600 hover:bg-eco-700">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-8">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="nature">Nature</TabsTrigger>
                <TabsTrigger value="culture">Culture</TabsTrigger>
                <TabsTrigger value="lakes">Lakes</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <Skeleton className="h-56 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-7 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="all" className="mt-0">
                  <DestinationGrid destinations={filteredDestinations} />
                </TabsContent>
                
                <TabsContent value="nature" className="mt-0">
                  <DestinationGrid destinations={getDestinationsByCategory('nature')} />
                </TabsContent>
                
                <TabsContent value="culture" className="mt-0">
                  <DestinationGrid destinations={getDestinationsByCategory('culture')} />
                </TabsContent>
                
                <TabsContent value="lakes" className="mt-0">
                  <DestinationGrid destinations={getDestinationsByCategory('lakes')} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const DestinationGrid = ({ destinations }) => {
  if (destinations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No destinations found in this category.</p>
      </div>
    );
  }

  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <div key={destination.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div className="h-56 overflow-hidden">
            <img 
              src={destination.images?.[0] || destination.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop'}
              alt={destination.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin size={16} className="mr-1" />
              {destination.location}
            </div>
            <h3 className="text-xl font-bold mb-2">{destination.title}</h3>
            <p className="text-gray-600 mb-4">{destination.description}</p>
            <Button className="w-full bg-eco-600 hover:bg-eco-700"
                  onClick={() => navigate(`/experience/${destination.id}`)}
            >Explore</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExploreRwanda;
