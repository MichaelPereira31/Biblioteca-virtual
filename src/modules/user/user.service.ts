import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/database';
import { encrypted } from 'src/shared/util/encrypted';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException(`User ${email} not found`);

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (emailAlreadyExists) {
      throw new NotFoundException('Email already exists');
    }

    data.password = await encrypted(data.password);

    return await this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return await this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    await this.prisma.user.delete({ where: { id } });
  }
}
