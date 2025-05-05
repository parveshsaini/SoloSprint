'use client';

import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Loader2, ExternalLink, Trash } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedSection from '@/components/AnimatedSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define types based on Prisma schema
interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  sprintId: string;
  ownerEmail: string;
  startedAt?: Date | null;
  finishedAt?: Date | null;
}

interface Sprint {
  id: string;
  title: string;
  projectId: string;
  startingThoughts: string;
  endingThoughts?: string | null;
  status: string;
  ownerEmail: string;
  startDate: Date;
  endDate: Date;
  project: {
    title: string;
  };
}

interface ColumnTasks {
  [key: string]: Task[];
}

// Define drag item types
const ItemTypes = {
  TASK: 'task'
};

interface DragItem {
  type: string;
  id: string;
  columnId: string;
  index: number;
  task: Task;
}

// Function to format description with rich text capabilities
const RichTextDescription = ({ text }: { text: string | null | undefined }) => {
  if (!text) return null;
  
  // Convert URLs to clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return (
    <div className="rich-text-content whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a 
              key={i} 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              {part}
              <ExternalLink className="h-3 w-3" />
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </div>
  );
};

// Task Item Component
interface TaskItemProps {
  task: Task;
  index: number;
  columnId: string;
  moveTask: (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string, task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, columnId, moveTask, onDeleteTask }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { type: ItemTypes.TASK, id: task.id, columnId, index, task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.TASK,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceColumnId = item.columnId;
      const targetColumnId = columnId;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceColumnId === targetColumnId) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0;
      
