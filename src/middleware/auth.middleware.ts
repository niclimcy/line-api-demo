import { getSession } from '@auth/express'
import { authConfig } from '../config/auth.config.js'
import type { NextFunction, Request, Response } from 'express'
import User from '../schemas/user.schema.js'

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

export async function checkRegistration(req: Request, res: Response, next: NextFunction) {
  // Check if user is logged in
  const session = (await getSession(req, authConfig)) ?? undefined
  console.log(session)

  if (session && session.user) {
    const email = session.user.email;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        // If no user found with the provided email, throw an error
        return next(new Error('Missing user email!'));
      }

      // Check if the user is registered
      if (!user.registered) {
        // If the user is not registered, redirect to the registration page
        return res.redirect('/auth/register');
      }
    } catch (error) {
      // Handle any errors that occurred during the database operation
      return next(error);
    }
  }

  // If the user is registered or not logged in, proceed to the next middleware
  next();
};