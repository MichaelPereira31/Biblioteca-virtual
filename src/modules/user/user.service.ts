import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database';
import { encrypted } from 'src/shared/util/encrypted';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException(`User ${email} not found`);

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (emailAlreadyExists) {
      throw new NotFoundException('Email already exists');
    }

    createUserDto.password = await encrypted(createUserDto.password);

    return await this.prisma.user.create({ data: createUserDto });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    await this.prisma.user.delete({ where: { id } });
  }
}
