import { environment } from '../../environments/environment';

/** Logs only in development. Use instead of console.log to avoid noise in production. */
export const devLog = (...args: unknown[]): void => {
  if (!environment.production) {
    console.log(...args);
  }
};
