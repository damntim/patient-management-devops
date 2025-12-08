// frontend/api.php (This is actually JavaScript - save as api.js)
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastDiv = toast.querySelector('div');
    
    toastMessage.textContent = message;
    
    // Set color based on type
    if (type === 'success') {
        toastDiv.className = 'bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg fade-in';
    } else if (type === 'error') {
        toastDiv.className = 'bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg fade-in';
    }
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Check system health
async function checkHealth() {
    try {
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        
        if (data.status === 'healthy') {
            document.getElementById('systemStatus').innerHTML = '● <span class="text-green-600">Healthy</span>';
        } else {
            document.getElementById('systemStatus').innerHTML = '● <span class="text-red-600">Unhealthy</span>';
        }
    } catch (error) {
        document.getElementById('systemStatus').innerHTML = '● <span class="text-red-600">Offline</span>';
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalPatients').textContent = data.data.totalPatients;
            document.getElementById('averageAge').textContent = data.data.averageAge;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load all patients
async function loadPatients() {
    const loading = document.getElementById('loading');
    const tableBody = document.getElementById('patientsTableBody');
    
    loading.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/patients`);
        const data = await response.json();
        
        loading.classList.add('hidden');
        
        if (data.success && data.data.length > 0) {
            tableBody.innerHTML = data.data.map(patient => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${patient.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.age}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.gender}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.contact}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            onclick="editPatient(${patient.id})" 
                            class="text-blue-600 hover:text-blue-900 mr-3">
                            Edit
                        </button>
                        <button 
                            onclick="deletePatient(${patient.id})" 
                            class="text-red-600 hover:text-red-900">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        No patients found. Add your first patient above!
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        loading.classList.add('hidden');
        console.error('Error loading patients:', error);
        showToast('Failed to load patients', 'error');
        
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-red-500">
                    Error loading patients. Make sure the backend server is running on port 3000.
                </td>
            </tr>
        `;
    }
}

// Add new patient
async function addPatient(patientData) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Patient added successfully!', 'success');
            document.getElementById('patientForm').reset();
            loadPatients();
            loadStatistics();
        } else {
            showToast(data.error || 'Failed to add patient', 'error');
        }
    } catch (error) {
        console.error('Error adding patient:', error);
        showToast('Failed to add patient', 'error');
    }
}

// Delete patient
async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Patient deleted successfully!', 'success');
            loadPatients();
            loadStatistics();
        } else {
            showToast(data.error || 'Failed to delete patient', 'error');
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        showToast('Failed to delete patient', 'error');
    }
}

// Edit patient (simplified version - just prompts for new data)
async function editPatient(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const patient = data.data;
            
            // Fill form with existing data
            document.getElementById('name').value = patient.name;
            document.getElementById('age').value = patient.age;
            document.getElementById('gender').value = patient.gender;
            document.getElementById('contact').value = patient.contact;
            
            // Change form behavior to update instead of create
            const form = document.getElementById('patientForm');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Patient';
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            
            form.onsubmit = async (e) => {
                e.preventDefault();
                
                const updatedData = {
                    name: document.getElementById('name').value,
                    age: parseInt(document.getElementById('age').value),
                    gender: document.getElementById('gender').value,
                    contact: document.getElementById('contact').value
                };
                
                const updateResponse = await fetch(`${API_BASE_URL}/patients/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData)
                });
                
                const updateData = await updateResponse.json();
                
                if (updateData.success) {
                    showToast('Patient updated successfully!', 'success');
                    form.reset();
                    submitBtn.textContent = 'Add Patient';
                    submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    form.onsubmit = handleFormSubmit;
                    loadPatients();
                    loadStatistics();
                } else {
                    showToast(updateData.error || 'Failed to update patient', 'error');
                }
            };
            
            // Scroll to form
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } catch (error) {
        console.error('Error loading patient for edit:', error);
        showToast('Failed to load patient data', 'error');
    }
}

// Form submit handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const patientData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        contact: document.getElementById('contact').value
    };
    
    addPatient(patientData);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    checkHealth();
    loadStatistics();
    loadPatients();
    
    // Setup form
    document.getElementById('patientForm').addEventListener('submit', handleFormSubmit);
    
    // Setup reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('patientForm').reset();
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add Patient';
        submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        document.getElementById('patientForm').onsubmit = handleFormSubmit;
    });
    
    // Refresh data every 30 seconds
    setInterval(() => {
        checkHealth();
        loadStatistics();
    }, 30000);
});