import { jest, describe, it, expect } from '@jest/globals';

jest.unstable_mockModule('../middleware/auth.js', () => ({
  default: jest.fn((_req: any, _res: any, next: any) => next()),
}));

jest.unstable_mockModule('../controllers/authController.js', () => ({
  signup: jest.fn((_req: any, res: any) => res.status(201).json({ token: 'tok' })),
  signin: jest.fn((_req: any, res: any) => res.status(200).json({ token: 'tok' })),
}));

jest.unstable_mockModule('../controllers/chatController.js', () => ({
  getChats: jest.fn((_req: any, res: any) => res.json([])),
  deleteChat: jest.fn((_req: any, res: any) => res.json({ message: 'deleted' })),
}));

jest.unstable_mockModule('../controllers/messageController.js', () => ({
  getMessages: jest.fn((_req: any, res: any) => res.json([])),
  sendFirstMessage: jest.fn((_req: any, res: any) => res.status(201).json({})),
  sendMessage: jest.fn((_req: any, res: any) => res.status(201).json({})),
}));

jest.unstable_mockModule('../controllers/feedbackController.js', () => ({
  submitFeedback: jest.fn((_req: any, res: any) => res.json({ message: 'ok' })),
}));

const { default: app } = await import('../app.js');
const { default: request } = await import('supertest');

describe('app routing', () => {
  describe('GET /api/health', () => {
    it('returns 200 with server running message', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Server is running!' });
    });
  });

  describe('404 handler', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await request(app).get('/api/does-not-exist');
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Route not found');
    });

    it('returns 404 for unknown methods on unknown paths', async () => {
      const res = await request(app).put('/api/unknown');
      expect(res.status).toBe(404);
    });
  });

  describe('public auth routes', () => {
    it('POST /api/auth/signup is reachable without a token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Aram', email: 'a@b.com', password: 'pass' });
      expect(res.status).toBe(201);
    });

    it('POST /api/auth/signin is reachable without a token', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({ email: 'a@b.com', password: 'pass' });
      expect(res.status).toBe(200);
    });
  });

  describe('protected routes (auth middleware mocked to pass)', () => {
    it('GET /api/chats returns 200', async () => {
      const res = await request(app).get('/api/chats');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('DELETE /api/chats/:id returns 200', async () => {
      const res = await request(app).delete('/api/chats/chat-1');
      expect(res.status).toBe(200);
    });

    it('POST /api/chats/messages returns 201', async () => {
      const res = await request(app).post('/api/chats/messages').send({ content: 'Hello' });
      expect(res.status).toBe(201);
    });

    it('GET /api/chats/:chatId/messages returns 200', async () => {
      const res = await request(app).get('/api/chats/chat-1/messages');
      expect(res.status).toBe(200);
    });

    it('POST /api/chats/:chatId/messages returns 201', async () => {
      const res = await request(app)
        .post('/api/chats/chat-1/messages')
        .send({ content: 'Follow up' });
      expect(res.status).toBe(201);
    });

    it('POST /api/messages/:messageId/feedback returns 200', async () => {
      const res = await request(app)
        .post('/api/messages/msg-1/feedback')
        .send({ feedback: 'positive' });
      expect(res.status).toBe(200);
    });
  });
});
