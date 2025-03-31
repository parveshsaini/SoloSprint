import authOptions from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: {id: string}
}

export default async function DELETE (req: NextRequest, {params}: Props) {
    const session = await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({msg: 'Unauthorised'}, {status: 401})


    const sprint = await prisma.sprint.findUnique({
        where: {
            id: params.id,
            ownerEmail: session.user?.email!,
        }
    })

    if(!sprint)
        return NextResponse.json({msg: 'Sprint not found'}, {status: 404})

    await prisma.sprint.delete({
        where: {
            id: params.id,
        }
    })

    return NextResponse.json({msg: 'Sprint and associated Tasks deleted successfully'}, {status: 200})
}