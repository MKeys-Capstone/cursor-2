#!/bin/bash

# Build Lambda Functions
echo "Building Lambda Functions..."
cd src/functions
npm install
npm run build
cd ../..


# Deploy the SAM stack
echo "Deploying SAM stack..."
sam.cmd build
sam.cmd deploy --template-file ./template.yaml

echo "Deployment complete."
