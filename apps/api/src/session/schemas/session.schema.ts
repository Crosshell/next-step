import { z } from 'zod';

export const SessionSchema = z.object({
  sid: z.string(),
  userId: z.string(),
  ua: z.string(),
  ip: z.string(),
});

export type Session = z.infer<typeof SessionSchema>;
