import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/options";
import prisma from "@/prisma/client";

export async function POST (req: NextRequest) {
    const session : Session | null= await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({msg: 'Unauthorised'}, {status: 401})


    const body = await req.json()
    const {title, description} = body

    //TODO: input validation

    const project  = await prisma.project.create({
        data: {
            title,
            description: description,
            ownerEmail: session.user?.email!,
        }
    })

    return NextResponse.json(project, {status: 201})

}