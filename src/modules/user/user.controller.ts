import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request, request } from 'express';
import { Authenticated } from '../auth/dto/authenticated-auth.dto copy';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete() {
    console.log(request, 'era qui ');
    const user: Authenticated = request['user'];
    await this.userService.delete(request['user'].sub);

    return { message: 'User deleted successfully' };
  }
}
