import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { UserService } from 'src/user/user.service';
import { EmailLoginDto } from './common/dto/login.dto';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // ======== BASIC AUTH METHODS ========
  //Register
  async register(dto: RegisterUserDto) {
    // Check if user already exists
    const user = await this.userService.findByEmailForAuth(dto.email);
    //send otp to email for verification
    return {
      message:
        'Registration successful. Please check your email and enter the verification code.',
    };
  }

  //Login
  async login(dto: EmailLoginDto) {
    const user = await this.userService.findByEmailForAuth(dto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
  }

  //verify email using otp
  //rend email verification otp
  //reset password using otp
  //forgot password using otp
  //phone number verification using otp
  //restore password using otp
  //2FA using otp
  //refresh access token using refresh token
  //handle social logins (Google, Facebook, etc.)
  //   ====== HELPER METHODS ======
  //generate JWT access and refresh tokens
  //generate and verify OTPs
  //otp expiration and retry logic
  //send emails for verification and password reset
}
