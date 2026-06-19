import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// Mock nodemailer at module level.
// The factory runs before variable declarations are initialized (TDZ), so
// we cannot reference a `const mockSendMail` from the outer scope.
// Instead, expose the mock via nodemailer.createTransport() return value
// and retrieve it after module load.
// ---------------------------------------------------------------------------
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('EmailService', () => {
  let service: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);

    // Retrieve the sendMail spy from the mocked transporter
    const transporter = (nodemailer.createTransport as jest.Mock).mock
      .results[0]?.value;
    sendMailMock = transporter?.sendMail as jest.Mock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('calls transporter.sendMail with correct parameters', async () => {
      sendMailMock.mockResolvedValueOnce({ messageId: 'test-id' });

      await service.sendVerificationEmail('user@example.com', 'test-token-123');

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      const callArgs = sendMailMock.mock.calls[0][0];
      expect(callArgs.to).toBe('user@example.com');
      expect(callArgs.text).toContain('test-token-123');
      expect(callArgs.text).toContain(
        '/api/auth/verify-email?token=test-token-123',
      );
      expect(callArgs.subject).toMatch(/verify/i);
    });

    it('propagates error when sendMail throws', async () => {
      const smtpError = new Error('SMTP connection refused');
      sendMailMock.mockRejectedValueOnce(smtpError);

      await expect(
        service.sendVerificationEmail('user@example.com', 'test-token-123'),
      ).rejects.toThrow('SMTP connection refused');
    });

    it('creates the transporter using envConfig SMTP settings', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: expect.any(String),
          port: expect.any(Number),
          auth: expect.objectContaining({
            user: expect.any(String),
            pass: expect.any(String),
          }),
        }),
      );
    });
  });
});
