import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/shared/database';
import { BookService } from '../book/book.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookService: BookService,
  ) {}
  async create(userId: string, createFavoriteDto: CreateFavoriteDto) {
    await this.bookService.findOne(createFavoriteDto.bookId);

    return await this.prismaService.favorite.create({
      data: { userId, ...createFavoriteDto },
      include: {
        books: true,
      },
    });
  }

  async findAll(id: string) {
    return await this.prismaService.favorite.findMany({
      where: { userId: id },
      include: {
        books: true,
      },
    });
  }

  async findOne(id: string) {
    const favorite = await this.prismaService.favorite.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!favorite) throw new NotFoundException('Favorite not found');

    return favorite;
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto) {
    const favorite = await this.prismaService.favorite.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!favorite) throw new NotFoundException('Favorite not found');

    return this.prismaService.favorite.update({
      where: { id },
      include: {
        books: true,
      },
      data: updateFavoriteDto,
    });
  }

  async delete(id: string) {
    const favorite = await this.prismaService.favorite.findUnique({
      where: { id },
    });

    if (!favorite) throw new NotFoundException('Favorite not found');

    await this.prismaService.favorite.delete({ where: { id } });
  }
}
