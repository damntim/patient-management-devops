# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Features that are in development

### Changed
- Changes to existing functionality

### Deprecated
- Features that will be removed in upcoming releases

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security updates and fixes

---

## [1.0.0] - 2024-12-09

### Added
- Initial release of Patient Management System
- Complete DevOps pipeline implementation
- REST API with Express.js
- SQLite database integration
- PHP frontend with Tailwind CSS
- Docker containerization
- GitHub Actions CI/CD pipeline
- Comprehensive test suite (30+ tests)
- Code coverage reporting (>80%)
- Health check endpoint
- Patient CRUD operations (Create, Read, Update, Delete)
- Real-time statistics dashboard
- Semantic versioning support
- Automated releases

### Features
- **Backend API**
  - GET /health - Health check endpoint
  - GET /api/patients - Get all patients
  - GET /api/patients/:id - Get single patient
  - POST /api/patients - Create new patient
  - PUT /api/patients/:id - Update patient
  - DELETE /api/patients/:id - Delete patient
  - GET /api/stats - Get statistics

- **Frontend**
  - Responsive dashboard with Tailwind CSS
  - Patient list with real-time updates
  - Add/Edit/Delete patient forms
  - Statistics cards (Total Patients, Average Age, System Status)
  - Toast notifications for user feedback

- **DevOps**
  - Multi-stage Docker builds (77% size reduction)
  - GitHub Actions CI/CD
  - Automated testing
  - Security scanning with Trivy
  - Code quality checks
  - Docker Hub integration
  - Semantic versioning
  - Automated releases

### Technical Specifications
- Node.js 18 with Express.js
- SQLite database
- PHP 8.3 for frontend
- Docker & Docker Compose
- Jest for testing
- GitHub Actions for CI/CD

### Test Coverage
- Unit Tests: 15+ test cases
- Integration Tests: 5+ test cases
- Database Tests: 10+ test cases
- Total Coverage: >80% lines, >70% branches

---

## Version History

### Version Numbering (Semantic Versioning)

**Format:** MAJOR.MINOR.PATCH

- **MAJOR** version: Incompatible API changes
- **MINOR** version: New functionality (backwards compatible)
- **PATCH** version: Bug fixes (backwards compatible)

### Examples:
- `1.0.0` - Initial release
- `1.0.1` - Bug fix release
- `1.1.0` - New feature added
- `2.0.0` - Breaking changes

---

## How to Update This Changelog

When making changes:

1. Add entry under `[Unreleased]` section
2. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. When releasing, move `[Unreleased]` items to new version section
4. Add release date in format: `[X.Y.Z] - YYYY-MM-DD`

---

[Unreleased]: https://github.com/damntim/patient-management-devops/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/damntim/patient-management-devops/releases/tag/v1.0.0