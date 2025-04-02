
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { experiencesApi } from '@/lib/api';
import ServiceCard from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [visibleCount, setVisibleCount] = useState(4);

  const { data: experiences = [], isLoading, error } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => experiencesApi.getAll(),
  });

  if (error) {
    console.error('Error loading experiences:', error);
  }

  const handleViewMore = () => {
    if (visibleCount < experiences.length) {
      setVisibleCount(prev => prev + 4);
    } else {
      toast({
        title: "No more experiences",
        description: "You've viewed all available experiences",
      });
    }
  };

  const visibleExperiences = experiences.slice(0, visibleCount);

  return (
    <div id="services" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Explore Eco-Friendly Experiences</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover sustainable tourism experiences that connect you with nature, community, and culture. 
              Support local initiatives while creating unforgettable memories.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No experiences available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleExperiences.map((experience) => (
                  <ServiceCard
                    key={experience.id}
                    title={experience.title}
                    category={experience.category}
                    location={experience.location}
                    price={`$${experience.price} / ${experience.price < 10 ? 'session' : 'person'}`}
                    rating={experience.rating || 4.5}
                    image={experience.images?.[0] || experience.image}
                    onClick={() => navigate(`/experience/${experience.id}`)}
                  />
                ))}
              </div>

              {visibleCount < experiences.length && (
                <div className="text-center mt-10">
                  <Button 
                    onClick={handleViewMore}
                    className="bg-eco-600 hover:bg-eco-700"
                  >
                    View More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
