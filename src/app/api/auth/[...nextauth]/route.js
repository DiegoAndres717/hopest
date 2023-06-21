import NextAuth from "next-auth/next";
import prisma from '../../../../libs/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt'
import { Auth } from "@auth/core"
import jwt from "jsonwebtoken";
import { signJwtToken } from "@/libs/jwt";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
              }
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text", placeholder: "John Smith" },
                
            },
            async authorize(credentials) {
              
                // check to see if email and password is there
                if(!credentials.email || !credentials.password) {
                    throw new Error('Please enter an email and password')
                }

                // check to see if user exists
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                // if no user was found 
                if (!user || !user?.hashedPassword) {
                    throw new Error('No user found')
                }

                // check to see if password matches
                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

                // if password does not match
                if (passwordMatch) {
                    const accessToken = signJwtToken(
                        { userId: user },
                        { expiresIn: '24h' }
                      );
                    
                    return {
                        ...user,
                        accessToken
                    }
                } else {
                    throw new Error('Incorrect password')
                    
                }

            },
        }),  
    ],
    callbacks: {
        
        async jwt({ token, user, account }) {
          if (user) {
            token.accessToken = user.accessToken;
            token.id = user.id
          }
          if (account) {
            const accessToken = signJwtToken(
                 user,
                { expiresIn: '24h' }
              );
            token.accessToken = accessToken;
        }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user.accessToken = token.accessToken;
            session.user.id = token.id;
            
          }
          
          return session;
        },
      },
    secret: process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}