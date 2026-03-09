const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app'); // Твоят Express app
const User = require('../../models/User.model');
const ChatbotMessage = require('../../models/ChatbotMessage.model');
const jwt = require('jsonwebtoken');

jest.mock('groq-sdk');
const Groq = require('groq-sdk');
const { generateTestToken } = require('../setup/testHelpers');

describe('Chatbot Controller Integration Tests', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      username: 'testyser',
      email: 'test@example.com',
      password: 'hashedpassword123',
      totalCredits: 1000
    });

    authToken = generateTestToken('user123');

    const mockGroqInstance = Groq.mock.results[0]?.value;
    if (mockGroqInstance) {
      mockGroqInstance.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Това е тестов отговор от AI'
            }
          }
        ]
      });
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /server/v1/chatbot', () => {
    test('should return 400 if message is missing', async () => {
      const response = await request(app)
        .post('/server/v1/chatbot')
        .send({ userId: testUser._id });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Message is required');
    });

    test('should handle guest user (no userId) successfully', async () => {
      const response = await request(app)
        .post('/server/v1/chatbot')
        .send({ message: 'Hello AI' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(response.body.guestMode).toBe(true);
      expect(response.body).toHaveProperty('timestamp');

      // Проверка че не е запазено в базата
      const savedMessages = await ChatbotMessage.find();
      expect(savedMessages.length).toBe(0);
    });

  //   test('should handle authenticated user successfully', async () => {
  //     const response = await request(app)
  //       .post('/server/v1/chatbot')
  //       .send({ 
  //         message: 'Hello AI',
  //         userId: testUser._id.toString()
  //       });

  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty('response');
  //     expect(response.body.guestMode).toBe(false);
  //     expect(response.body).toHaveProperty('timestamp');

  //     // Проверка че съобщението е запазено
  //     const savedMessages = await ChatbotMessage.find({ userId: testUser._id });
  //     expect(savedMessages.length).toBe(1);
  //     expect(savedMessages[0].userMessage).toBe('Hello AI');
  //     expect(savedMessages[0].aiResponse).toBe('Това е тестов отговор от AI');
  //   });

  //   test('should handle user not found in database', async () => {
  //     const nonExistentUserId = new mongoose.Types.ObjectId();
      
  //     const response = await request(app)
  //       .post('/server/v1/chatbot')
  //       .send({ 
  //         message: 'Hello AI',
  //         userId: nonExistentUserId.toString()
  //       });

  //     expect(response.status).toBe(200);
  //     expect(response.body.guestMode).toBe(true); // Трябва да е guest режим
  //   });

  //   test('should handle Groq API error', async () => {
  //     // Mock-ване на грешка от Groq
  //     const mockGroqInstance = Groq.mock.results[0]?.value;
  //     mockGroqInstance.chat.completions.create.mockRejectedValue(
  //       new Error('API Error')
  //     );

  //     const response = await request(app)
  //       .post('/server/v1/chatbot')
  //       .send({ 
  //         message: 'Hello AI',
  //         userId: testUser._id.toString()
  //       });

  //     expect(response.status).toBe(500);
  //     expect(response.body.message).toBe('AI service unavailable');
  //   });

  //   test('should include user credits in system prompt for authenticated user', async () => {
  //     await request(app)
  //       .post('/server/v1/chatbot')
  //       .send({ 
  //         message: 'How many credits do I have?',
  //         userId: testUser._id.toString()
  //       });

  //     // Проверка че правилният prompt е изпратен към Groq
  //     const mockGroqInstance = Groq.mock.results[0]?.value;
  //     const calls = mockGroqInstance.chat.completions.create.mock.calls;
      
  //     expect(calls.length).toBe(1);
  //     const systemMessage = calls[0][0].messages[0];
  //     expect(systemMessage.role).toBe('system');
  //     expect(systemMessage.content).toContain(testUser.firstName);
  //     expect(systemMessage.content).toContain(testUser.totalCredits.toString());
  //   });
  // });

  // describe('GET /server/v1/chatbot', () => {
  //   beforeEach(async () => {
  //     // Създаване на тестови съобщения
  //     await ChatbotMessage.create([
  //       {
  //         userId: testUser._id,
  //         userMessage: 'First message',
  //         aiResponse: 'First response',
  //         timeStamp: new Date()
  //       },
  //       {
  //         userId: testUser._id,
  //         userMessage: 'Second message',
  //         aiResponse: 'Second response',
  //         timeStamp: new Date()
  //       }
  //     ]);
  //   });

  //   test('should return 401 if not authenticated', async () => {
  //     const response = await request(app)
  //       .get('/server/v1/chatbot');

  //     expect(response.status).toBe(401);
  //   });

  //   test('should return conversation history for authenticated user', async () => {
  //     const response = await request(app)
  //       .get('/server/v1/chatbot')
  //       .set('Authorization', `Bearer ${authToken}`);

  //     expect(response.status).toBe(200);
  //     expect(Array.isArray(response.body)).toBe(true);
  //     expect(response.body.length).toBe(2);
  //     expect(response.body[0]).toHaveProperty('userMessage');
  //     expect(response.body[0]).toHaveProperty('aiResponse');
  //     expect(response.body[0]).toHaveProperty('timeStamp');
  //     expect(response.body[0]).not.toHaveProperty('userId'); // Да няма userId в response
  //   });

  //   test('should limit to 100 messages', async () => {
  //     // Създаване на 150 съобщения
  //     const messages = Array(150).fill(null).map((_, i) => ({
  //       userId: testUser._id,
  //       userMessage: `Message ${i}`,
  //       aiResponse: `Response ${i}`,
  //       timeStamp: new Date()
  //     }));
  //     await ChatbotMessage.insertMany(messages);

  //     const response = await request(app)
  //       .get('/server/v1/chatbot')
  //       .set('Authorization', `Bearer ${authToken}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body.length).toBe(100); // Трябва да е лимитирано до 100
  //   });

  //   test('should return empty array for user with no history', async () => {
  //     // Изтриване на всички съобщения
  //     await ChatbotMessage.deleteMany({});

  //     const response = await request(app)
  //       .get('/server/v1/chatbot')
  //       .set('Authorization', `Bearer ${authToken}`);

  //     expect(response.status).toBe(200);
  //     expect(Array.isArray(response.body)).toBe(true);
  //     expect(response.body.length).toBe(0);
  //   });
  // });

  // describe('DELETE /server/v1/chatbot', () => {
  //   beforeEach(async () => {
  //     await ChatbotMessage.create([
  //       {
  //         userId: testUser._id,
  //         userMessage: 'Message to delete',
  //         aiResponse: 'Response to delete',
  //         timeStamp: new Date()
  //       }
  //     ]);
  //   });

  //   test('should return 401 if not authenticated', async () => {
  //     const response = await request(app)
  //       .delete('/server/v1/chatbot');

  //     expect(response.status).toBe(401);
  //   });

  //   test('should delete conversation history for authenticated user', async () => {
  //     // Проверка че има съобщения преди изтриване
  //     const beforeDelete = await ChatbotMessage.find({ userId: testUser._id });
  //     expect(beforeDelete.length).toBe(1);

  //     const response = await request(app)
  //       .delete('/server/v1/chatbot')
  //       .set('Authorization', `Bearer ${authToken}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe('Successfully deleted conversation history');

  //     // Проверка че съобщенията са изтрити
  //     const afterDelete = await ChatbotMessage.find({ userId: testUser._id });
  //     expect(afterDelete.length).toBe(0);
  //   });

  //   test('should not delete messages from other users', async () => {
  //     // Създаване на друг потребител и негови съобщения
  //     const otherUser = await User.create({
  //       firstName: 'Other',
  //       lastName: 'User',
  //       email: 'other@example.com',
  //       password: 'hashedpassword123'
  //     });

  //     await ChatbotMessage.create({
  //       userId: otherUser._id,
  //       userMessage: 'Other user message',
  //       aiResponse: 'Other user response',
  //       timeStamp: new Date()
  //     });

  //     // Изтриване на съобщенията на първия потребител
  //     await request(app)
  //       .delete('/server/v1/chatbot')
  //       .set('Authorization', `Bearer ${authToken}`);

  //     // Проверка че съобщенията на другия потребител все още съществуват
  //     const otherUserMessages = await ChatbotMessage.find({ userId: otherUser._id });
  //     expect(otherUserMessages.length).toBe(1);
  //   });
  // });
});
})