import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/options";
import prisma from "@/prisma/client";

export async function POST (req: NextRequest) {
    const session : Session | null= await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({msg: 'Unauthorised'}, {status: 401})

    const body = await req.json()
    const {title, startDate, endDate, projectId, startingThoughts} = body

    //TODO: input validation

    const sprint = await prisma.sprint.create({
        data: {
            title,
            startDate,
            endDate,
            projectId,
            ownerEmail: session.user?.email!,
            startingThoughts
        }
    })

    return NextResponse.json(sprint, {status: 201})

}