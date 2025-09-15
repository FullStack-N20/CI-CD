#!/bin/bash

# Docker Build Script for Factory Employee API

set -e

# Configuration
IMAGE_NAME="factory-employee-api"
DOCKER_USERNAME=${DOCKER_USERNAME:-"your-dockerhub-username"}
VERSION=${VERSION:-"latest"}

echo "🐳 Building Docker image..."

# Build the Docker image
docker build -t $IMAGE_NAME:$VERSION .
docker tag $IMAGE_NAME:$VERSION $DOCKER_USERNAME/$IMAGE_NAME:$VERSION
docker tag $IMAGE_NAME:$VERSION $DOCKER_USERNAME/$IMAGE_NAME:latest

echo "✅ Docker image built successfully!"

# Check if we should push to Docker Hub
if [ "$1" == "push" ]; then
    echo "📤 Pushing to Docker Hub..."
    
    # Login to Docker Hub (make sure you're logged in)
    docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION
    docker push $DOCKER_USERNAME/$IMAGE_NAME:latest
    
    echo "✅ Image pushed successfully!"
    echo "🔗 Image available at: $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
else
    echo "💡 To push to Docker Hub, run: $0 push"
fi

echo "🏷️  Available images:"
docker images | grep $IMAGE_NAME
