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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Created user' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 400, description: 'Invalid uuid format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'Updated user' })
  @ApiResponse({ status: 400, description: 'Invalid uuid format or input' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'Deleted user' })
  @ApiResponse({ status: 400, description: 'Invalid uuid format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
