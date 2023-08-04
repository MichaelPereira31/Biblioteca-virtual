import { Status } from '@prisma/client';

export class CreateFavoriteDto {
  userId: string;
  bookId: string;
  status: Status;
}
