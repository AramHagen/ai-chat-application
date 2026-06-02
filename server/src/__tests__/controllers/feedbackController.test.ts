import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';

const mockFindByIdAndUpdate = jest.fn();

jest.unstable_mockModule('../../models/Message.js', () => ({
  default: { findByIdAndUpdate: mockFindByIdAndUpdate },
}));

const { submitFeedback } = await import('../../controllers/feedbackController.js');

const makeReq = (overrides = {}): AuthRequest =>
  ({ userId: 'user-123', params: {}, body: {}, ...overrides }) as unknown as AuthRequest;

const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (res.status as any).mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

describe('submitFeedback', () => {
  it('returns 400 for an invalid feedback value', async () => {
    const res = makeRes();

    await submitFeedback(
      makeReq({ params: { messageId: 'msg-1' }, body: { feedback: 'neutral' } }),
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Feedback must be positive or negative' });
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 404 when message is not found', async () => {
    mockFindByIdAndUpdate.mockResolvedValue(null);
    const res = makeRes();

    await submitFeedback(
      makeReq({ params: { messageId: 'msg-1' }, body: { feedback: 'positive' } }),
      res,
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Message not found' });
  });

  it('updates and returns 200 for positive feedback', async () => {
    const mockMessage = { _id: 'msg-1', feedback: 'positive' };
    mockFindByIdAndUpdate.mockResolvedValue(mockMessage);
    const res = makeRes();

    await submitFeedback(
      makeReq({ params: { messageId: 'msg-1' }, body: { feedback: 'positive' } }),
      res,
    );

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'msg-1',
      { feedback: 'positive' },
      { new: true },
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Feedback submitted successfully',
      data: mockMessage,
    });
  });

  it('updates and returns 200 for negative feedback', async () => {
    const mockMessage = { _id: 'msg-1', feedback: 'negative' };
    mockFindByIdAndUpdate.mockResolvedValue(mockMessage);
    const res = makeRes();

    await submitFeedback(
      makeReq({ params: { messageId: 'msg-1' }, body: { feedback: 'negative' } }),
      res,
    );

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'msg-1',
      { feedback: 'negative' },
      { new: true },
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Feedback submitted successfully',
      data: mockMessage,
    });
  });

  it('returns 500 on unexpected error', async () => {
    mockFindByIdAndUpdate.mockRejectedValue(new Error('DB error'));
    const res = makeRes();

    await submitFeedback(
      makeReq({ params: { messageId: 'msg-1' }, body: { feedback: 'positive' } }),
      res,
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});
