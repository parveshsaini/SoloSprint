'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  CalendarRange, 
  Users2, 
  MoreVertical,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import AnimatedSection from '@/components/AnimatedSection';

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A comprehensive e-commerce solution with payment integration",
    members: 5,
    sprints: 3,
    lastUpdated: "2023-04-01T10:00:00Z"
  },
  {
    id: "2",
    name: "Mobile App Redesign",
    description: "UI/UX overhaul of our flagship mobile application",
    members: 3,
    sprints: 2,
    lastUpdated: "2023-03-28T14:30:00Z"
  },
  {
    id: "3",
    name: "CRM System",
    description: "Customer relationship management system for sales team",
    members: 4,
    sprints: 1,
    lastUpdated: "2023-04-02T09:15:00Z"
  },
  {
    id: "4",
    name: "API Modernization",
    description: "Modernize legacy APIs with RESTful architecture",
    members: 2,
    sprints: 4,
    lastUpdated: "2023-03-25T11:20:00Z"
  }
];

export default function DashboardPage() {
  const navigate = useRouter();
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectClick = (id: string) => {
    navigate.push(`/dashboard/project/${id}`);
  };

  const handleCreateProject = () => {
    // For demo purposes, we'll just add a new project to the list
    const newProject = {
      id: (projects.length + 1).toString(),
      name: `New Project ${projects.length + 1}`,
      description: "A fresh project ready for your ideas",
      members: 1,
      sprints: 0,
      lastUpdated: new Date().toISOString()
    };
    
    setProjects([...projects, newProject]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
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
          <Button onClick={handleCreateProject} className="gap-2">
            <Plus size={16} />
            Create Project
          </Button>
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
        {filteredProjects.map((project, index) => (
          <AnimatedSection key={project.id} delay={0.1 * (index + 1)}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleProjectClick(project.id)}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users2 className="h-4 w-4 text-muted-foreground" />
                    <span>{project.members} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarRange className="h-4 w-4 text-muted-foreground" />
                    <span>{project.sprints} sprints</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Updated on {formatDate(project.lastUpdated)}
              </CardFooter>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}