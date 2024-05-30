import NextAuth from "next-auth";
import LINE from "next-auth/providers/line";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    LINE({
      checks: ["state"],
    }),
    Google,
    Facebook,
  ],
});
