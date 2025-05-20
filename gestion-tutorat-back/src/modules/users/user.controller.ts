import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { AuthGuard } from '../auth/jwt/guards/auth.guard';
import { RolesGuard } from '../auth/jwt/guards/roles.guard';
import { Roles } from '../auth/jwt/decorator/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  async searchUsers(@Query('name') name: string, @Query('email') email: string, @Query('role') role: string) {
    return this.userService.advancedSearch({ name, email, role });
  }

  @Post()
  async create(@Body() dto: createUserDto): Promise<User> {
    try {
      return await this.userService.createUser(dto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<User>): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
