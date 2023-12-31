import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/shared/database';
import { AuthorService } from '../author/author.service';

@Injectable()
export class BookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authorService: AuthorService,
  ) {}
  async create(createBookDto: CreateBookDto) {
    await this.authorService.findOne(createBookDto.authorId);

    const book = await this.prismaService.book.findMany({
      where: { title: createBookDto.title },
    });

    console.log(book);
    if (book.length) {
      throw new BadRequestException(
        `Book ${createBookDto.title} already exists`,
      );
    }

    return await this.prismaService.book.create({ data: createBookDto });
  }

  async findAll() {
    return await this.prismaService.book.findMany({
      include: {
        author: true,
      },
    });
  }

  async findOne(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return await this.prismaService.book.update({
      where: { id },
      include: {
        author: true,
      },
      data: updateBookDto,
    });
  }

  async delete(id: string) {
    const book = await this.prismaService.book.findMany({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.prismaService.book.delete({ where: { id } });
  }
}
