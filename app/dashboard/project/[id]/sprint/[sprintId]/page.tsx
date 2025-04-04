'use client'

import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedSection from '@/components/AnimatedSection';

// Define types
type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  content: string;
  priority: Priority;
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
}

// Initial task data
const initialTasks: ColumnTasks = {
  'todo': [
    { id: 'task-1', content: 'Create wireframes for dashboard', priority: 'high' },
    { id: 'task-2', content: 'Design user authentication flow', priority: 'medium' },
    { id: 'task-3', content: 'Research competitor features', priority: 'low' },
  ],
  'in-progress': [
    { id: 'task-4', content: 'Implement user profile page', priority: 'high' },
  ],
  'done': [
    { id: 'task-5', content: 'Setup project repository', priority: 'medium' },
    { id: 'task-6', content: 'Define initial requirements', priority: 'high' },
  ]
};

// Task Item Component
interface TaskItemProps {
  task: Task;
  index: number;
  columnId: string;
  moveTask: (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string) => void;
  getPriorityColor: (priority: Priority) => string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, columnId, moveTask, getPriorityColor }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { type: ItemTypes.TASK, id: task.id, columnId, index },
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
      moveTask(dragIndex, hoverIndex, sourceColumnId, targetColumnId);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.columnId = targetColumnId;
    },
  });
  
  drag(drop(ref));
  
  return (
    <div
      ref={ref}
      className={`mb-3 p-3 bg-white dark:bg-gray-800 rounded-md border ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isDragging ? 'shadow-lg ring-2 ring-primary/30' : 'shadow-sm'}`}
      style={{ cursor: 'move' }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{task.content}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center mt-2">
        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} mr-2`}></div>
        <span className="text-xs text-muted-foreground capitalize">{task.priority}</span>
      </div>
    </div>
  );
};

// Column Component
interface ColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  moveTask: (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string) => void;
  getPriorityColor: (priority: Priority) => string;
}

const Column: React.FC<ColumnProps> = ({ columnId, title, tasks, moveTask, getPriorityColor }) => {
  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.TASK,
    // When dropping on empty column area
    drop: (item) => {
      if (item.columnId !== columnId) {
        // Move to end of this column
        moveTask(item.index, tasks.length, item.columnId, columnId);
        return { moved: true };
      }
      return undefined;
    },
  });

  return (
    <AnimatedSection delay={0.1 * Object.keys(initialTasks).indexOf(columnId)}>
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
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-2">
            <Plus className="h-4 w-4 mr-1" /> 
            Add Task
          </Button>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
};

// Main Component
interface SprintBoardPageProps {
  params: {
    sprintId: string;
    id: string;
  }
}

const SprintBoardPage: React.FC<SprintBoardPageProps> = ({ params }) => {
  const { sprintId, id: projectId } = params;
  const [tasks, setTasks] = useState<ColumnTasks>(initialTasks);

  // Move task between columns or within a column
  const moveTask = (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string) => {
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
    
    // Show toast if moved to a different column
    if (sourceColumnId !== targetColumnId) {
      toast.success(`Task moved to ${getColumnTitle(targetColumnId)}`);
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

  const getPriorityColor = (priority: Priority): string => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <AnimatedSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sprint Board</h1>
          <p className="text-muted-foreground">
            Project: {projectId} • Sprint: {sprintId}
          </p>
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
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default SprintBoardPage;