import type { BetterAuthUser, BetterAuthSession } from '../lib/auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: BetterAuthUser;
      session?: BetterAuthSession;
    }
  }
}
