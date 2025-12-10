// tests/database.test.js
const db = require('../backend/database');

describe('Database Operations Tests', () => {
  let testPatientId;

  describe('Create Patient', () => {
    it('should create a patient and return ID', (done) => {
      const patient = {
        name: 'DB Test Patient',
        age: 45,
        gender: 'Male',
        contact: '+250788777888'
      };

      db.createPatient(patient, (err, id) => {
        expect(err).toBeNull();
        expect(id).toBeDefined();
        expect(typeof id).toBe('number');
        testPatientId = id;
        done();
      });
    });
  });

  describe('Get All Patients', () => {
    it('should return an array of patients', (done) => {
      db.getAllPatients((err, patients) => {
        expect(err).toBeNull();
        expect(Array.isArray(patients)).toBe(true);
        expect(patients.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should return patients with correct structure', (done) => {
      db.getAllPatients((err, patients) => {
        if (patients.length > 0) {
          const patient = patients[0];
          expect(patient).toHaveProperty('id');
          expect(patient).toHaveProperty('name');
          expect(patient).toHaveProperty('age');
          expect(patient).toHaveProperty('gender');
          expect(patient).toHaveProperty('contact');
        }
        done();
      });
    });
  });

  describe('Get Patient By ID', () => {
    it('should return a single patient', (done) => {
      if (testPatientId) {
        db.getPatientById(testPatientId, (err, patient) => {
          expect(err).toBeNull();
          expect(patient).toBeDefined();
          expect(patient.id).toBe(testPatientId);
          done();
        });
      } else {
        done();
      }
    });

    it('should return null for non-existent ID', (done) => {
      db.getPatientById(99999, (err, patient) => {
        expect(err).toBeNull();
        expect(patient).toBeUndefined();
        done();
      });
    });
  });

  describe('Update Patient', () => {
    it('should update patient successfully', (done) => {
      if (testPatientId) {
        const updatedData = {
          name: 'Updated DB Patient',
          age: 46,
          gender: 'Male',
          contact: '+250788777999'
        };

        db.updatePatient(testPatientId, updatedData, (err, changes) => {
          expect(err).toBeNull();
          expect(changes).toBe(1);
          done();
        });
      } else {
        done();
      }
    });

    it('should return 0 changes for non-existent patient', (done) => {
      const updatedData = {
        name: 'Non-existent',
        age: 30,
        gender: 'Male',
        contact: '+250788999999'
      };

      db.updatePatient(99999, updatedData, (err, changes) => {
        expect(err).toBeNull();
        expect(changes).toBe(0);
        done();
      });
    });
  });

  describe('Get Statistics', () => {
    it('should return valid statistics', (done) => {
      db.getStatistics((err, stats) => {
        expect(err).toBeNull();
        expect(stats).toHaveProperty('totalPatients');
        expect(stats).toHaveProperty('genderDistribution');
        expect(stats).toHaveProperty('averageAge');
        expect(typeof stats.totalPatients).toBe('number');
        expect(Array.isArray(stats.genderDistribution)).toBe(true);
        done();
      });
    });

    it('should have correct gender distribution structure', (done) => {
      db.getStatistics((err, stats) => {
        if (stats.genderDistribution.length > 0) {
          const distribution = stats.genderDistribution[0];
          expect(distribution).toHaveProperty('gender');
          expect(distribution).toHaveProperty('count');
        }
        done();
      });
    });
  });

  describe('Delete Patient', () => {
    it('should delete patient successfully', (done) => {
      if (testPatientId) {
        db.deletePatient(testPatientId, (err, changes) => {
          expect(err).toBeNull();
          expect(changes).toBe(1);
          done();
        });
      } else {
        done();
      }
    });

    it('should return 0 changes for non-existent patient', (done) => {
      db.deletePatient(99999, (err, changes) => {
        expect(err).toBeNull();
        expect(changes).toBe(0);
        done();
      });
    });
  });
});