declare module 'passport-line' {
  import * as express from 'express'
  import * as passport from 'passport'

  export interface StrategyOptions {
    channelID: string
    channelSecret: string
    callbackURL: string
    scope?: string | string[]
  }

  export interface StrategyOptionsWithRequest extends StrategyOptions {
    passReqToCallback: true
  }

  export interface Profile extends passport.Profile {
    id: string
    displayName: string
    pictureUrl?: string
    statusMessage?: string
    provider: 'line'
    _raw: string
    _json: {
      userId: string
      displayName: string
      pictureUrl?: string
      statusMessage?: string
    }
  }

  export type VerifyCallback = (error: any, user?: any, info?: any) => void

  export class Strategy extends passport.Strategy {
    constructor(
      options: StrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => void
    )
    constructor(
      options: StrategyOptionsWithRequest,
      verify: (
        req: express.Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => void
    )
  }

  // Extend passport's Authenticator to include 'line' strategy
  declare module 'passport' {
    interface Authenticator<
      InitializeRet = express.Handler,
      AuthenticateRet = any,
      AuthorizeRet = AuthenticateRet,
      AuthorizeOptions = passport.AuthenticateOptions,
    > {
      authenticate(
        strategy: 'line',
        options?: any,
        callback?: (...args: any[]) => any
      ): AuthenticateRet
    }
  }
}
