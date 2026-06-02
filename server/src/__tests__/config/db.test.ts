import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockConnect = jest.fn();

jest.unstable_mockModule('mongoose', () => ({
  default: { connect: mockConnect },
}));

const { default: connectDB } = await import('../../config/db.js');

beforeEach(() => {
  jest.clearAllMocks();
  process.env['MONGO_URI'] = 'mongodb://localhost:27017/test';
});

describe('connectDB', () => {
  it('connects to MongoDB using MONGO_URI and logs success', async () => {
    mockConnect.mockResolvedValue(undefined);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await connectDB();

    expect(mockConnect).toHaveBeenCalledWith('mongodb://localhost:27017/test');
    expect(consoleSpy).toHaveBeenCalledWith('MongoDB connected successfully');

    consoleSpy.mockRestore();
  });

  it('logs the error and calls process.exit(1) on connection failure', async () => {
    const error = new Error('Connection refused');
    mockConnect.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith('MongoDB connection failed:', error);
    expect(exitSpy).toHaveBeenCalledWith(1);

    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
