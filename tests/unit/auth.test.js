// tests/unit/auth.test.js
import request from 'supertest';
import app from '../../server/index.js';
import mongoose from 'mongoose';
import User from '../../server/models/User.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Connect to a test database.
    await mongoose.connect(process.env.MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toMatch(/Registration successful/i);
  });

  // Additional tests for login, forgot/reset password, etc.
});
