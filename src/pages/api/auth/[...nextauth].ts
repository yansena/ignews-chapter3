import NextAuth from "next-auth";
import { query as q } from 'faunadb'
import GithubProvider from "next-auth/providers/github";

import { fauna } from '../../../services/fauna';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({user, account, profile}): Promise<boolean>{
      const { email } = user;

      try {
        await fauna.query(
          q.Create(
            q.Collection('users'),
            { data: { email }}
          )
        )
        
        return true;

      } catch (error) {
        return false
      }
      

    }
  }
})