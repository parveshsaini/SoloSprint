import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/options";
import prisma from "@/prisma/client";

export async function POST (req: NextRequest) {
    const session : Session | null= await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({msg: 'Unauthorised'}, {status: 401})

    const body = await req.json()
    const {title, description, sprintId} = body

    //TODO: input validation

    const task  = await prisma.task.create({
        data: {
            title,
            description,
            sprintId,
            status: 'TODO',
            ownerEmail: session.user?.email!,
        }
    })

    return NextResponse.json(task, {status: 201})
}