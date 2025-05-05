import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../auth/[...nextauth]/options";
import prisma from "@/prisma/client";

export async function GET (req: NextRequest) {
    const session : Session | null= await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({msg: 'Unauthorised'}, {status: 401})

    const projects = await prisma.project.findMany({
        where: {
            ownerEmail: session.user?.email!,
        }
    })

    return NextResponse.json(projects, {status: 201})
}
