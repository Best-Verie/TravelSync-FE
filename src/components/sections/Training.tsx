
import { ArrowRight, GraduationCap, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api";

const Training = () => {
  const navigate = useNavigate();
  
  // Fetch top 3 courses
  const { data: courses = [] } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => coursesApi.getAll().then(data => data.slice(0, 3)),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };
  
  return (
    <section id="training" className="section bg-gray-50">
      <div className="text-center mb-12">
        <span className="subtitle-badge">Skills Development</span>
        <h2 className="section-title">Tourism Training</h2>
        <p className="section-subtitle mx-auto">
          Comprehensive training programs to help Rwandan youth excel in tourism
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course: any) => (
            <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-eco-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap size={64} className="text-eco-700" />
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold text-eco-700 mb-2">{course.category?.toUpperCase() || 'COURSE'}</div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description?.substring(0, 100) || 'No description available'}...</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-eco-200 text-eco-700 hover:bg-eco-50"
                  onClick={() => handleCourseClick(course.id)}
                >
                  View Course <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-eco-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap size={64} className="text-eco-700" />
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold text-eco-700 mb-2">BEGINNER</div>
                <h3 className="text-xl font-bold mb-2">Rwanda Tourism Basics</h3>
                <p className="text-gray-600 mb-4">Learn the fundamentals of Rwanda's tourism industry and how to create memorable visitor experiences</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-eco-200 text-eco-700 hover:bg-eco-50"
                  onClick={() => navigate('/courses')}
                >
                  View Course <ArrowRight size={16} />
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-sky-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users size={64} className="text-sky-700" />
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold text-sky-700 mb-2">INTERMEDIATE</div>
                <h3 className="text-xl font-bold mb-2">Rwandan Hospitality</h3>
                <p className="text-gray-600 mb-4">Master the art of Rwandan hospitality and customer service excellence for tourism</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-sky-200 text-sky-700 hover:bg-sky-50"
                  onClick={() => navigate('/courses')}
                >
                  View Course <ArrowRight size={16} />
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-sand-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award size={64} className="text-sand-700" />
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold text-sand-700 mb-2">ADVANCED</div>
                <h3 className="text-xl font-bold mb-2">Tourism Entrepreneurship</h3>
                <p className="text-gray-600 mb-4">Build and grow your own tourism business in Rwanda's expanding market</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-sand-200 text-sand-700 hover:bg-sand-50"
                  onClick={() => navigate('/courses')}
                >
                  View Course <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="text-center mt-10">
        <Button 
          className="bg-eco-600 hover:bg-eco-700"
          onClick={() => navigate('/courses')}
        >
          View All Courses
        </Button>
      </div>
    </section>
  );
};

export default Training;
