import type { RequestHandler } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';
import type { Role } from '../db/schema/index.js';

export const requireAuth: RequestHandler = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user || !session?.session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  req.user = {
    ...session.user,
    role: session.user.role as Role,
  };

  req.session = session.session;

  next();
};
