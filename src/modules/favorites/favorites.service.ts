import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/shared/database';

@Injectable()
export class FavoritesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createFavoriteDto: CreateFavoriteDto) {
    return await this.prismaService.favorite.create({
      data: createFavoriteDto,
      include: {
        books: true,
        user: true,
      },
    });
  }

  async findAll(id: string) {
    return await this.prismaService.favorite.findMany({
      where: { userId: id },
      include: {
        books: true,
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const favorite = await this.prismaService.favorite.findUnique({
      where: { id },
      include: {
        books: true,
        user: true,
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
        user: true,
      },
    });

    if (!favorite) throw new NotFoundException('Favorite not found');

    return this.prismaService.favorite.update({
      where: { id },
      include: {
        books: true,
        user: true,
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
