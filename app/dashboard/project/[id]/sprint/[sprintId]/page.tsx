// app/dashboard/project/[id]/sprint/[sprintId]/page.tsx - Server Component
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/prisma/client';
import SprintBoard from '@/components/SprintBoard';

interface SprintBoardPageProps {
  params: {
    sprintId: string;
    id: string; // projectId
  };
}


export default async function SprintBoardPage({ params }: SprintBoardPageProps) {
  const { sprintId, id: projectId } = await params;

  // Fetch sprint and associated tasks using Prisma
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: {
      tasks: true,
      project: {
        select: {
          title: true
        }
      }
    }
  });

  // If sprint not found, return 404
  if (!sprint) {
    notFound();
  }

  // Group tasks by status
  const tasks = {
    'todo': sprint.tasks.filter(task => task.status === 'TODO'),
    'in-progress': sprint.tasks.filter(task => task.status === 'IN_PROGRESS'),
    'done': sprint.tasks.filter(task => task.status === 'DONE')
  };

  return (
    <Suspense fallback={<div>Loading sprint board...</div>}>
      <SprintBoard
        sprint={sprint} 
        tasks={tasks} 
        projectId={projectId} 
      />
    </Suspense>
  );
}