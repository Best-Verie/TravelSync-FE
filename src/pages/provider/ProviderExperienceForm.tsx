
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { experiencesApi } from "@/lib/api";
import ProviderLayout from "@/components/layout/ProviderLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  duration: z.coerce.number().positive({ message: "Duration must be a positive number" }),
  maxParticipants: z.coerce.number().int().positive({ message: "Max participants must be a positive number" }),
  category: z.string().min(1, { message: "Category is required" }),
  images: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  "Wildlife Conservation",
  "Sustainable Tourism",
  "Cultural Experience",
  "Ecotourism",
  "Agricultural Experience",
  "Nature Walk",
  "Environmental Education",
  "Community Service",
  "Marine Conservation",
];

const ProviderExperienceForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!id;
  
  // Fetch experience data if in edit mode
  const { data: existingExperience, isLoading: isLoadingExperience } = useQuery({
    queryKey: ['experience', id],
    queryFn: () => id ? experiencesApi.getById(id) : null,
    enabled: isEditMode,
  });
  
  // Default form values
  const defaultValues: FormValues = {
    title: "",
    description: "",
    location: "",
    price: 0,
    duration: 1,
    maxParticipants: 10,
    category: "",
    images: ["https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop"],
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Set form values when editing an existing experience
  useEffect(() => {
    if (isEditMode && existingExperience) {
      form.reset({
        title: existingExperience.title,
        description: existingExperience.description,
        location: existingExperience.location,
        price: existingExperience.price,
        duration: existingExperience.duration,
        maxParticipants: existingExperience.maxParticipants,
        category: existingExperience.category,
        images: existingExperience.images || defaultValues.images,
      });
    }
  }, [existingExperience, form, isEditMode]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => experiencesApi.create(data),
    onSuccess: () => {
      toast.success("Experience created successfully!");
      queryClient.invalidateQueries({ queryKey: ['provider-experiences'] });
      navigate("/guide/experiences");
    },
    onError: (error: any) => {
      console.error("Error creating experience:", error);
      toast.error(error.response?.data?.message || "Failed to create experience");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => experiencesApi.update(id, data),
    onSuccess: () => {
      toast.success("Experience updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['provider-experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experience', id] });
      navigate("/guide/experiences");
    },
    onError: (error: any) => {
      console.error("Error updating experience:", error);
      toast.error(error.response?.data?.message || "Failed to update experience");
    },
  });
  
  const onSubmit = (values: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create an experience");
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data for API
    const experienceData = {
      ...values,
      hostId: user.id,
    };
    
    try {
      if (isEditMode && id) {
        updateMutation.mutate({ id, data: experienceData });
      } else {
        createMutation.mutate(experienceData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoadingExperience) {
    return (
      <ProviderLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
        </div>
      </ProviderLayout>
    );
  }

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditMode ? "Edit Experience" : "Create New Experience"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? "Update your existing experience with new details" 
              : "Create a new eco-tourism experience to share with visitors"}
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Wildlife Conservation Safari" {...field} />
                    </FormControl>
                    <FormDescription>
                      A catchy title that describes your experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category that best describes your experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your experience in detail..." 
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the experience, what visitors will do, see, and learn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Nyungwe National Park" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where the experience takes place
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Cost per person
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0.5" step="0.5" {...field} />
                    </FormControl>
                    <FormDescription>
                      Length of the experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Participants</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="50" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum number of people allowed per booking
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Image upload would go here - simplified for now */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">
                        Image upload feature coming soon. Currently using default image.
                      </p>
                      {field.value[0] && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Current image:</p>
                          <img 
                            src={field.value[0]} 
                            alt="Experience preview" 
                            className="w-full h-40 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload images showcasing your experience
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/guide/experiences")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-eco-600 hover:bg-eco-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditMode ? "Update Experience" : "Create Experience"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ProviderLayout>
  );
};

export default ProviderExperienceForm;
