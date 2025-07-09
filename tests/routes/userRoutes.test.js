const request = require('supertest');
const app = require('../../app');
const { setupTestDB, clearTestDB } = require('../helpers/testDB');

describe('User Routes', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await clearTestDB();
  });

  describe('GET /users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });

    test('should require authentication', async () => {
      await request(app)
        .get('/users')
        .expect(401);
    });
  });

  describe('POST /users', () => {
    test('should create new user', async () => {
      const newItem = {
        name: 'Test User',
        description: 'Test description'
      };

      const response = await request(app)
        .post('/users')
        .send(newItem)
        .expect(201);

      expect(response.body.name).toBe(newItem.name);
      expect(response.body.id).toBeDefined();
    });

    test('should validate required fields', async () => {
      const invalidItem = {
        description: 'Missing name field'
      };

      await request(app)
        .post('/users')
        .send(invalidItem)
        .expect(400);
    });
  });

  describe('PUT /users/:id', () => {
    test('should update existing user', async () => {
      const updates = {
        name: 'Updated User',
        description: 'Updated description'
      };

      const response = await request(app)
        .put('/users/1')
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
    });

    test('should return 404 for non-existent user', async () => {
      await request(app)
        .put('/users/999')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    test('should delete user', async () => {
      await request(app)
        .delete('/users/1')
        .expect(204);
    });

    test('should return 404 for non-existent user', async () => {
      await request(app)
        .delete('/users/999')
        .expect(404);
    });
  });
});
