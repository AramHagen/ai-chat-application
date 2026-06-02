import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';

const mockVerify = jest.fn();
const mockSign = jest.fn();

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { verify: mockVerify, sign: mockSign },
}));

const { default: authMiddleware } = await import('../../middleware/auth.js');

const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (res.status as any).mockReturnValue(res);
  return res;
};

describe('authMiddleware', () => {
  const next = jest.fn() as unknown as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env['JWT_SECRET'] = 'test-secret';
  });

  it('returns 401 when no authorization header is present', () => {
    const req = { headers: {} } as unknown as AuthRequest;
    const res = makeRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when bearer token is empty string', () => {
    const req = { headers: { authorization: 'Bearer ' } } as unknown as AuthRequest;
    const res = makeRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token verification throws', () => {
    const req = { headers: { authorization: 'Bearer bad-token' } } as unknown as AuthRequest;
    const res = makeRes();
    mockVerify.mockImplementation(() => {
      throw new Error('invalid signature');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('sets userId on request and calls next for a valid token', () => {
    const req = { headers: { authorization: 'Bearer valid-token' } } as unknown as AuthRequest;
    const res = makeRes();
    mockVerify.mockReturnValue({ userId: 'user-abc' });

    authMiddleware(req, res, next);

    expect(req.userId).toBe('user-abc');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
