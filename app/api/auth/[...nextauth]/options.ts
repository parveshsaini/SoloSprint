import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/prisma/client";
import { Adapter } from "next-auth/adapters";

const authOptions: NextAuthOptions= {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
      // CredentialsProvider({
      //     name: 'Credentials',
      //     credentials: {
      //       email: { label: 'email', type: 'text', placeholder: '' },
      //       password: { label: 'password', type: 'password', placeholder: '' },
      //     },
      //     async authorize(credentials: ICredentails) {
  
      //         if(!credentials.email || !credentials.password){
      //           throw new Error("Invalid creds")
      //         }
  
      //         const user= await prisma.user.findUnique({
      //           where: {
      //             email: credentials.email
      //           }
      //         })
  
      //         if(!user){
      //           throw new Error("User not found")
      //         }
  
      //         const isPasswordCorrect= await bcrypt.compare(
      //           credentials.password,
      //           user.password
      //         )
  
      //         if(!isPasswordCorrect){
      //           throw new Error("Incorrect Password")
      //         }
              
      //         return user
      //     },
      //   }),
        
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