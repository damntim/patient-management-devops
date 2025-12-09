// tests/app.test.js
const request = require('supertest');
const app = require('../backend/server');

describe('Patient Management API Tests', () => {
  
  // Test health endpoint
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  // Test get all patients
  describe('GET /api/patients', () => {
    it('should return all patients', async () => {
      const response = await request(app).get('/api/patients');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('count');
    });
  });

  // Test create patient
  describe('POST /api/patients', () => {
    it('should create a new patient with valid data', async () => {
      const newPatient = {
        name: 'Test Patient',
        age: 30,
        gender: 'Male',
        contact: '+250788999888'
      };

      const response = await request(app)
        .post('/api/patients')
        .send(newPatient);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Patient created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newPatient.name);
    });

    it('should reject patient with missing fields', async () => {
      const invalidPatient = {
        name: 'Test Patient',
        age: 30
        // missing gender and contact
      };

      const response = await request(app)
        .post('/api/patients')
        .send(invalidPatient);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject patient with invalid age', async () => {
      const invalidPatient = {
        name: 'Test Patient',
        age: 200,
        gender: 'Male',
        contact: '+250788999888'
      };

      const response = await request(app)
        .post('/api/patients')
        .send(invalidPatient);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid age');
    });
  });

  // Test get statistics
  describe('GET /api/stats', () => {
    it('should return statistics', async () => {
      const response = await request(app).get('/api/stats');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalPatients');
      expect(response.body.data).toHaveProperty('averageAge');
      expect(response.body.data).toHaveProperty('genderDistribution');
    });
  });

  // Test 404 handling
  describe('GET /api/invalid-route', () => {
    it('should return 404 for invalid routes', async () => {
      const response = await request(app).get('/api/invalid-route');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});