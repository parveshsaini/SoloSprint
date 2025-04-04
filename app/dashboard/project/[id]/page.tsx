"use client"
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  Users, 
  Plus,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AnimatedSection from '@/components/AnimatedSection';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock data for project details
const mockProjects = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A comprehensive e-commerce solution with payment integration and inventory management. The platform includes customer-facing storefront, admin dashboard, and reporting tools.",
    members: 5,
    sprints: [
      { id: "101", name: "UI Design", startDate: "2023-04-01", endDate: "2023-04-14", status: "Completed" },
      { id: "102", name: "Backend Development", startDate: "2023-04-15", endDate: "2023-04-28", status: "In Progress" },
      { id: "103", name: "Payment Integration", startDate: "2023-04-29", endDate: "2023-05-12", status: "Planned" }
    ],
    createdAt: "2023-03-15T10:00:00Z",
    lastUpdated: "2023-04-01T10:00:00Z"
  },
  {
    id: "2",
    name: "Mobile App Redesign",
    description: "UI/UX overhaul of our flagship mobile application with focus on improved user experience and modern design language.",
    members: 3,
    sprints: [
      { id: "201", name: "Research & Planning", startDate: "2023-03-20", endDate: "2023-03-27", status: "Completed" },
      { id: "202", name: "Design Implementation", startDate: "2023-03-28", endDate: "2023-04-10", status: "In Progress" }
    ],
    createdAt: "2023-03-10T14:30:00Z",
    lastUpdated: "2023-03-28T14:30:00Z"
  },
  {
    id: "3",
    name: "CRM System",
    description: "Customer relationship management system for sales team to track leads, opportunities, and customer interactions.",
    members: 4,
    sprints: [
      { id: "301", name: "Initial Setup", startDate: "2023-04-03", endDate: "2023-04-17", status: "In Progress" }
    ],
    createdAt: "2023-03-25T09:15:00Z",
    lastUpdated: "2023-04-02T09:15:00Z"
  },
  {
    id: "4",
    name: "API Modernization",
    description: "Modernize legacy APIs with RESTful architecture, improve documentation, and enhance security features.",
    members: 2,
    sprints: [
      { id: "401", name: "Documentation", startDate: "2023-03-15", endDate: "2023-03-22", status: "Completed" },
      { id: "402", name: "Authentication Refactor", startDate: "2023-03-23", endDate: "2023-03-30", status: "Completed" },
      { id: "403", name: "Endpoint Redesign", startDate: "2023-03-31", endDate: "2023-04-07", status: "In Progress" },
      { id: "404", name: "Performance Optimization", startDate: "2023-04-08", endDate: "2023-04-15", status: "Planned" }
    ],
    createdAt: "2023-03-01T11:20:00Z",
    lastUpdated: "2023-03-25T11:20:00Z"
  }
];

export default function ProjectDetailsPage({params}: {params: {id: string}}) {

  const projectId = params.id;

  const project = mockProjects.find(p => p.id === projectId);
  
  const [showCreateSprintDialog, setShowCreateSprintDialog] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintStartDate, setNewSprintStartDate] = useState<Date | undefined>(new Date());
  const [newSprintEndDate, setNewSprintEndDate] = useState<Date | undefined>(new Date());
  
  if (!project) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link href={'/dashboard'}>
        <Button variant="outline" >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleCreateSprint = () => {
    // Would handle sprint creation in a real app
    // For demo purposes, we'll just close the dialog
    setShowCreateSprintDialog(false);
    setNewSprintName('');
    setNewSprintStartDate(new Date());
    setNewSprintEndDate(new Date());
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'default';
      case 'Planned':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <AnimatedSection>
        <Link href="/dashboard" >
        <Button 
          variant="outline" 
          className="mb-6" 
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-muted-foreground max-w-3xl">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{project.members} members</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Separator className="my-6" />
      
      <AnimatedSection delay={0.1}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Sprints</h2>
            <p className="text-muted-foreground">
              Manage project sprints and track progress
            </p>
          </div>
          <Dialog open={showCreateSprintDialog} onOpenChange={setShowCreateSprintDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Create Sprint
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Sprint</DialogTitle>
                <DialogDescription>
                  Add a new sprint to your project. Enter the sprint details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="sprint-name">Sprint Name</Label>
                  <Input 
                    id="sprint-name" 
                    placeholder="Enter sprint name" 
                    value={newSprintName}
                    onChange={(e) => setNewSprintName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newSprintStartDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {newSprintStartDate ? (
                            format(newSprintStartDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={newSprintStartDate}
                          onSelect={setNewSprintStartDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newSprintEndDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {newSprintEndDate ? (
                            format(newSprintEndDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={newSprintEndDate}
                          onSelect={setNewSprintEndDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateSprintDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSprint} disabled={!newSprintName || !newSprintStartDate || !newSprintEndDate}>
                  Create Sprint
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedSection>

      <div className="space-y-4">
        {project.sprints.length > 0 ? (
          project.sprints.map((sprint, index) => (
            <AnimatedSection key={sprint.id} delay={0.1 * (index + 1)}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{sprint.name}</CardTitle>
                      <CardDescription>
                        {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                      </CardDescription>
                    </div>
                    <Badge variant={getBadgeVariant(sprint.status) as any}>
                      {sprint.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {/* Days calculation would be more precise in a real app */}
                      {Math.floor((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24))} days duration
                    </div>
                    <Link href={`/dashboard/project/${projectId}/sprint/${sprint.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))
        ) : (
          <AnimatedSection delay={0.1}>
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <p className="text-muted-foreground mb-4 text-center">
                  No sprints have been created for this project yet.
                </p>
                <Button onClick={() => setShowCreateSprintDialog(true)}>
                  Create Your First Sprint
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}