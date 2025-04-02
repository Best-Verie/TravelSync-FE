
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { coursesApi, enrollmentsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, CheckCircle, Loader2, PlayCircle } from "lucide-react";
import TouristLayout from "@/components/layout/TouristLayout";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getById(id || ''),
    enabled: !!id
  });

  // Check if user is already enrolled
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: () => enrollmentsApi.getUserEnrollments(user?.id || ''),
    enabled: !!user?.id
  });

  const isEnrolled = enrollments.some((enrollment: any) => 
    enrollment.courseId === id && enrollment.userId === user?.id
  );

  // Get current enrollment if enrolled
  const currentEnrollment = enrollments.find((enrollment: any) => 
    enrollment.courseId === id && enrollment.userId === user?.id
  );

  // Enroll in course mutation
  const enrollMutation = useMutation({
    mutationFn: () => {
      return enrollmentsApi.create({
        userId: user?.id,
        courseId: id
      });
    },
    onSuccess: (data) => {
      toast.success("Successfully enrolled in the course!");
      queryClient.invalidateQueries({ queryKey: ['enrollments', user?.id] });
      // Navigate to course content directly after successful enrollment
      navigate(`/courses/${id}/content/${data.id}`);
    },
    onError: (error: any) => {
      console.error("Enrollment error:", error);
      toast.error(error.response?.data?.message || "Failed to enroll in the course");
    },
  });

  const handleEnroll = () => {
    if (!isAuthenticated) {
      // Store course ID in localStorage before redirect to login
      localStorage.setItem('pendingCourseEnrollment', id || '');
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    setIsEnrolling(true);
    enrollMutation.mutate(undefined, {
      onSettled: () => {
        setIsEnrolling(false);
      }
    });
  };

  const handleTakeCourse = () => {
    if (currentEnrollment) {
      navigate(`/courses/${id}/content/${currentEnrollment.id}`);
    }
  };

  if (courseLoading) {
    return (
      <TouristLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
        </div>
      </TouristLayout>
    );
  }

  if (!course) {
    return (
      <TouristLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Course not found</h2>
          <p className="mt-2 text-gray-500">The course you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </Button>
        </div>
      </TouristLayout>
    );
  }

  // Use Rwandan landscape as default image
  const placeholderImage = "https://images.unsplash.com/photo-1586273249019-c82813a91a90?auto=format&fit=crop";

  return (
    <TouristLayout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className={
                  course.category === 'guide-training' ? 'bg-blue-100 text-blue-800' : 
                  course.category === 'ecotourism' ? 'bg-green-100 text-green-800' :
                  course.category === 'entrepreneurship' ? 'bg-purple-100 text-purple-800' :
                  course.category === 'language' ? 'bg-yellow-100 text-yellow-800' :
                  course.category === 'conservation' ? 'bg-teal-100 text-teal-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {course.category}
                </Badge>
                {isEnrolled && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img 
                src={course.image || placeholderImage} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              {course.duration && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Duration: {course.duration}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Educational</span>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700">{course.description}</p>
            </div>

            {course.topics && course.topics.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Topics Covered</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {course.topics.map((topic, index) => (
                    <li key={index} className="text-gray-700">{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Enrollment Card */}
          <div>
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Course Enrollment</h2>

              {course.duration && (
                <div className="flex items-center mb-4 text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{course.duration}</span>
                </div>
              )}

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>You're already enrolled in this course</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-eco-600 hover:bg-eco-700 flex items-center justify-center"
                    onClick={handleTakeCourse}
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Start Learning
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/tourist/my-courses')}
                  >
                    View My Courses
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full bg-eco-600 hover:bg-eco-700"
                  onClick={handleEnroll}
                  disabled={isEnrolling || enrollmentsLoading}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    'Enroll in this Course'
                  )}
                </Button>
              )}

              <div className="mt-6 text-sm text-gray-500">
                <p>By enrolling, you'll have access to educational materials and resources related to this course.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TouristLayout>
  );
};

export default CourseDetails;
