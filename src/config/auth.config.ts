import LINE from '@auth/express/providers/line'
import Google from '@auth/express/providers/google'

export const authConfig = {
  trustHost: true,
  providers: [
    LINE({
      checks: ['state'],
    }),
    Google,
  ],
}
