import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    email: string;
    role: string | null;
    image: string | null;
  }

  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      role: string | null;
      image: string | null;
    } & DefaultSession["user"];
  }
}
