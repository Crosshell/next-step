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
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<Company> {
    return this.companyService.create(createCompanyDto, user.id);
  }

  @Post('search')
  async search(@Body() searchCompanyDto: SearchCompanyDto): Promise<Company[]> {
    return this.companyService.findMany(searchCompanyDto);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async getMyProfile(
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<Company | null> {
    return this.companyService.findOne({ userId: user.id });
  }

  @Get(':id')
  async getProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Company | null> {
    return this.companyService.findOne({ id });
  }

  @Patch('me')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<Company> {
    return this.companyService.update(updateCompanyDto, user.id);
  }
}
