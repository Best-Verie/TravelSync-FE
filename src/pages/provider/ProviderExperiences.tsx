
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, MapPin, Plus, Search, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ProviderLayout from "@/components/layout/ProviderLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { experiencesApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderExperiences = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch experiences from the backend
  const { data: experiences = [], isLoading, error } = useQuery({
    queryKey: ['provider-experiences', user?.id],
    queryFn: () => {
      console.log('Fetching experiences for host:', user?.id);
      return experiencesApi.getAll({ hostId: user?.id });
    },
    enabled: !!user?.id,
  });

  console.log('Experiences data:', experiences);

  // Handle experience deletion
  const deleteMutation = useMutation({
    mutationFn: (id: string) => experiencesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-experiences'] });
      toast({
        title: "Experience deleted",
        description: "The experience has been successfully deleted",
      });
      setOpenDeleteDialog(false);
    },
    onError: (error) => {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete the experience. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredExperiences = experiences.filter(exp => 
    exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    exp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const confirmDelete = (experience: any) => {
    setExperienceToDelete(experience);
    setOpenDeleteDialog(true);
  };
  
  const handleDelete = () => {
    if (experienceToDelete?.id) {
      deleteMutation.mutate(experienceToDelete.id);
    }
  };

  if (error) {
    console.error("Error fetching experiences:", error);
  }

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Experiences</h1>
            <p className="text-muted-foreground">Manage your guided tours and experiences</p>
          </div>
          <Button 
            onClick={() => navigate("/guide/experiences/new")}
            className="bg-eco-600 hover:bg-eco-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Experience
          </Button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search experiences..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="bg-gray-50 border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No experiences found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search" : "Start by adding your first experience"}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate("/guide/experiences/new")}
                className="bg-eco-600 hover:bg-eco-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={experience.images?.[0] || '/placeholder.svg'} 
                    alt={experience.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={() => navigate(`/experience/${experience.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={() => navigate(`/guide/experiences/edit/${experience.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={() => confirmDelete(experience)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${experience.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {experience.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {experience.location}
                  </div>
                  <h3 className="font-bold mb-1">{experience.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">${experience.price}</span>
                    <span className="text-sm text-muted-foreground">{experience.duration} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{experience.bookingsCount || 0} bookings</span>
                    <span className="font-medium">{experience.category}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the experience.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProviderLayout>
  );
};

export default ProviderExperiences;
