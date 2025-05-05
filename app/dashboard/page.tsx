"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  CalendarRange,
  Users2,
  LoaderCircle,
  MoreVertical,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AnimatedSection from "@/components/AnimatedSection";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Project } from "@prisma/client";

export default function DashboardPage() {
  const navigate = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectClick = (id: string) => {
    console.log("navigating now ", id);
    navigate.push(`/dashboard/project/${id}`);
  };

  const handleProjectDelete = async(id: string)=>{
    await axios.delete(`/api/project/${id}/delete`)
    fetchProjects()
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Project[]>("/api/project");
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.log("error fetching projects", error);
    }
  };

  const handleCreateProject = async () => {
    const data = {
      title: newProjectTitle,
      description: newProjectDescription,
    };

    try {
      const response = await axios.post<Project>("/api/project/create", data);
      setProjects([...projects, response.data]);
    } catch (error) {
      console.log(error);
    }

    setShowCreateProjectDialog(false);
    setNewProjectDescription("");
    setNewProjectTitle("");
  };

  return (
    <div className="container mx-auto p-6">
      <AnimatedSection>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your projects in one place
            </p>
          </div>

          <Dialog
            open={showCreateProjectDialog}
            onOpenChange={setShowCreateProjectDialog}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add the project details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="project-desc">Project Name</Label>
                  <Input
                    id="project-desc"
                    placeholder="Enter project description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateProjectDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!newProjectTitle || !newProjectDescription}
                >
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          filteredProjects.map((project, index) => (
            <AnimatedSection key={index} delay={0.1 * (index + 1)}>
              <Card
                className="h-full hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"  onClick={(e) =>{
                        handleProjectDelete(project.id)
                        e.stopPropagation(); 
                        }}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
 
              </Card>
            </AnimatedSection>
          ))}
      </div>
      {loading && (
        <div className="flex items-center justify-center mt-8">
          <LoaderCircle className="animate-spin h-12 w-12 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
