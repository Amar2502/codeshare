import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "./lib/dbConnect";
import User from "./models/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        await dbConnect(); // Ensure DB connection

        // Check if user already exists
        const userExists = await User.findOne({ email: profile?.email });

        if (!userExists) {
          try {
            // Extract and format username
            const username: string = profile?.name
              ? profile.name.replace(/\s+/g, "").toLowerCase() // Remove spaces & convert to lowercase
              : profile?.email?.split("@")[0] || "user";

            console.log(username);

            // Create new user in MongoDB
            await User.create({
              name: username,
              email: profile?.email,
              image: profile?.picture || "",
              projects: [], // Ensure projects is always an array for new users
            });

            console.log(`User created: ${username}`);
          } catch (error) {
            console.error("Error creating user:", error);
          }
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error("Error signing in:", error);
        return false; // Deny sign-in if error occurs
      }
    },
    async session({ session }: { session: Session }) {
      if (session.user) {
        await dbConnect(); // Ensure DB connection
        const dbUser = await User.findOne({ email: session.user.email });

        if (!dbUser) return session; // Ensure dbUser exists

        session.user = {
          ...session.user,
          name: dbUser.name,
          id: dbUser._id.toString(),
          projects: dbUser.projects ?? [], // Ensure projects is always an array
        };
      }
      return session;
    },
  },
});
