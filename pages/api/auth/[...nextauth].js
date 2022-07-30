import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { comparePassword } from "../../../lib/auth-utils";
import { connectToDatabase } from "../../../lib/db-utils";

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const client = await connectToDatabase();

        const db = client.db("authProject-dev");
        const collection = db.collection("users");
        const foundUser = await collection.findOne({
          email: credentials.email,
        });

        if (!foundUser) {
          client.close();
          throw new Error("No user found!");
          // return null;
        }

        const verified = await comparePassword(
          credentials.password,
          foundUser.password
        );

        if (!verified) {
          client.close();

          throw new Error("Password is not valid!");
          // return null;
        }

        client.close();
        return { email: foundUser.email };
      },
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.MY_SECRET,
});
