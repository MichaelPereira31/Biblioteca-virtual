import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/database';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }
  async findById(id: string): Promise<User | null> {
    const user = await this.findUnique({ id });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.findUnique({ email });

    if (!user) throw new NotFoundException(`User ${email} not found`);

    return user;
  }

  async create(data: any): Promise<User> {
    const emailAlreadyExists = await this.findUnique({ email: data.email });

    if (emailAlreadyExists) {
      throw new NotFoundException('Email already exists');
    }

    return await this.prisma.user.create({ data });
  }

  async update(data: object, id: string): Promise<User> {
    const emailAlreadyExists = await this.findUnique({ id });

    if (emailAlreadyExists) {
      throw new NotFoundException('Email already exists');
    }

    return await this.prisma.user.update({ data, where: { id } });
  }

  async delete(id: string): Promise<User | null> {
    const user = await this.findUnique({ id });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    await this.prisma.user.delete({ where: { id } });

    return user;
  }

  private async findUnique(condition: object): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: condition });
  }
}
