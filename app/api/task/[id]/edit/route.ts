import authOptions from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: {id: string}
}

export  async function PATCH (req: NextRequest, {params}: Props) {
    const session = await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({msg: 'Unauthorised'}, {status: 401})

    const body = await req.json()
    const {id} = await params
    const {title, description, status, startedAt, finishedAt} = body


    const task = await prisma.task.findUnique({
        where: {
            id,
            ownerEmail: session.user?.email!,
        }
    })

    if(!task)
        return NextResponse.json({msg: 'Task not found'}, {status: 404})

    const updateData: Record<string, any> = {};
    if (title ) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (startedAt) updateData.startedAt = startedAt;
    if (finishedAt) updateData.finishedAt = finishedAt;

    console.log('updated task', updateData)
    
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedTask, {status: 200})
}