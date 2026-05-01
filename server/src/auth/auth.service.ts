import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  // ======== BASIC AUTH METHODS ========
  //Register
  async register(dto: RegisterUserDto) {
    // Check if user already exists
    const existingUser = await this.userService.findByEmailForAuth(dto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    // Create new user
    const user = await this.userService.registerUser(dto);
    return user;
  }
  //Login
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
