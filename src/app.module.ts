import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthorModule } from './modules/author/author.module';
import { BookModule } from './modules/book/book.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
  imports: [UserModule, AuthorModule, BookModule, FavoritesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
