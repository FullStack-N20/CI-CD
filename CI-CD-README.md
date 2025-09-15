# Factory Employee API - CI/CD Setup

## 🚀 Complete CI/CD Pipeline for Factory Employee CRUD System

This project includes a comprehensive CI/CD pipeline with automated testing, building, and deployment capabilities.

## 📋 Pipeline Overview

### 🔄 CI/CD Workflow (.github/workflows/ci-cd.yml)

The pipeline consists of three main stages:

1. **Test Stage** - Runs on multiple Node.js versions (18.x, 20.x)
2. **Build Stage** - Creates Docker images and pushes to Docker Hub
3. **Deploy Stage** - Deploys to production environment

### 🧪 Testing Pipeline

- **Unit Tests**: All service methods with mocked dependencies
- **Integration Tests**: Real database interactions using in-memory PostgreSQL
- **E2E Tests**: Full API testing with actual HTTP requests
- **Code Coverage**: Automated coverage reporting with Codecov integration
- **Linting**: ESLint validation for code quality

### 🐳 Docker Configuration

- **Multi-stage build** for optimized production images
- **Security**: Non-root user, minimal attack surface
- **Health checks** for container monitoring
- **Environment-based configuration**

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Kubernetes cluster (for K8s deployment)
- GitHub account with repository access

### 1. Environment Setup

Copy the environment template:
```bash
cp env.example .env
```

Configure your environment variables:
```env
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=factory_employee_db
NODE_ENV=development
PORT=3000
```

### 2. GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
DATABASE_URL=postgres://user:pass@host:port/dbname (for production)
```

### 3. Local Development

#### Option A: Native Development
```bash
# Install dependencies
npm install

# Start PostgreSQL (using Docker)
docker run -d --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=factory_employee_dev \
  -p 5432:5432 postgres:15-alpine

# Start application
npm run start:dev
```

#### Option B: Docker Compose (Recommended)
```bash
# Development environment with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Production-like environment
docker-compose up --build
```

#### Option C: Use Helper Script
```bash
# Make script executable (Linux/Mac)
chmod +x scripts/local-dev.sh
./scripts/local-dev.sh

# Windows
scripts/local-dev.sh
```

## 📦 Build & Deployment

### Manual Docker Build
```bash
# Build image
docker build -t factory-employee-api .

# Or use helper script
chmod +x scripts/build-docker.sh
./scripts/build-docker.sh push  # Add 'push' to push to Docker Hub
```

### Kubernetes Deployment
```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Or use helper script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Production Deployment Options

#### 1. Cloud Platforms
- **AWS ECS/Fargate**: Use the Docker image with ECS task definitions
- **Google Cloud Run**: Direct deployment from container registry
- **Azure Container Instances**: Quick serverless container deployment
- **Heroku**: Use heroku.yml for container deployment

#### 2. VPS/Server Deployment
```bash
# SSH into your server
ssh user@your-server.com

# Pull and run the image
docker pull your-username/factory-employee-api:latest
docker run -d --name factory-api \
  -p 3000:3000 \
  -e DATABASE_URL=your-production-db-url \
  -e NODE_ENV=production \
  your-username/factory-employee-api:latest
```

## 🔧 CI/CD Pipeline Triggers

### Automatic Triggers
- **Push to `main`**: Full CI/CD pipeline (test → build → deploy)
- **Push to `develop`**: Testing only
- **Pull Requests to `main`**: Testing only

### Manual Triggers
- GitHub Actions can be triggered manually from the Actions tab
- Individual stages can be re-run if needed

## 📊 Monitoring & Health Checks

### Application Health
- Health endpoint: `GET /health`
- Returns application status, uptime, and timestamp

### Container Health
- Docker health checks configured
- Kubernetes liveness and readiness probes

### Database Health
- Connection health monitoring
- Automatic retry logic for database connections

## 🧪 Testing Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run specific test suites
npm test -- --testPathPattern=factory
npm test -- --testPathPattern=integration
```

## 🚀 API Endpoints

### Factory Management
```
GET    /factory           - Get all factories
POST   /factory           - Create new factory
GET    /factory/:id       - Get factory by ID
PATCH  /factory/:id       - Update factory
DELETE /factory/:id       - Delete factory
```

### Employee Management
```
GET    /employes                 - Get all employees
POST   /employes                 - Create new employee
GET    /employes/:id             - Get employee by ID
GET    /employes/factory/:id     - Get employees by factory
PATCH  /employes/:id             - Update employee
DELETE /employes/:id             - Delete employee
```

### System
```
GET    /health            - Health check endpoint
```

## 🔐 Security Considerations

- **Environment Variables**: Sensitive data stored in environment variables
- **Database**: SSL connections in production
- **Container**: Non-root user execution
- **Validation**: Input validation using class-validator
- **CORS**: Configurable CORS settings

## 📈 Scaling Considerations

- **Horizontal Scaling**: Stateless application design
- **Database**: Read replicas for scaling reads
- **Caching**: Redis can be added for session/data caching
- **Load Balancing**: Multiple instances behind load balancer

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connectivity
   docker exec -it postgres-container psql -U postgres -d factory_employee_db
   ```

2. **Build Failures**
   ```bash
   # Check build logs
   docker build --no-cache -t factory-employee-api .
   ```

3. **Test Failures**
   ```bash
   # Run tests with verbose output
   npm test -- --verbose
   ```

### Logs
```bash
# Application logs
docker logs factory-api

# Kubernetes logs
kubectl logs -f deployment/factory-employee-app -n factory-employee-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

The CI pipeline will automatically run tests on your PR!

## 📝 License

This project is licensed under the MIT License.

---

**🎉 Your Factory Employee API is now ready for production with a complete CI/CD pipeline!**
