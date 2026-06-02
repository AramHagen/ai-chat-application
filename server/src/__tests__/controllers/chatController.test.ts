import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';

const mockFind = jest.fn();
const mockFindOneAndDelete = jest.fn();

jest.unstable_mockModule('../../models/Chat.js', () => ({
  default: { find: mockFind, findOneAndDelete: mockFindOneAndDelete },
}));

const { getChats, deleteChat } = await import('../../controllers/chatController.js');

const makeReq = (overrides = {}): AuthRequest =>
  ({ userId: 'user-123', params: {}, body: {}, ...overrides }) as unknown as AuthRequest;

const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (res.status as any).mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

describe('getChats', () => {
  it('returns chats sorted by createdAt descending', async () => {
    const mockChats = [{ _id: 'c1', title: 'Chat 1' }];
    mockFind.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockChats) });
    const res = makeRes();

    await getChats(makeReq(), res);

    expect(mockFind).toHaveBeenCalledWith({ userId: 'user-123' });
    expect(res.json).toHaveBeenCalledWith(mockChats);
  });

  it('returns 500 on database error', async () => {
    mockFind.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) });
    const res = makeRes();

    await getChats(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});

describe('deleteChat', () => {
  it('deletes chat and returns success message', async () => {
    mockFindOneAndDelete.mockResolvedValue({ _id: 'c1' });
    const res = makeRes();

    await deleteChat(makeReq({ params: { id: 'c1' } }), res);

    expect(mockFindOneAndDelete).toHaveBeenCalledWith({ _id: 'c1', userId: 'user-123' });
    expect(res.json).toHaveBeenCalledWith({ message: 'Chat deleted successfully' });
  });

  it('returns 404 when chat does not belong to user or does not exist', async () => {
    mockFindOneAndDelete.mockResolvedValue(null);
    const res = makeRes();

    await deleteChat(makeReq({ params: { id: 'c99' } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Chat not found' });
  });

  it('returns 500 on database error', async () => {
    mockFindOneAndDelete.mockRejectedValue(new Error('DB error'));
    const res = makeRes();

    await deleteChat(makeReq({ params: { id: 'c1' } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});
