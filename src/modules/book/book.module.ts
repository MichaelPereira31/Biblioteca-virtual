import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaService } from 'src/shared/database';
import { AuthorService } from '../author/author.service';

@Module({
  controllers: [BookController],
  providers: [BookService, PrismaService, AuthorService],
})
export class BookModule {}
