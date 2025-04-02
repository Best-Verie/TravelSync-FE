
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import TouristLayout from "@/components/layout/TouristLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookCheck, BookOpen, Calendar, CheckCircle, Clock, ExternalLink, Loader2, PlayCircle } from "lucide-react";
import { format } from "date-fns";

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    duration?: string;
    topics: string[];
  };
}

const MyCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("enrolled");
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Fetch user's enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: () => enrollmentsApi.getUserEnrollments(user?.id || ''),
    enabled: !!user?.id,
  });

  // Mark course as complete mutation
  const completeMutation = useMutation({
    mutationFn: (enrollmentId: string) => {
      return enrollmentsApi.complete(enrollmentId);
    },
    onSuccess: () => {
      toast.success("Course marked as completed!");
      queryClient.invalidateQueries({ queryKey: ['enrollments', user?.id] });
    },
    onError: (error: any) => {
      console.error("Course completion error:", error);
      toast.error(error.response?.data?.message || "Failed to mark course as completed");
    },
  });

  const handleComplete = (enrollmentId: string) => {
    setCompletingId(enrollmentId);
    completeMutation.mutate(enrollmentId, {
      onSettled: () => {
        setCompletingId(null);
      },
    });
  };

  const handleStartCourse = (enrollment: Enrollment) => {
    navigate(`/courses/${enrollment.courseId}/content/${enrollment.id}`);
  };

  if (enrollmentsLoading) {
    return (
      <TouristLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
        </div>
      </TouristLayout>
    );
  }

  // Filter enrollments by status
  const enrolledCourses = enrollments.filter((enrollment: Enrollment) => enrollment.status === 'enrolled');
  const completedCourses = enrollments.filter((enrollment: Enrollment) => enrollment.status === 'completed');
  const placeholderImage = "/placeholder.svg";

  return (
    <TouristLayout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col items-start mb-8">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-gray-500 mt-2">Manage and track your educational journey</p>
        </div>

        <Tabs defaultValue="enrolled" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="enrolled" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              In Progress
              {enrolledCourses.length > 0 && (
                <Badge className="ml-2 bg-eco-100 text-eco-800 hover:bg-eco-100">{enrolledCourses.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
              {completedCourses.length > 0 && (
                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">{completedCourses.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="space-y-6">
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No courses in progress</h3>
                <p className="mt-2 text-gray-500">You haven't enrolled in any courses yet.</p>
                <Button 
                  className="mt-4 bg-eco-600 hover:bg-eco-700"
                  onClick={() => navigate('/courses')}
                >
                  Browse Courses
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((enrollment: Enrollment) => (
                  <Card key={enrollment.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={enrollment.course.image || placeholderImage}
                        alt={enrollment.course.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{enrollment.course.title}</CardTitle>
                        <Badge variant="outline" className="bg-eco-50 text-eco-700 border-eco-200">
                          <Clock className="w-3 h-3 mr-1" /> In Progress
                        </Badge>
                      </div>
                      {enrollment.course.duration && (
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>Duration: {enrollment.course.duration}</span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 text-sm line-clamp-2">{enrollment.course.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Enrolled on: {format(new Date(enrollment.createdAt), 'PP')}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2 flex flex-col space-y-2 mt-auto">
                      <Button 
                        className="w-full bg-eco-600 hover:bg-eco-700"
                        onClick={() => handleStartCourse(enrollment)}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Learning
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                      >
                        View Course <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => handleComplete(enrollment.id)}
                        disabled={!!completingId}
                      >
                        {completingId === enrollment.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Marking as Complete...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Complete
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedCourses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No completed courses</h3>
                <p className="mt-2 text-gray-500">You haven't completed any courses yet.</p>
                {enrolledCourses.length > 0 && (
                  <Button 
                    className="mt-4 bg-eco-600 hover:bg-eco-700"
                    onClick={() => setActiveTab("enrolled")}
                  >
                    View In-Progress Courses
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((enrollment: Enrollment) => (
                  <Card key={enrollment.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={enrollment.course.image || placeholderImage}
                        alt={enrollment.course.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{enrollment.course.title}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" /> Completed
                        </Badge>
                      </div>
                      {enrollment.course.duration && (
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>Duration: {enrollment.course.duration}</span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 text-sm line-clamp-2">{enrollment.course.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Completed on: {enrollment.completedAt ? format(new Date(enrollment.completedAt), 'PP') : 'N/A'}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                      >
                        View Course <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Alert className="mt-8 bg-slate-50">
          <AlertDescription className="text-sm text-gray-600">
            Mark a course as complete when you have finished all the lessons. This will help you keep track of your learning progress.
          </AlertDescription>
        </Alert>
      </div>
    </TouristLayout>
  );
};

export default MyCourses;
