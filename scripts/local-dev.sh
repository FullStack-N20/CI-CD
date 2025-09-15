#!/bin/bash

# Local Development Script

set -e

echo "🔧 Setting up local development environment..."

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Start development environment
echo "🚀 Starting development environment..."
docker-compose -f docker-compose.dev.yml up --build

echo "✅ Development environment is running!"
echo "🌐 API available at: http://localhost:3000"
echo "🗄️  Database available at: localhost:5432"
echo ""
echo "📚 API Endpoints:"
echo "  GET    /health                     - Health check"
echo "  GET    /factory                    - Get all factories"
echo "  POST   /factory                    - Create factory"
echo "  GET    /factory/:id                - Get factory by ID"
echo "  PATCH  /factory/:id                - Update factory"
echo "  DELETE /factory/:id                - Delete factory"
echo "  GET    /employes                   - Get all employees"
echo "  POST   /employes                   - Create employee"
echo "  GET    /employes/:id               - Get employee by ID"
echo "  GET    /employes/factory/:id       - Get employees by factory"
echo "  PATCH  /employes/:id               - Update employee"
echo "  DELETE /employes/:id               - Delete employee"
