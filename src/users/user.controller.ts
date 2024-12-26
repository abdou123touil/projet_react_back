import { Controller, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer'; // Import Multer directly from multer package

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage'))
  async register(
      @Body() createUserDto: CreateUserDto,
      @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      // Assuming you're storing the file locally or have a file handling service
      createUserDto.profileImage = file.filename; // Save the file's name or path
    }
    return this.userService.register(createUserDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  // Update user by ID
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser(
      @Param('id') id: string,
      @Body() createUserDto: CreateUserDto
  ) {
    return this.userService.updateUser(id, createUserDto);
  }

  // Delete user by ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
