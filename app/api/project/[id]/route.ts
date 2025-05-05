
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/options";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const {id} = await params

  if (!session) {
    return NextResponse.json({ msg: "Unauthorised aasd" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerEmail: session.user?.email!,
    },
    include: {
      sprints: true,
    },
  });

  if (!project) {
    return NextResponse.json({ msg: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project, { status: 200 });
}
