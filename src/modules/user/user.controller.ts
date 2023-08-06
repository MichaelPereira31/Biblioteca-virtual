import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { Authenticated } from '../auth/dto/authenticated-auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findById(@AuthUser() user: Authenticated) {
    return await this.userService.findById(user.sub);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() user: Authenticated,
  ) {
    return await this.userService.update(user.sub, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@AuthUser() user: Authenticated) {
    await this.userService.delete(user.sub);

    return { message: 'User deleted successfully' };
  }
}
