import { User } from './types';
declare module 'express' {
  interface Request {
    user: User;
  }
}
