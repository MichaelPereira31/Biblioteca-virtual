import { Status } from '@prisma/client';

export class CreateFavoriteDto {
  bookId: string;
  status: Status;
}
