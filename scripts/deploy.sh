#!/bin/bash

# Factory Employee API Deployment Script

set -e

echo "🚀 Starting deployment process..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Apply Kubernetes configurations
echo "📦 Applying Kubernetes configurations..."

kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secret.yml
kubectl apply -f k8s/postgres.yml
kubectl apply -f k8s/app.yml

echo "⏳ Waiting for deployments to be ready..."

# Wait for postgres to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n factory-employee-app --timeout=300s

# Wait for app to be ready
kubectl wait --for=condition=ready pod -l app=factory-employee-app -n factory-employee-app --timeout=300s

echo "✅ Deployment completed successfully!"

# Show deployment status
echo "📊 Deployment Status:"
kubectl get pods -n factory-employee-app
kubectl get services -n factory-employee-app

# Get service URL
SERVICE_IP=$(kubectl get service factory-employee-service -n factory-employee-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ -n "$SERVICE_IP" ]; then
    echo "🌐 Application is available at: http://$SERVICE_IP"
else
    echo "🔄 Service is still provisioning. Check status with: kubectl get services -n factory-employee-app"
fi
