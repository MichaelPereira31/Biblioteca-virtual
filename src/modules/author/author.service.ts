import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/shared/database';

@Injectable()
export class AuthorService {
  constructor(private prismaService: PrismaService) {}
  async create(data: CreateAuthorDto) {
    return await this.prismaService.author.create({ data });
  }

  async findAll() {
    return await this.prismaService.author.findMany();
  }

  async findOne(id: string) {
    const author = await this.prismaService.author.findUnique({
      where: { id },
    });

    if (!author) throw new NotFoundException(`Author ${id} not found`);

    return author;
  }

  async update(id: string, data: UpdateAuthorDto) {
    const author = await this.prismaService.author.findUnique({
      where: { id },
    });

    if (!author) throw new NotFoundException(`Author ${id} not found`);

    return await this.prismaService.author.update({ where: { id }, data });
  }

  async delete(id: string) {
    const author = await this.prismaService.author.findUnique({
      where: { id },
    });

    if (!author) throw new NotFoundException(`Author ${id} not found`);

    await this.prismaService.author.delete({ where: { id } });
  }
}
