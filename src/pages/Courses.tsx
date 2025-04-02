import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import TouristLayout from "@/components/layout/TouristLayout";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  duration?: string;
  topics: string[];
}

const CategoryBadge = ({ category }: { category: string }) => {
  const categoryColors: Record<string, string> = {
    'guide-training': 'bg-blue-100 text-blue-800',
    'ecotourism': 'bg-green-100 text-green-800',
    'entrepreneurship': 'bg-purple-100 text-purple-800',
    'language': 'bg-yellow-100 text-yellow-800',
    'conservation': 'bg-teal-100 text-teal-800',
  };

  const categoryNames: Record<string, string> = {
    'guide-training': 'Guide Training',
    'ecotourism': 'Ecotourism',
    'entrepreneurship': 'Entrepreneurship',
    'language': 'Language',
    'conservation': 'Conservation',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
      {categoryNames[category] || category}
    </span>
  );
};

const Courses = () => {
  const navigate = useNavigate();
  
  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesApi.getAll
  });

  if (isLoading) {
    return (
      <TouristLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
        </div>
      </TouristLayout>
    );
  }

  if (isError) {
    return (
      <TouristLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load courses. Please try again later.</p>
        </div>
      </TouristLayout>
    );
  }

  const placeholderImage = "https://images.unsplash.com/photo-1586273249019-c82813a91a90?auto=format&fit=crop";

  return (
    <TouristLayout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Educational Programs</h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Expand your knowledge with our specialized courses for tourism professionals and nature enthusiasts.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No courses available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: Course) => (
              <Card key={course.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={course.image || placeholderImage}
                    alt={course.title}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl line-clamp-1">{course.title}</CardTitle>
                    <CategoryBadge category={course.category} />
                  </div>
                  {course.duration && (
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <span>Duration: {course.duration}</span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 line-clamp-3">{course.description}</p>
                  {course.topics && course.topics.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Topics covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {topic}
                          </Badge>
                        ))}
                        {course.topics.length > 3 && (
                          <Badge variant="outline" className="bg-gray-50">
                            +{course.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TouristLayout>
  );
};

export default Courses;
