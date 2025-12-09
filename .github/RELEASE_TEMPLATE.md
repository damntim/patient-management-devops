# Release Template

Use this template when creating manual releases.

---

## 🚀 Release vX.Y.Z

**Release Date:** YYYY-MM-DD

### 📋 What's New

#### ✨ New Features
- Feature 1 description
- Feature 2 description

#### 🐛 Bug Fixes
- Bug fix 1
- Bug fix 2

#### 📝 Changes
- Change 1
- Change 2

#### ⚡ Performance Improvements
- Improvement 1
- Improvement 2

#### 🔒 Security Updates
- Security update 1
- Security update 2

---

### 🐳 Docker Images

**Pull the latest version:**
```bash
docker pull YOUR_USERNAME/patient-management:vX.Y.Z
docker pull YOUR_USERNAME/patient-management:latest
```

**Run the application:**
```bash
docker run -d -p 3000:3000 -p 8000:8000 YOUR_USERNAME/patient-management:vX.Y.Z
```

---

### 📦 Installation

**From Docker Hub:**
```bash
docker pull YOUR_USERNAME/patient-management:vX.Y.Z
docker-compose up -d
```

**From Source:**
```bash
git clone https://github.com/YOUR_USERNAME/patient-management-devops.git
cd patient-management-devops
git checkout vX.Y.Z
docker-compose up -d
```

---

### ✅ Testing

This release has been tested with:
- ✅ All unit tests passing (30+ tests)
- ✅ Integration tests passing
- ✅ Code coverage >80%
- ✅ Docker container builds successfully
- ✅ Security scan completed (no critical vulnerabilities)
- ✅ Load testing completed

---

### 📊 Release Metrics

| Metric | Value |
|--------|-------|
| Test Coverage | >80% |
| Tests Passed | 30+ |
| Docker Image Size | ~180MB |
| Build Time | ~2 minutes |
| Security Issues | 0 critical |

---

### 🔗 Links

- **Documentation:** [README.md](../README.md)
- **Changelog:** [CHANGELOG.md](../CHANGELOG.md)
- **Docker Hub:** https://hub.docker.com/r/YOUR_USERNAME/patient-management
- **Issues:** https://github.com/YOUR_USERNAME/patient-management-devops/issues

---

### 🙏 Contributors

Thank you to everyone who contributed to this release!

---

### ⚠️ Breaking Changes

List any breaking changes here (for major version releases).

---

### 📌 Upgrade Guide

#### From v1.0.0 to v1.1.0:
1. Pull the latest image
2. Stop current container
3. Start new container
4. Verify health check

```bash
docker pull YOUR_USERNAME/patient-management:v1.1.0
docker stop patient-app
docker rm patient-app
docker run -d -p 3000:3000 -p 8000:8000 --name patient-app YOUR_USERNAME/patient-management:v1.1.0
curl http://localhost:3000/health
```

---

### 🐛 Known Issues

List any known issues or limitations in this release.

---

### 📅 Next Release

**Planned features for next release:**
- Feature A
- Feature B
- Feature C

**Target Date:** YYYY-MM-DD