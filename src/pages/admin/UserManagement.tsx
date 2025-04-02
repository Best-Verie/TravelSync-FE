
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Edit, Trash2, Loader2, Users, Check, X, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usersApi, experiencesApi, bookingsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  isAdmin: boolean;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Experience {
  id: string;
  title: string;
  location: string;
  price: number;
  hostId: string;
  createdAt: string;
}

interface Booking {
  id: string;
  experienceId: string;
  userId: string;
  date: string;
  totalAmount: number;
  status: string;
  experience: { 
    title: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
}

const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState("all");
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    accountType: "tourist",
    isAdmin: false,
    password: "",
    confirmPassword: "",
    bio: "",
    phone: "",
    status: "active",
  });

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
  });

  // Fetch experiences for selected provider
  const { data: providerExperiences = [], isLoading: isLoadingExperiences } = useQuery({
    queryKey: ["providerExperiences", selectedProviderId],
    queryFn: () => experiencesApi.getAll({ hostId: selectedProviderId }),
    enabled: !!selectedProviderId,
  });

  // Fetch bookings for selected provider
  const { data: providerBookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["providerBookings", selectedProviderId],
    queryFn: () => bookingsApi.getProviderBookings(selectedProviderId!),
    enabled: !!selectedProviderId,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    createUserMutation.mutate({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      accountType: formData.accountType,
      isAdmin: formData.isAdmin,
      bio: formData.bio,
      phone: formData.phone,
      status: formData.status,
    });
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      const updateData: any = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        accountType: formData.accountType,
        isAdmin: formData.isAdmin,
        bio: formData.bio,
        phone: formData.phone,
        status: formData.status,
      };

      // Only include password if it was changed
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }
        updateData.password = formData.password;
      }

      updateUserMutation.mutate({
        id: selectedUser.id,
        data: updateData,
      });
    }
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accountType: user.accountType,
      isAdmin: user.isAdmin,
      password: "",
      confirmPassword: "",
      bio: user.bio || "",
      phone: user.phone || "",
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const handleViewProviderDetails = (providerId: string) => {
    setSelectedProviderId(providerId === selectedProviderId ? null : providerId);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      accountType: "tourist",
      isAdmin: false,
      password: "",
      confirmPassword: "",
      bio: "",
      phone: "",
      status: "active",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3.5 w-3.5 mr-1" />Active</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800"><X className="h-3.5 w-3.5 mr-1" />Suspended</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filter users based on selected role tab
  const filteredUsers = users.filter(user => {
    if (activeRoleTab === "all") return true;
    if (activeRoleTab === "admin") return user.isAdmin;
    return user.accountType === activeRoleTab;
  });

  // Calculate total earnings for a provider
  const calculateTotalEarnings = () => {
    if (!providerBookings || providerBookings.length === 0) return 0;
    return providerBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <Button onClick={handleOpenCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeRoleTab} onValueChange={setActiveRoleTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="guide">Providers</TabsTrigger>
          <TabsTrigger value="tourist">Tourists</TabsTrigger>
        </TabsList>

        <TabsContent value={activeRoleTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeRoleTab === "all" ? "All Users" : 
                 activeRoleTab === "admin" ? "Admin Users" :
                 activeRoleTab === "guide" ? "Service Providers" : "Tourists"}
              </CardTitle>
              <CardDescription>
                {activeRoleTab === "all" ? "Manage all users of the platform." : 
                 activeRoleTab === "admin" ? "Manage platform administrators." :
                    activeRoleTab === "guide" ? "Manage service providers." : "Manage tourists."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No users found</h3>
                  <p className="mt-2">
                    There are no {activeRoleTab !== "all" ? activeRoleTab + " " : ""}users yet.
                  </p>
                  <Button
                    onClick={handleOpenCreateModal}
                    variant="outline"
                    className="mt-4"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                            ) : (
                              <Badge className={user.accountType === "provider" ? 
                                "bg-blue-100 text-blue-800" : 
                                "bg-green-100 text-green-800"
                              }>
                                {user.accountType === "provider" ? "Provider" : "Tourist"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditModal(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDeleteModal(user)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                              {user.accountType === "provider" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewProviderDetails(user.id)}
                                  className={selectedProviderId === user.id ? "bg-gray-100" : ""}
                                >
                                  <MapPin className="h-4 w-4 text-blue-500" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedProviderId && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Provider Details</h2>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingExperiences ? (
                  <div className="flex justify-center items-center h-20">
                    <Loader2 className="h-6 w-6 animate-spin text-eco-600" />
                  </div>
                ) : providerExperiences.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>No experiences registered</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-lg font-bold">{providerExperiences.length}</div>
                    <p className="text-sm text-muted-foreground">Total experiences registered</p>
                    
                    <div className="space-y-2 mt-4">
                      {providerExperiences.slice(0, 5).map((exp: Experience) => (
                        <div key={exp.id} className="flex items-center justify-between border-b pb-2">
                          <span className="text-sm truncate max-w-[200px]">{exp.title}</span>
                          <span className="text-sm font-medium">${exp.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="flex justify-center items-center h-20">
                    <Loader2 className="h-6 w-6 animate-spin text-eco-600" />
                  </div>
                ) : providerBookings.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-lg font-bold">{providerBookings.length}</div>
                    <p className="text-sm text-muted-foreground">Total bookings received</p>
                    
                    <div className="space-y-2 mt-4">
                      {providerBookings.slice(0, 5).map((booking: Booking) => (
                        <div key={booking.id} className="flex items-center justify-between border-b pb-2">
                          <span className="text-sm truncate max-w-[200px]">{booking.experience?.title}</span>
                          <span className="text-sm font-medium">${booking.totalAmount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${calculateTotalEarnings()}</div>
                <p className="text-sm text-muted-foreground">Total revenue generated</p>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span>Completed Bookings</span>
                    <span className="font-medium">
                      {providerBookings.filter(b => b.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Pending Bookings</span>
                    <span className="font-medium">
                      {providerBookings.filter(b => b.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Cancelled Bookings</span>
                    <span className="font-medium">
                      {providerBookings.filter(b => b.status === "cancelled").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-eco-600" />
                </div>
              ) : providerBookings.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>No booking history available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Experience</TableHead>
                        <TableHead>Tourist</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {providerBookings.map((booking: Booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.experience?.title}</TableCell>
                          <TableCell>{booking.user?.firstName} {booking.user?.lastName}</TableCell>
                          <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                          <TableCell>${booking.totalAmount}</TableCell>
                          <TableCell>
                            <Badge className={
                              booking.status === "completed" ? "bg-green-100 text-green-800" : 
                              booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {booking.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Form Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Edit User" : "Create New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {selectedUser ? "New Password (leave blank to keep current)" : "Password"}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="accountType" className="text-sm font-medium">
                  Account Type
                </label>
                <Select 
                  value={formData.accountType}
                  onValueChange={(value) => handleSelectChange("accountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourist">Tourist</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Input
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief bio"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAdmin"
                checked={formData.isAdmin}
                onCheckedChange={(checked) => handleSwitchChange("isAdmin", checked)}
              />
              <label htmlFor="isAdmin" className="text-sm font-medium">
                Admin User
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={selectedUser ? handleUpdateUser : handleCreateUser}
              disabled={
                createUserMutation.isPending || updateUserMutation.isPending
              }
            >
              {(createUserMutation.isPending || updateUserMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectedUser ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedUser?.firstName} {selectedUser?.lastName}</span>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
