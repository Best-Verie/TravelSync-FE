
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, User, Users, Receipt, Info, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProviderLayout from "@/components/layout/ProviderLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderBookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch booking details
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsApi.getById(id as string),
    enabled: !!id,
  });

  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => {
      return bookingsApi.update(id as string, { status });
    },
    onSuccess: () => {
      toast.success("Booking status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
    },
    onError: (err: any) => {
      console.error("Error updating booking status:", err);
      toast.error(err.response?.data?.message || "Failed to update booking status");
    },
  });

  // Check if the provider has access to this booking
  useEffect(() => {
    if (booking && user && !user.isAdmin) {
      // If the booking's experience host is not the current user, redirect
      if (booking.experience?.hostId !== user.id) {
        toast.error("You do not have permission to view this booking");
        navigate("/guide/bookings");
      }
    }
  }, [booking, user, navigate]);

  // Handle status update
  const handleStatusUpdate = (newStatus: string) => {
    if (newStatus === "cancelled") {
      setCancelDialogOpen(true);
    } else {
      updateStatusMutation.mutate(newStatus);
    }
  };

  // Handle cancellation confirmation
  const confirmCancellation = () => {
    updateStatusMutation.mutate("cancelled");
    setCancelDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (err) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <ProviderLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-40" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </ProviderLayout>
    );
  }

  if (error) {
    return (
      <ProviderLayout>
        <div className="space-y-4">
          <Button variant="outline" onClick={() => navigate("/guide/bookings")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-medium mb-2">Failed to load booking details</h2>
                <p className="text-muted-foreground">
                  {error instanceof Error ? error.message : "An error occurred. Please try again."}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["booking", id] })}>
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ProviderLayout>
    );
  }

  if (!booking) {
    return (
      <ProviderLayout>
        <div className="space-y-4">
          <Button variant="outline" onClick={() => navigate("/guide/bookings")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-lg font-medium mb-2">Booking Not Found</h2>
                <p className="text-muted-foreground">
                  The booking you're looking for could not be found
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProviderLayout>
    );
  }

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button variant="outline" onClick={() => navigate("/guide/bookings")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
          </Button>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Booking Reference:</p>
            <p className="text-sm font-mono font-medium">{booking.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b bg-muted/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle>{booking.experience?.title}</CardTitle>
                {booking.experience?.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {booking.experience.location}
                  </div>
                )}
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            {/* Customer Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {booking.user?.firstName} {booking.user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{booking.user?.email}</p>
                  </div>
                </div>
                {booking.user?.phone && (
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{booking.user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Booking Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.experience?.duration} hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.participants} {booking.participants === 1 ? "person" : "people"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Total Amount</p>
                    <p className="text-sm text-muted-foreground">
                      ${booking.totalAmount?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-4">Additional Notes</h3>
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="border-t bg-muted/30 flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Update Status</p>
              <Select
                value={booking.status}
                onValueChange={handleStatusUpdate}
                disabled={updateStatusMutation.isPending}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate(`/booking/${booking.id}`)}
                className="flex-1 sm:flex-initial"
              >
                View Public Page
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              No, Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              disabled={updateStatusMutation.isPending}
            >
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProviderLayout>
  );
};

export default ProviderBookingDetail;
