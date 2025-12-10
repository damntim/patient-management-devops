// tests/integration.test.js
const request = require('supertest');
const app = require('../backend/server');

describe('Integration Tests - Patient Workflow', () => {
  let testPatientId;

  describe('Complete Patient Lifecycle', () => {
    it('should create, read, update, and delete a patient', async () => {
      // Step 1: Create a patient
      const newPatient = {
        name: 'Integration Test Patient',
        age: 28,
        gender: 'Female',
        contact: '+250788555666'
      };

      const createResponse = await request(app)
        .post('/api/patients')
        .send(newPatient);
      
      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);
      testPatientId = createResponse.body.data.id;

      // Step 2: Read the patient
      const getResponse = await request(app)
        .get(`/api/patients/${testPatientId}`);
      
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data.name).toBe(newPatient.name);
      expect(getResponse.body.data.age).toBe(newPatient.age);

      // Step 3: Update the patient
      const updatedData = {
        name: 'Updated Integration Patient',
        age: 29,
        gender: 'Female',
        contact: '+250788555777'
      };

      const updateResponse = await request(app)
        .put(`/api/patients/${testPatientId}`)
        .send(updatedData);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);

      // Step 4: Verify update
      const verifyResponse = await request(app)
        .get(`/api/patients/${testPatientId}`);
      
      expect(verifyResponse.body.data.name).toBe(updatedData.name);
      expect(verifyResponse.body.data.age).toBe(updatedData.age);

      // Step 5: Delete the patient
      const deleteResponse = await request(app)
        .delete(`/api/patients/${testPatientId}`);
      
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // Step 6: Verify deletion
      const verifyDeleteResponse = await request(app)
        .get(`/api/patients/${testPatientId}`);
      
      expect(verifyDeleteResponse.status).toBe(404);
    });
  });

  describe('Statistics Update After Operations', () => {
    it('should update statistics after creating a patient', async () => {
      // Get initial stats
      const initialStats = await request(app).get('/api/stats');
      const initialCount = initialStats.body.data.totalPatients;

      // Create a patient
      const newPatient = {
        name: 'Stats Test Patient',
        age: 40,
        gender: 'Male',
        contact: '+250788444555'
      };

      const createResponse = await request(app)
        .post('/api/patients')
        .send(newPatient);
      
      const createdId = createResponse.body.data.id;

      // Get updated stats
      const updatedStats = await request(app).get('/api/stats');
      const updatedCount = updatedStats.body.data.totalPatients;

      expect(updatedCount).toBe(initialCount + 1);

      // Cleanup
      await request(app).delete(`/api/patients/${createdId}`);
    });
  });

  describe('Multiple Operations Concurrently', () => {
    it('should handle multiple patient creations', async () => {
      const patients = [
        { name: 'Patient 1', age: 25, gender: 'Male', contact: '+250788111111' },
        { name: 'Patient 2', age: 30, gender: 'Female', contact: '+250788222222' },
        { name: 'Patient 3', age: 35, gender: 'Male', contact: '+250788333333' }
      ];

      const promises = patients.map(patient =>
        request(app).post('/api/patients').send(patient)
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      // Cleanup
      const cleanupPromises = responses.map(response =>
        request(app).delete(`/api/patients/${response.body.data.id}`)
      );

      await Promise.all(cleanupPromises);
    });
  });

  describe('Error Handling Workflow', () => {
    it('should handle invalid operations gracefully', async () => {
      // Try to update non-existent patient
      const updateResponse = await request(app)
        .put('/api/patients/99999')
        .send({ name: 'Test', age: 30, gender: 'Male', contact: '+250788999999' });
      
      expect(updateResponse.status).toBe(404);

      // Try to delete non-existent patient
      const deleteResponse = await request(app)
        .delete('/api/patients/99999');
      
      expect(deleteResponse.status).toBe(404);

      // Try to create patient with invalid data
      const createResponse = await request(app)
        .post('/api/patients')
        .send({ name: 'Invalid' });
      
      expect(createResponse.status).toBe(400);
    });
  });

  describe('API Response Time', () => {
    it('should respond to health check within 100ms', async () => {
      const start = Date.now();
      await request(app).get('/health');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });

    it('should respond to patient list within 200ms', async () => {
      const start = Date.now();
      await request(app).get('/api/patients');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(200);
    });
  });
});