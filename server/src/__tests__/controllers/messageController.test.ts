import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';

const mockMessageFind = jest.fn();
const mockMessageCreate = jest.fn();
const mockChatCreate = jest.fn();
const mockChatFindById = jest.fn();
const mockGroqCreate = jest.fn();

jest.unstable_mockModule('../../models/Message.js', () => ({
  default: { find: mockMessageFind, create: mockMessageCreate },
}));

jest.unstable_mockModule('../../models/Chat.js', () => ({
  default: { create: mockChatCreate, findById: mockChatFindById },
}));

jest.unstable_mockModule('../../config/groq.js', () => ({
  default: { chat: { completions: { create: mockGroqCreate } } },
}));

const { getMessages, sendFirstMessage, sendMessage } =
  await import('../../controllers/messageController.js');

const makeReq = (overrides = {}): AuthRequest =>
  ({ userId: 'user-123', params: {}, body: {}, ...overrides }) as unknown as AuthRequest;

const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (res.status as any).mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

describe('getMessages', () => {
  it('returns messages for a chat sorted chronologically', async () => {
    const mockMessages = [{ _id: 'm1', content: 'Hello' }];
    mockMessageFind.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockMessages) });
    const res = makeRes();

    await getMessages(makeReq({ params: { chatId: 'chat-1' } }), res);

    expect(mockMessageFind).toHaveBeenCalledWith({ chatId: 'chat-1' });
    expect(res.json).toHaveBeenCalledWith(mockMessages);
  });

  it('returns 500 on database error', async () => {
    mockMessageFind.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) });
    const res = makeRes();

    await getMessages(makeReq({ params: { chatId: 'chat-1' } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});

describe('sendFirstMessage', () => {
  it('creates chat and both messages, returns 201', async () => {
    const mockChat = { _id: 'chat-1', title: 'What is TypeScript?' };
    const mockUserMsg = { _id: 'msg1', role: 'user', content: 'What is TypeScript?' };
    const mockAssistantMsg = { _id: 'msg2', role: 'assistant', content: 'TypeScript is...' };

    mockChatCreate.mockResolvedValue(mockChat);
    mockMessageCreate.mockResolvedValueOnce(mockUserMsg).mockResolvedValueOnce(mockAssistantMsg);
    mockGroqCreate.mockResolvedValue({ choices: [{ message: { content: 'TypeScript is...' } }] });
    const res = makeRes();

    await sendFirstMessage(makeReq({ body: { content: 'What is TypeScript?' } }), res);

    expect(mockChatCreate).toHaveBeenCalledWith({
      title: 'What is TypeScript?',
      userId: 'user-123',
    });
    expect(mockMessageCreate).toHaveBeenNthCalledWith(1, {
      chatId: 'chat-1',
      role: 'user',
      content: 'What is TypeScript?',
    });
    expect(mockMessageCreate).toHaveBeenNthCalledWith(2, {
      chatId: 'chat-1',
      role: 'assistant',
      content: 'TypeScript is...',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      chat: mockChat,
      userMessage: mockUserMsg,
      assistantMessage: mockAssistantMsg,
    });
  });

  it('truncates chat title to 50 chars with ellipsis for long messages', async () => {
    const longContent = 'A'.repeat(60);
    mockChatCreate.mockResolvedValue({ _id: 'chat-2' });
    mockMessageCreate.mockResolvedValueOnce({ _id: 'msg3' }).mockResolvedValueOnce({ _id: 'msg4' });
    mockGroqCreate.mockResolvedValue({ choices: [{ message: { content: 'AI response' } }] });
    const res = makeRes();

    await sendFirstMessage(makeReq({ body: { content: longContent } }), res);

    expect(mockChatCreate).toHaveBeenCalledWith({
      title: 'A'.repeat(50) + '...',
      userId: 'user-123',
    });
  });

  it('uses fallback text when AI returns no content', async () => {
    mockChatCreate.mockResolvedValue({ _id: 'chat-3' });
    mockMessageCreate.mockResolvedValueOnce({ _id: 'msg5' }).mockResolvedValueOnce({ _id: 'msg6' });
    mockGroqCreate.mockResolvedValue({ choices: [] });
    const res = makeRes();

    await sendFirstMessage(makeReq({ body: { content: 'Hi' } }), res);

    expect(mockMessageCreate).toHaveBeenNthCalledWith(2, {
      chatId: 'chat-3',
      role: 'assistant',
      content: 'No response from AI',
    });
  });

  it('returns 500 on error', async () => {
    mockChatCreate.mockRejectedValue(new Error('DB error'));
    const res = makeRes();

    await sendFirstMessage(makeReq({ body: { content: 'Hello' } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('sendMessage', () => {
  it('returns 404 when chat does not exist', async () => {
    mockChatFindById.mockResolvedValue(null);
    const res = makeRes();

    await sendMessage(makeReq({ params: { chatId: 'chat-1' }, body: { content: 'Hi' } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Chat not found' });
  });

  it('sends full conversation history to Groq and returns 201', async () => {
    const prevMessages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' },
    ];
    const mockUserMsg = { _id: 'msg7', role: 'user', content: 'Follow up' };
    const mockAssistantMsg = { _id: 'msg8', role: 'assistant', content: 'AI reply' };

    mockChatFindById.mockResolvedValue({ _id: 'chat-1' });
    mockMessageFind.mockReturnValue({ sort: jest.fn().mockResolvedValue(prevMessages) });
    mockMessageCreate.mockResolvedValueOnce(mockUserMsg).mockResolvedValueOnce(mockAssistantMsg);
    mockGroqCreate.mockResolvedValue({ choices: [{ message: { content: 'AI reply' } }] });
    const res = makeRes();

    await sendMessage(
      makeReq({ params: { chatId: 'chat-1' }, body: { content: 'Follow up' } }),
      res,
    );

    expect(mockGroqCreate).toHaveBeenCalledWith({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' },
        { role: 'user', content: 'Follow up' },
      ],
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      userMessage: mockUserMsg,
      assistantMessage: mockAssistantMsg,
    });
  });

  it('returns 500 on database error', async () => {
    mockChatFindById.mockRejectedValue(new Error('DB error'));
    const res = makeRes();

    await sendMessage(makeReq({ params: { chatId: 'chat-1' }, body: { content: 'Hi' } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
