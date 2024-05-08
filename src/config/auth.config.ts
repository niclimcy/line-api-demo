import LINE from '@auth/express/providers/line'
import Google from '@auth/express/providers/google'
import Facebook from '@auth/express/providers/facebook'

export const authConfig = {
  trustHost: true,
  providers: [
    LINE({
      checks: ['state'],
    }),
    Google,
    Facebook
  ],
}
