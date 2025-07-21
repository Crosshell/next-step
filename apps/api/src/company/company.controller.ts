import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { CompanyGuard } from './guards/company.guard';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<Company> {
    return this.service.create(user.id, dto);
  }

  @Post('search')
  async search(@Body() dto: SearchCompanyDto): Promise<Company[]> {
    return this.service.findMany(dto);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async getMyProfile(
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<Company> {
    return this.service.findOneOrThrow({ userId: user.id });
  }

  @Get(':id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string): Promise<Company> {
    return this.service.findOneOrThrow({ id });
  }

  @Patch('me')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async update(
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<Company> {
    return this.service.update(user.id, dto);
  }
}
