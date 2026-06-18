import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { User } from '../database/entities/user.entity';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const VERIFICATION_TOKEN_TTL_HOURS = 24;
const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly userRepo: Repository<User>;

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const token = uuidv4();
    const tokenExpiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000,
    );

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      address: dto.address,
      pinCode: dto.pinCode,
      isVerified: false,
      emailVerificationToken: token,
      tokenExpiresAt,
    });

    await this.userRepo.save(user);
    await this.emailService.sendVerificationEmail(dto.email, token);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const user = await this.userRepo.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    if (user.isVerified) {
      return { message: 'Email is already verified' };
    }

    if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
      throw new BadRequestException(
        'Verification token has expired. Please request a new one.',
      );
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.tokenExpiresAt = null;
    await this.userRepo.save(user);

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password', 'role', 'isVerified'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
