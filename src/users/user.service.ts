import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {UpdateUserDto} from "./dto/UpdateUser.dto";

@Injectable()
export class UserService {
  constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await user.save();

    const token = this.jwtService.sign({ id: user._id });
    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user._id });
    return { user, token };
  }

  // Update user by ID
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    // Implementation for updating user
    const updateData = { ...updateUserDto };
    return await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete user by ID
  async deleteUser(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userModel.findByIdAndDelete(id);
    return { message: `User with ID ${id} deleted successfully` };
  }
  async getUserById(id: string) {
    // Assuming you're using a database like MongoDB
    const user = await this.userModel.findById(id).exec(); // Replace with actual DB logic
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
