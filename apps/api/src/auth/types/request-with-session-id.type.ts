import { Request } from 'express';

export interface RequestWithSessionId extends Request {
  cookies: {
    sid: string;
  };
}
