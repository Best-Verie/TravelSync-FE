
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  List,
  Loader2, 
  PlayCircle,
  Video
} from "lucide-react";
import TouristLayout from "@/components/layout/TouristLayout";

// Mock lessons data - in a real app, this would come from the API
const generateLessons = (courseTitle: string) => {
  return [
    {
      id: "1",
      title: `Introduction to ${courseTitle}`,
      type: "video",
      duration: "10 minutes",
      content: `
        <div class="prose max-w-none">
          <h2>Welcome to ${courseTitle}</h2>
          <p>This introductory lesson will guide you through what to expect in this course.</p>
          <p>Rwanda's tourism sector is growing rapidly, and this course will help you understand how to make the most of the opportunities in this exciting field.</p>
          <div class="aspect-video mt-6 mb-6 bg-gray-100 flex items-center justify-center rounded-lg">
            <div class="text-center">
              <Video className="mx-auto h-12 w-12 text-gray-400" />
              <p class="mt-2 text-gray-500">Video placeholder - In a complete implementation, a real video would be embedded here.</p>
            </div>
          </div>
          <p>By the end of this course, you will have the knowledge and skills to contribute effectively to Rwanda's tourism industry.</p>
        </div>
      `
    },
    {
      id: "2",
      title: "Key Concepts & Fundamentals",
      type: "text",
      duration: "15 minutes",
      content: `
        <div class="prose max-w-none">
          <h2>Understanding the Core Principles</h2>
          <p>In this lesson, we'll explore the fundamental concepts that form the foundation of this subject.</p>
          <h3>Why Rwanda is a Unique Tourism Destination</h3>
          <p>Rwanda offers a diverse range of tourism experiences, from mountain gorilla trekking to cultural immersion. The country's commitment to conservation and sustainable tourism makes it a model for eco-tourism in Africa.</p>
          <h3>Key Tourism Sectors in Rwanda</h3>
          <ul>
            <li>Wildlife conservation and nature-based tourism</li>
            <li>Cultural heritage and community-based tourism</li>
            <li>MICE (Meetings, Incentives, Conferences & Events) tourism</li>
            <li>Adventure tourism</li>
          </ul>
          <p>Each of these sectors presents unique opportunities and challenges that we'll explore throughout this course.</p>
        </div>
      `
    },
    {
      id: "3",
      title: "Practical Application",
      type: "text",
      duration: "20 minutes",
      content: `
        <div class="prose max-w-none">
          <h2>Putting Knowledge into Practice</h2>
          <p>Now that we've covered the fundamentals, let's look at how to apply these concepts in real-world situations.</p>
          <h3>Case Study: Successful Tourism Initiatives in Rwanda</h3>
          <p>The Volcanoes National Park gorilla conservation program has successfully balanced tourism revenue generation with wildlife protection. By limiting visitor numbers and charging premium rates, the park generates significant income while minimizing impact on gorilla families.</p>
          <h3>Exercise</h3>
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
            <p class="font-semibold">Think about a tourism experience you've had or would like to create:</p>
            <ol>
              <li>What makes it unique to Rwanda?</li>
              <li>How does it benefit local communities?</li>
              <li>How would you ensure it's environmentally sustainable?</li>
              <li>What target market would be most interested in this experience?</li>
            </ol>
            <p class="mt-2 text-gray-600">Reflect on these questions as you continue through the course.</p>
          </div>
        </div>
      `
    },
    {
      id: "4",
      title: "Next Steps & Resources",
      type: "text",
      duration: "10 minutes",
      content: `
        <div class="prose max-w-none">
          <h2>Continuing Your Learning Journey</h2>
          <p>As you complete this course, here are some resources to help you continue developing your knowledge and skills.</p>
          <h3>Recommended Further Reading</h3>
          <ul>
            <li>Rwanda Development Board Tourism Guidelines</li>
            <li>Sustainable Tourism Best Practices in East Africa</li>
            <li>Cultural Tourism Development Handbook</li>
          </ul>
          <h3>Next Steps</h3>
          <p>After completing this course, consider:</p>
          <ul>
            <li>Applying for internship opportunities with local tourism providers</li>
            <li>Joining the Rwanda Tour Guides Association</li>
            <li>Taking advanced courses in specific areas of tourism</li>
          </ul>
          <p>Congratulations on completing this course! You now have a strong foundation in tourism principles that you can build upon as you develop your career in Rwanda's growing tourism industry.</p>
        </div>
      `
    }
  ];
};

const CourseContent = () => {
  const { courseId, enrollmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesApi.getById(courseId || ''),
    enabled: !!courseId,
  });

  // In a real application, we would fetch the actual lessons from the API
  // For demonstration, we'll generate mock lessons based on the course title
  const lessons = course ? generateLessons(course.title) : [];
  const currentLesson = lessons[currentLessonIndex];
  
  // Calculate progress
  const progress = ((currentLessonIndex + 1) / lessons.length) * 100;

  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      // In a real application, you'd save progress to the backend here
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleSelectLesson = (index: number) => {
    setCurrentLessonIndex(index);
    // On mobile, close sidebar after selecting a lesson
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
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

  return (
    <TouristLayout>
      <div className="container px-4 md:px-0 py-4">
        {/* Course Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button 
              variant="ghost" 
              className="mb-2 p-0 h-auto hover:bg-transparent" 
              onClick={() => navigate(`/courses/${courseId}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Back to Course</span>
            </Button>
            <h1 className="text-2xl font-bold">{course.title}</h1>
          </div>
          <Button 
            variant="outline" 
            className="md:hidden" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <List className="h-4 w-4 mr-2" />
            Lessons
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Course Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar - Course Outline */}
          <aside className={`md:col-span-3 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
            <Card>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-5 w-5 mr-2 text-eco-600" />
                  <h2 className="text-lg font-semibold">Course Content</h2>
                </div>
                <nav className="space-y-1">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                        index === currentLessonIndex
                          ? 'bg-eco-50 text-eco-700 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectLesson(index)}
                    >
                      <div className="flex items-center">
                        {lesson.type === 'video' ? (
                          <PlayCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      {index < currentLessonIndex && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </Card>
          </aside>

          {/* Main Lesson Content */}
          <main className="md:col-span-9">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-1">{currentLesson.title}</h2>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  {currentLesson.type === 'video' ? (
                    <PlayCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <FileText className="h-4 w-4 mr-1" />
                  )}
                  <span>{currentLesson.type} • {currentLesson.duration}</span>
                </div>
                
                <Separator className="mb-6" />
                
                <div 
                  className="lesson-content"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={goToPreviousLesson}
                    disabled={currentLessonIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>
                  
                  <Button
                    onClick={goToNextLesson}
                    disabled={currentLessonIndex === lessons.length - 1}
                    className="bg-eco-600 hover:bg-eco-700"
                  >
                    Next Lesson
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </TouristLayout>
  );
};

export default CourseContent;
