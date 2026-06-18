import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully. Verification email has been sent.',
  })
  @ApiResponse({ status: 409, description: 'Email is already registered' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return { data: {}, message: result.message };
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address using the token from email' })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'UUID verification token sent to the user email',
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Token missing or expired' })
  @ApiResponse({ status: 404, description: 'Invalid token' })
  async verifyEmail(@Query('token') token: string) {
    const result = await this.authService.verifyEmail(token);
    return { data: {}, message: result.message };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful — returns JWT access token',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or unverified email',
  })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { data: result, message: 'Login successful' };
  }
}
