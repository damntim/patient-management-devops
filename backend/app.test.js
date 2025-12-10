// tests/app.test.js
const request = require('supertest');
const app = require('../backend/server');

describe('Patient Management API Tests', () => {
  let createdPatientId;
  
  // Test health endpoint
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should have valid timestamp format', async () => {
      const response = await request(app).get('/health');
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
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

    it('should return patients with correct structure', async () => {
      const response = await request(app).get('/api/patients');
      if (response.body.data.length > 0) {
        const patient = response.body.data[0];
        expect(patient).toHaveProperty('id');
        expect(patient).toHaveProperty('name');
        expect(patient).toHaveProperty('age');
        expect(patient).toHaveProperty('gender');
        expect(patient).toHaveProperty('contact');
      }
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
      
      createdPatientId = response.body.data.id;
    });

    it('should reject patient with missing fields', async () => {
      const invalidPatient = {
        name: 'Test Patient',
        age: 30
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

    it('should reject patient with negative age', async () => {
      const invalidPatient = {
        name: 'Test Patient',
        age: -5,
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

  // Test get single patient
  describe('GET /api/patients/:id', () => {
    it('should get a single patient by ID', async () => {
      const response = await request(app).get('/api/patients/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should return 404 for non-existent patient', async () => {
      const response = await request(app).get('/api/patients/99999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Patient not found');
    });
  });

  // Test update patient
  describe('PUT /api/patients/:id', () => {
    it('should update a patient with valid data', async () => {
      const updatedData = {
        name: 'Updated Patient',
        age: 35,
        gender: 'Female',
        contact: '+250788111222'
      };

      const response = await request(app)
        .put('/api/patients/1')
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Patient updated successfully');
    });

    it('should reject update with missing fields', async () => {
      const invalidData = {
        name: 'Updated Patient'
      };

      const response = await request(app)
        .put('/api/patients/1')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent patient', async () => {
      const updatedData = {
        name: 'Updated Patient',
        age: 35,
        gender: 'Female',
        contact: '+250788111222'
      };

      const response = await request(app)
        .put('/api/patients/99999')
        .send(updatedData);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Patient not found');
    });
  });

  // Test delete patient
  describe('DELETE /api/patients/:id', () => {
    it('should return 404 when deleting non-existent patient', async () => {
      const response = await request(app).delete('/api/patients/99999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Patient not found');
    });

    it('should delete a patient', async () => {
      if (createdPatientId) {
        const response = await request(app).delete(`/api/patients/${createdPatientId}`);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Patient deleted successfully');
      }
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

    it('should return valid statistics values', async () => {
      const response = await request(app).get('/api/stats');
      const stats = response.body.data;
      expect(typeof stats.totalPatients).toBe('number');
      expect(typeof stats.averageAge).toBe('number');
      expect(Array.isArray(stats.genderDistribution)).toBe(true);
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

  // Test CORS headers
  describe('CORS', () => {
    it('should have CORS headers enabled', async () => {
      const response = await request(app).get('/health');
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});