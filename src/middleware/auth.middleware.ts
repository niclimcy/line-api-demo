import { getSession } from '@auth/express'
import { authConfig } from '../config/auth.config'
import type { NextFunction, Request, Response } from 'express'

export async function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session =
    res.locals.session ?? (await getSession(req, authConfig)) ?? undefined

  res.locals.session = session

  return next()
}

export async function currentSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = (await getSession(req, authConfig)) ?? undefined
  res.locals.session = session
  return next()
}
