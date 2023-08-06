import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Authenticated } from '../auth/dto/authenticated-auth.dto';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @AuthUser() user: Authenticated,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoritesService.create(user.sub, createFavoriteDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@AuthUser() user: Authenticated) {
    return this.favoritesService.findAll(user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return this.favoritesService.update(id, updateFavoriteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    await this.favoritesService.delete(id);
    return { message: 'Favorite deleted successfully' };
  }
}
