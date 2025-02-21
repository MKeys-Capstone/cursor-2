#!/bin/bash

# Define paths
BUILD_DIR="./dist"
SAM_TEMPLATE="template.yaml"
REACT_APP_BUCKET="matt-test--practice-react-app"

# Build Lambda Functions
echo "Building Lambda Functions..."
cd src/functions
npm install
npm run build
cd ../..


# Build the React app
echo "Building React app..."
npm install
npm run build

# Ensure the build folder exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "Build folder does not exist. Please run the build command."
  exit 1
fi
echo "React app built successfully."

#Sync S3 Bucket with built React app
echo "Syncing S3 Bucket with built React app..."
aws s3 sync $BUILD_DIR s3://${REACT_APP_BUCKET}

# Invalidate CloudFront Distribution
# echo "Invalidating CloudFront Distribution..."
# aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

# echo "CloudFront Distribution invalidated successfully."

# Deploy the SAM stack
echo "Deploying SAM stack..."
sam.cmd build
sam.cmd deploy --template-file ./template.yaml --profile CapstoneAdmin

echo "Deployment complete."
