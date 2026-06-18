import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const makeUser = (overrides: Partial<any> = {}) => ({
  id: 'user-uuid-1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed-password',
  address: '123 Main St',
  pinCode: 380001,
  role: 'user',
  isVerified: false,
  emailVerificationToken: 'valid-token',
  tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  ...overrides,
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockDataSource = {
  getRepository: jest.fn().mockReturnValue(mockRepo),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed-jwt-token'),
};

const mockEmailService = {
  sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'DATA_SOURCE', useValue: mockDataSource },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // -------------------------------------------------------------------------
  // register
  // -------------------------------------------------------------------------
  describe('register', () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Str0ng!Pass',
      address: '123 Main St',
      pinCode: 380001,
    };

    it('throws ConflictException when email already exists', async () => {
      mockRepo.findOne.mockResolvedValueOnce(makeUser());
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('hashes the password before saving', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      mockRepo.create.mockImplementation((data) => data);
      mockRepo.save.mockResolvedValueOnce({});

      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await service.register(dto);

      expect(hashSpy).toHaveBeenCalledWith(dto.password, 10);
    });

    it('saves user with isVerified=false and a token', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      const created: any = {};
      mockRepo.create.mockImplementation((data) => {
        Object.assign(created, data);
        return created;
      });
      mockRepo.save.mockResolvedValueOnce({});

      await service.register(dto);

      expect(created.isVerified).toBe(false);
      expect(created.emailVerificationToken).toBeDefined();
      expect(typeof created.emailVerificationToken).toBe('string');
      expect(created.tokenExpiresAt).toBeInstanceOf(Date);
    });

    it('sends a verification email', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      mockRepo.create.mockImplementation((data) => data);
      mockRepo.save.mockResolvedValueOnce({});

      await service.register(dto);

      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        dto.email,
        expect.any(String),
      );
    });

    it('returns a success message', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      mockRepo.create.mockImplementation((data) => data);
      mockRepo.save.mockResolvedValueOnce({});

      const result = await service.register(dto);
      expect(result.message).toContain('Registration successful');
    });
  });

  // -------------------------------------------------------------------------
  // verifyEmail
  // -------------------------------------------------------------------------
  describe('verifyEmail', () => {
    it('throws BadRequestException when token is empty', async () => {
      await expect(service.verifyEmail('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws NotFoundException for unknown token', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.verifyEmail('unknown-token')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns already-verified message if user already verified', async () => {
      mockRepo.findOne.mockResolvedValueOnce(makeUser({ isVerified: true }));
      const result = await service.verifyEmail('valid-token');
      expect(result.message).toContain('already verified');
    });

    it('throws BadRequestException for expired token', async () => {
      const expired = makeUser({
        tokenExpiresAt: new Date(Date.now() - 1000),
      });
      mockRepo.findOne.mockResolvedValueOnce(expired);
      await expect(service.verifyEmail('valid-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('marks user as verified and clears token on success', async () => {
      const user = makeUser();
      mockRepo.findOne.mockResolvedValueOnce(user);
      mockRepo.save.mockResolvedValueOnce({});

      const result = await service.verifyEmail('valid-token');

      expect(user.isVerified).toBe(true);
      expect(user.emailVerificationToken).toBeNull();
      expect(user.tokenExpiresAt).toBeNull();
      expect(result.message).toContain('verified successfully');
    });
  });

  // -------------------------------------------------------------------------
  // login
  // -------------------------------------------------------------------------
  describe('login', () => {
    const dto = { email: 'john@example.com', password: 'Str0ng!Pass' };

    it('throws UnauthorizedException when user not found', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when email not verified', async () => {
      mockRepo.findOne.mockResolvedValueOnce(makeUser({ isVerified: false }));
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException on wrong password', async () => {
      mockRepo.findOne.mockResolvedValueOnce(makeUser({ isVerified: true }));
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('returns accessToken on valid credentials', async () => {
      mockRepo.findOne.mockResolvedValueOnce(makeUser({ isVerified: true }));
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

      const result = await service.login(dto);
      expect(result.accessToken).toBe('signed-jwt-token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'user-uuid-1',
        email: 'john@example.com',
        role: 'user',
      });
    });
  });
});
