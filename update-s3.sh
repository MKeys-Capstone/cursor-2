#!/bin/bash

# Define paths
BUILD_DIR="./dist"
REACT_APP_BUCKET="matt-test--practice-react-app"
CLOUDFRONT_DISTRIBUTION_ID="EAD6PU8HYULTL"

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
echo "Syncing S3 Bucket ${REACT_APP_BUCKET} with built React app..."
aws s3 sync $BUILD_DIR s3://${REACT_APP_BUCKET}
echo "S3 Bucket ${REACT_APP_BUCKET} synced successfully."

# Invalidate CloudFront Distribution
echo "Invalidating CloudFront Distribution..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
echo "CloudFront Distribution ${CLOUDFRONT_DISTRIBUTION_ID} invalidated successfully."