      // Only perform the move when the mouse has crossed half of the item's height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      moveTask(dragIndex, hoverIndex, sourceColumnId, targetColumnId, item.task);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.columnId = targetColumnId;
    },
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/task/${task.id}/delete`);
      onDeleteTask(task.id);
      toast.success("Task deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`mb-3 p-3 bg-white dark:bg-gray-800 rounded-md border ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isDragging ? 'shadow-lg ring-2 ring-primary/30' : 'shadow-sm'} cursor-grab`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{task.title}</span>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1 cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className= "cursor-pointer" onClick={() => setIsViewDialogOpen(true)}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600 dark:text-red-400 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
   
      <div className="flex items-center mt-2">
        <span className="text-xs text-muted-foreground capitalize">
          {task.startedAt && !task.finishedAt ? 'Started: ' + new Date(task.startedAt).toLocaleDateString() : ''}
          {task.finishedAt ? 'Completed: ' + new Date(task.finishedAt).toLocaleDateString() : ''}
        </span>
      </div>

      {/* View Task Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <p className="font-medium">{task.status}</p>
            </div>
            
            {task.description && (
              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <div className="mt-1 text-sm">
                  <RichTextDescription text={task.description} />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {task.startedAt && (
                <div>
                  <Label className="text-sm text-muted-foreground">Started</Label>
                  <p>{new Date(task.startedAt).toLocaleDateString()}</p>
                </div>
              )}
              
              {task.finishedAt && (
                <div>
                  <Label className="text-sm text-muted-foreground">Completed</Label>
                  <p>{new Date(task.finishedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Column Component
interface ColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  moveTask: (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string, task: Task) => void;
  sprintId: string;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ columnId, title, tasks, moveTask, sprintId, onDeleteTask }) => {
  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.TASK,
    // When dropping on empty column area
    drop: (item) => {
      if (item.columnId !== columnId) {
        // Move to end of this column
        moveTask(item.index, tasks.length, item.columnId, columnId, item.task);
        return { moved: true };
      }
      return undefined;
    },
  });

  return (
    <AnimatedSection delay={0.1 * ['todo', 'in-progress', 'done'].indexOf(columnId)}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{title}</CardTitle>
            <span className="text-muted-foreground text-sm font-normal">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {/* @ts-ignore */}
          <div ref={drop} className="min-h-[300px]">
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                columnId={columnId}
                moveTask={moveTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
};

// Main Client Component
interface SprintBoardClientProps {
  sprint: Sprint;
  tasks: ColumnTasks;
  projectId: string;
}

const SprintBoardClient: React.FC<SprintBoardClientProps> = ({ sprint, tasks: initialTasks, projectId }) => {
  const [tasks, setTasks] = useState<ColumnTasks>(initialTasks);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open dialog to add task - always to Todo by default
  const openAddTaskDialog = () => {
    setIsAddTaskDialogOpen(true);
  };

  // Move task between columns or within a column
  const moveTask = async (
    dragIndex: number,
    hoverIndex: number,
    sourceColumnId: string,
    targetColumnId: string,
    task: Task
  ) => {
    // Clone the tasks object
    const newTasks = { ...tasks };

    // Get the task being dragged
    const draggedTask = newTasks[sourceColumnId][dragIndex];

    // Remove the task from the source column
    newTasks[sourceColumnId].splice(dragIndex, 1);

    // Add the task to the target column
    newTasks[targetColumnId].splice(hoverIndex, 0, draggedTask);

    // Update state
    setTasks(newTasks);

    // If moved to a different column, update the task status in the database
    if (sourceColumnId !== targetColumnId) {
      const newStatus = targetColumnId === 'todo' 
        ? 'TODO' 
        : targetColumnId === 'in-progress' 
        ? 'IN_PROGRESS' 
        : 'DONE';
      
      try {
        // Update task status via API
        const response = await axios.patch(`/api/task/${task.id}/edit`, {
            taskId: task.id,
            status: newStatus,
            startedAt: newStatus === 'IN_PROGRESS' && !task.startedAt ? new Date() : task.startedAt,
            finishedAt: newStatus === 'DONE' && !task.finishedAt ? new Date() : task.finishedAt,
          }
        );

        if (response.data) {
          toast.success(`Task moved to ${getColumnTitle(targetColumnId)}`);
        } else {
          // Revert the UI if the API call fails
          setTasks({ ...tasks });
          toast.error('Failed to update task status');
        }
      } catch (error) {
        // Revert the UI if the API call fails
        setTasks({ ...tasks });
        toast.error('Error updating task status');
      }
    }
  };

  const getColumnTitle = (key: string): string => {
    switch(key) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'done': return 'Done';
      default: return key;
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/task/create', {
        title: newTaskTitle,
        description: newTaskDescription || null,
        sprintId: sprint.id,
        status: 'TODO', // Always add to TODO by default
      });

      if (response.data) {
        const newTask = await response.data;
        
        // Update local state with the new task
        const updatedTasks = { ...tasks };
        updatedTasks['todo'] = [...updatedTasks['todo'], newTask];
        setTasks(updatedTasks);
        
        // Close dialog and reset form
        setIsAddTaskDialogOpen(false);
        setNewTaskTitle('');
        setNewTaskDescription('');
        toast.success('Task added successfully');
      } else {
        toast.error('Failed to add task');
      }
    } catch (error) {
      toast.error('Error adding task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    // Update state to remove the deleted task
    const updatedTasks = { ...tasks };
    
    // Find which column contains the task and remove it
    Object.keys(updatedTasks).forEach(columnId => {
      const taskIndex = updatedTasks[columnId].findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        updatedTasks[columnId].splice(taskIndex, 1);
      }
    });
    
    setTasks(updatedTasks);
  };

  return (
    <div className="container mx-auto p-6">
      <AnimatedSection>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{sprint.title}</h1>
            <Button onClick={openAddTaskDialog} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
          <p className="text-muted-foreground">
            Project: {sprint.project.title} • Sprint: {sprint.id}
          </p>
          {sprint.startingThoughts && (
            <div className="mt-4 p-4 bg-muted/50 rounded-md">
              <h3 className="text-sm font-medium mb-1">Sprint Goals</h3>
              <p className="text-sm">{sprint.startingThoughts}</p>
            </div>
          )}
        </div>
      </AnimatedSection>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Column
              key={columnId}
              columnId={columnId}
              title={getColumnTitle(columnId)}
              tasks={columnTasks}
              moveTask={moveTask}
              sprintId={sprint.id}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DndProvider>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Textarea
                id="task-description"
                placeholder="Enter task description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddTaskDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTask} disabled={isSubmitting || !newTaskTitle.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Task'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SprintBoardClient;