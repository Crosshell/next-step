import { UserType } from '@prisma/client';

export class JwtPayloadDto {
  id: string;
  email: string;
  userType: UserType;
}
