// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'patients.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      contact TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('✅ Patients table ready');
      insertSampleData();
    }
  });
}

// Insert sample data if table is empty
function insertSampleData() {
  db.get('SELECT COUNT(*) as count FROM patients', [], (err, row) => {
    if (err) {
      console.error('Error checking data:', err);
      return;
    }
    
    if (row.count === 0) {
      const samplePatients = [
        { name: 'John Doe', age: 45, gender: 'Male', contact: '+250788123456' },
        { name: 'Jane Smith', age: 32, gender: 'Female', contact: '+250788654321' },
        { name: 'Bob Johnson', age: 58, gender: 'Male', contact: '+250788111222' }
      ];

      const stmt = db.prepare(`
        INSERT INTO patients (name, age, gender, contact) 
        VALUES (?, ?, ?, ?)
      `);

      samplePatients.forEach(patient => {
        stmt.run(patient.name, patient.age, patient.gender, patient.contact);
      });

      stmt.finalize((err) => {
        if (!err) {
          console.log('✅ Sample data inserted');
        }
      });
    }
  });
}

// Database operations
const dbOperations = {
  // Get all patients
  getAllPatients: (callback) => {
    db.all('SELECT * FROM patients ORDER BY created_at DESC', [], callback);
  },

  // Get patient by ID
  getPatientById: (id, callback) => {
    db.get('SELECT * FROM patients WHERE id = ?', [id], callback);
  },

  // Create new patient
  createPatient: (patient, callback) => {
    const { name, age, gender, contact } = patient;
    db.run(
      'INSERT INTO patients (name, age, gender, contact) VALUES (?, ?, ?, ?)',
      [name, age, gender, contact],
      function(err) {
        callback(err, this.lastID);
      }
    );
  },

  // Update patient
  updatePatient: (id, patient, callback) => {
    const { name, age, gender, contact } = patient;
    db.run(
      `UPDATE patients 
       SET name = ?, age = ?, gender = ?, contact = ?, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, age, gender, contact, id],
      function(err) {
        callback(err, this.changes);
      }
    );
  },

  // Delete patient
  deletePatient: (id, callback) => {
    db.run('DELETE FROM patients WHERE id = ?', [id], function(err) {
      callback(err, this.changes);
    });
  },

  // Get statistics
  getStatistics: (callback) => {
    const stats = {};
    
    // Total patients
    db.get('SELECT COUNT(*) as total FROM patients', [], (err, row) => {
      if (err) return callback(err);
      stats.totalPatients = row.total;

      // Gender distribution
      db.all('SELECT gender, COUNT(*) as count FROM patients GROUP BY gender', [], (err, rows) => {
        if (err) return callback(err);
        stats.genderDistribution = rows;

        // Average age
        db.get('SELECT AVG(age) as avgAge FROM patients', [], (err, row) => {
          if (err) return callback(err);
          stats.averageAge = Math.round(row.avgAge || 0);

          callback(null, stats);
        });
      });
    });
  },

  // Close database connection
  close: () => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('✅ Database connection closed');
      }
    });
  }
};

module.exports = dbOperations;