import authOptions from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: {id: string}
}

export default async function PATCH (req: NextRequest, {params}: Props) {
    const session = await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({msg: 'Unauthorised'}, {status: 401})

    const body = await req.json()

    const {title, imageUrl} = body

    const project = await prisma.project.findUnique({
        where: {
            id: params.id,
            ownerEmail: session.user?.email!,
        }
    })

    if(!project)
        return NextResponse.json({msg: 'Project not found'}, {status: 404})

    const updatedProject = await prisma.project.update({
        where: {
            id: params.id,
        },
        data: {
            title,
            imageUrl
        }
    })

    return NextResponse.json(updatedProject, {status: 200})
}