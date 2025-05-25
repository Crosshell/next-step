import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserSwagger } from '../../docs/swagger/user.swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UserSwagger.create()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UserSwagger.findAll()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UserSwagger.findById()
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @UserSwagger.update()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UserSwagger.remove()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
