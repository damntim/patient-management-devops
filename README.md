# Patient Management System

![CI Pipeline](https://github.com/damntim/patient-management-devops/workflows/CI%20Pipeline/badge.svg)
![Release](https://github.com/damntim/patient-management-devops/workflows/Release%20Pipeline/badge.svg)
![Version](https://img.shields.io/github/v/release/damntim/patient-management-devops)
![Docker Pulls](https://img.shields.io/docker/pulls/damntime/patient-management)
![License](https://img.shields.io/github/license/damntim/patient-management-devops)

## 📦 Installation

### Using Docker Hub (Recommended)
```bash
# Pull the latest release
docker pull damntime/patient-management:latest

# Run the container
docker run -d -p 3000:3000 -p 8000:8000 damntime/patient-management:latest

# Access the application
# Backend: http://localhost:3000
# Frontend: http://localhost:8000/index.php
```

### Using Docker Compose
```bash
# Clone the repository
git clone https://github.com/damntim/patient-management-devops.git
cd patient-management-devops

# Run with Docker Compose
docker-compose up -d
```

## 🚀 Releases

See [Releases](https://github.com/damntim/patient-management-devops/releases) for changelog and version history.

Latest version: ![Version](https://img.shields.io/github/v/release/damntim/patient-management-devops)