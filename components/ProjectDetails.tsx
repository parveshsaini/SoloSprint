"use client";

import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarComponent,
} from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";
import AnimatedSection from "./AnimatedSection";
import { Project, Sprint } from "@prisma/client";
import { Badge } from "./ui/badge";
import axios from "axios";

export type ProjectWithSprints = Project & {
  sprints: Sprint[];
};

export default function ProjectDetails({
  project,
}: {
  project: ProjectWithSprints;
}) {
  const [showCreateSprintDialog, setShowCreateSprintDialog] = useState(false);
  const [newSprintName, setNewSprintName] = useState("");
  const [newSprintStartingThoughts, setNewSprintStartingThoughts] = useState("");
  const [newSprintStartDate, setNewSprintStartDate] = useState<
    Date | undefined
  >(new Date());
  const [newSprintEndDate, setNewSprintEndDate] = useState<Date | undefined>(
    new Date()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "default";
      case "Planned":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleCreateSprint = async () => {
    const data = {
      title: newSprintName,
      startDate: newSprintStartDate,
      endDate: newSprintEndDate,
      projectId: project.id,
      startingThoughts: newSprintStartingThoughts
    }
    console.log('sending data')
    const response = await axios.post<Sprint>('/api/sprint/create', data)
    console.log('got data', response)
    project.sprints.push(response.data);

    setShowCreateSprintDialog(false);
    setNewSprintName("");
    setNewSprintStartDate(new Date());
    setNewSprintEndDate(new Date());
    setNewSprintStartingThoughts("");
  };

  return (
    <div className="container mx-auto p-6">
      <AnimatedSection>
        <Link href="/dashboard">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground max-w-3xl">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>3 members</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {/* <Calendar className="h-4 w-4 text-muted-foreground" /> */}
              <span>Created {formatDate(project.createdAt.toString())}</span>
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
          <Dialog
            open={showCreateSprintDialog}
            onOpenChange={setShowCreateSprintDialog}
          >
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
                  Add a new sprint to your project. Enter the sprint details
                  below.
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
                <div className="space-y-2">
                  <Label htmlFor="start">Starting thoughts</Label>
                  <Input
                    id="start"
                    placeholder="What are your thoughts before starting"
                    value={newSprintStartingThoughts}
                    onChange={(e) => setNewSprintStartingThoughts(e.target.value)}
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
                <Button
                  variant="outline"
                  onClick={() => setShowCreateSprintDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSprint}
                  disabled={
                    !newSprintName || !newSprintStartDate || !newSprintEndDate
                  }
                >
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
                      <CardTitle className="text-xl">{sprint.title}</CardTitle>
                      <CardDescription>
                        {formatDate(sprint.startDate.toString())} -{" "}
                        {formatDate(sprint.endDate.toString())}
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
                      {Math.floor(
                        (new Date(sprint.endDate).getTime() -
                          new Date(sprint.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days duration
                    </div>
                    <Link
                      href={`/dashboard/project/${project.id}/sprint/${sprint.id}`}
                    >
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
