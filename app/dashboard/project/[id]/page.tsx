import authOptions from "@/app/api/auth/[...nextauth]/options";
import ProjectDetails from "@/components/ProjectDetails";
import prisma from "@/prisma/client";
import axios from "axios";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id: projectId } = await params
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound(); 
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerEmail: session.user?.email!,
    },
    include: {
      sprints: true,
    },
  });

  if (!project) {
    return notFound();
  }

  return (
    
      <ProjectDetails project={project} />
    
  );

}
