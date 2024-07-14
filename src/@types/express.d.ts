import { User } from 'src/domain/entities/User';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
