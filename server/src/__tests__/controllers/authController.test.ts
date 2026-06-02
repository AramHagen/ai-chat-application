import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';

const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockHash = jest.fn();
const mockCompare = jest.fn();
const mockSign = jest.fn();
const mockVerify = jest.fn();

jest.unstable_mockModule('../../models/User.js', () => ({
  default: { findOne: mockFindOne, create: mockCreate },
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: { hash: mockHash, compare: mockCompare },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: mockSign, verify: mockVerify },
}));

const { signup, signin } = await import('../../controllers/authController.js');

const makeReq = (body = {}): Request => ({ body }) as Request;

const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (res.status as any).mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env['JWT_SECRET'] = 'test-secret';
});

describe('signup', () => {
  it('returns 400 when user already exists', async () => {
    mockFindOne.mockResolvedValue({ _id: '1', email: 'a@b.com' });
    const res = makeRes();

    await signup(makeReq({ name: 'Aram', email: 'a@b.com', password: 'pass' }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('hashes password and returns 201 with token and user on success', async () => {
    mockFindOne.mockResolvedValue(null);
    mockHash.mockResolvedValue('hashed-pass');
    const mockUser = { _id: 'uid1', name: 'Aram', email: 'a@b.com' };
    mockCreate.mockResolvedValue(mockUser);
    mockSign.mockReturnValue('jwt-token');
    const res = makeRes();

    await signup(makeReq({ name: 'Aram', email: 'a@b.com', password: 'pass' }), res);

    expect(mockHash).toHaveBeenCalledWith('pass', 10);
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'Aram',
      email: 'a@b.com',
      passwordHash: 'hashed-pass',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      token: 'jwt-token',
      user: { id: 'uid1', name: 'Aram', email: 'a@b.com' },
    });
  });

  it('returns 500 on unexpected error', async () => {
    mockFindOne.mockRejectedValue(new Error('DB error'));
    const res = makeRes();

    await signup(makeReq({ name: 'Aram', email: 'a@b.com', password: 'pass' }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});

describe('signin', () => {
  it('returns 401 when user is not found', async () => {
    mockFindOne.mockResolvedValue(null);
    const res = makeRes();

    await signin(makeReq({ email: 'a@b.com', password: 'pass' }), res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  it('returns 401 when password does not match', async () => {
    mockFindOne.mockResolvedValue({ _id: '1', passwordHash: 'hash' });
    mockCompare.mockResolvedValue(false);
    const res = makeRes();

    await signin(makeReq({ email: 'a@b.com', password: 'wrong' }), res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  it('returns 200 with token and user on successful sign-in', async () => {
    const mockUser = { _id: 'uid2', name: 'Aram', email: 'a@b.com', passwordHash: 'hash' };
    mockFindOne.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(true);
    mockSign.mockReturnValue('jwt-token-2');
    const res = makeRes();

    await signin(makeReq({ email: 'a@b.com', password: 'pass' }), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'jwt-token-2',
      user: { id: 'uid2', name: 'Aram', email: 'a@b.com' },
    });
  });

  it('returns 500 on unexpected error', async () => {
    mockFindOne.mockRejectedValue(new Error('DB error'));
    const res = makeRes();

    await signin(makeReq({ email: 'a@b.com', password: 'pass' }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});
