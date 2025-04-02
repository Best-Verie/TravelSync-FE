
import { useEffect, useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Requirement = {
  id: string;
  description: string;
  status: "implemented" | "pending" | "inProgress";
};

export const RequirementsTable = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: "FR 1", description: "User Management - Enable the creation and management of user profiles for tourists and youth entrepreneurs.", status: "implemented" },
    { id: "FR 1.1", description: "Register User - Allow tourists and youth entrepreneurs to register with the platform by providing necessary details like name, email, and password.", status: "implemented" },
    { id: "FR 1.2", description: "Login User - Allow users to log in using their credentials.", status: "implemented" },
    { id: "FR 1.3", description: "Update Profile - Allow users to update their profile information (e.g., contact info, payment details).", status: "inProgress" },
    { id: "FR 2", description: "Service Listings - Allow youth entrepreneurs to list and manage their services (e.g., tours, accommodation).", status: "implemented" },
    { id: "FR 2.1", description: "Add Service - Allow youth entrepreneurs to add a new service with details like description, location, availability, and pricing.", status: "implemented" },
    { id: "FR 2.2", description: "Edit Service - Allow youth entrepreneurs to edit existing service details.", status: "implemented" },
    { id: "FR 2.3", description: "Remove Service - Allow youth entrepreneurs to remove a service from the platform.", status: "implemented" },
    { id: "FR 3", description: "Booking System - Allow tourists to book available services and make payments.", status: "inProgress" },
    { id: "FR 3.1", description: "Search Services - Allow tourists to search for services based on categories, location, and other filters.", status: "pending" },
    { id: "FR 3.2", description: "View Service Details - Allow tourists to view detailed information about a service before making a booking.", status: "implemented" },
    { id: "FR 3.3", description: "Complete Booking - Allow tourists to complete a booking by selecting services, entering participant details, and making payments.", status: "inProgress" },
    { id: "FR 3.4", description: "Payment Integration - Integrate with payment gateways (e.g., Stripe, PayPal) to handle payment transactions securely.", status: "inProgress" },
    { id: "FR 4", description: "Notification System - Provide real-time notifications for tourists and youth entrepreneurs.", status: "pending" },
    { id: "FR 5", description: "Review and Rating - Enable tourists to leave reviews and rate services after completing bookings.", status: "pending" },
    { id: "FR 6", description: "Admin Dashboard - Provide an admin dashboard for platform administrators to manage users, services, and bookings.", status: "implemented" },
    { id: "FR 7", description: "Security and Privacy - Ensure that user data is protected and privacy policies are adhered to.", status: "inProgress" },
  ]);

  // Count requirements by status
  const stats = {
    total: requirements.length,
    implemented: requirements.filter(r => r.status === "implemented").length,
    inProgress: requirements.filter(r => r.status === "inProgress").length,
    pending: requirements.filter(r => r.status === "pending").length,
  };

  // TODO: In the future, fetch requirements from API
  // useEffect(() => {
  //   const fetchRequirements = async () => {
  //     try {
  //       const response = await fetch('/api/requirements');
  //       const data = await response.json();
  //       setRequirements(data);
  //     } catch (error) {
  //       console.error('Error fetching requirements:', error);
  //     }
  //   };
  //   fetchRequirements();
  // }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Requirements Status</h1>
        <p className="text-gray-500">Track the implementation status of system requirements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.implemented}</div>
            <p className="text-xs text-gray-500">{Math.round((stats.implemented / stats.total) * 100)}% complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.inProgress}</div>
            <p className="text-xs text-gray-500">{Math.round((stats.inProgress / stats.total) * 100)}% in development</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <p className="text-xs text-gray-500">{Math.round((stats.pending / stats.total) * 100)}% not started</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requirements Status</CardTitle>
          <CardDescription>Overview of all system functional requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Req ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px] text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((requirement) => (
                  <TableRow key={requirement.id}>
                    <TableCell className="font-medium">{requirement.id}</TableCell>
                    <TableCell>{requirement.description}</TableCell>
                    <TableCell className="text-right">
                      {requirement.status === "implemented" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Implemented
                        </Badge>
                      ) : requirement.status === "inProgress" ? (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          In Progress
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                          <X className="h-3.5 w-3.5 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
