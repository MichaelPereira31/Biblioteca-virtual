import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from 'src/shared/database';
import { BookService } from '../book/book.service';
import { AuthorService } from '../author/author.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService, BookService, AuthorService],
})
export class FavoritesModule {}
