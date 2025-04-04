import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/prisma/client";
import { Adapter } from "next-auth/adapters";

const authOptions: NextAuthOptions= {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [

        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    session: {
      strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
  }

  export default authOptions