pipeline {
    agent any
    environment {
        DOCKER_USER = 'shaheryarmohammad05'
        IMAGE_NAME = 'shaheryarmohammad05/cw2-server'
        IMAGE_TAG = 'latest'  // Changed to use 'latest' instead of BUILD_NUMBER
        PRODUCTION_SERVER = '44.223.131.84'
    }
    stages {
        stage('Clone repository') {
            steps {
                git url: 'https://github.com/mohammad-shaheryar-05/devops-cw2.git', branch: 'master'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }
        stage('Test Docker Image') {
            steps {
                sh """
                docker run -d --name test-container-${BUILD_NUMBER} ${IMAGE_NAME}:${IMAGE_TAG}
                sleep 5
                CONTAINER_ID=\$(docker ps -q -f name=test-container-${BUILD_NUMBER})
                if [ -z "\$CONTAINER_ID" ]; then
                    echo "Container failed to start"
                    exit 1
                fi
                echo "Container is running successfully"
                docker stop test-container-${BUILD_NUMBER} || true
                docker rm test-container-${BUILD_NUMBER} || true
                """
            }
        }
        stage('Push Docker Image') {
            steps {
                // NOTE: This approach is for testing only and is not secure
                // You should replace this with proper credential management after confirming it works
                sh "docker login -u shaheryarmohammad5@gmail.com -p 'Sheri@4535'"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                // Using the labsuser.pem key directly since we don't have SSH credentials configured
                sh '''
                    # Create temporary key file
                    cat > /tmp/labsuser.pem << 'EOL'
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAyXPdVeWLakRJZY36oMTtsy4l5p7g6ZFet5F8RZFKb/lajGpo
4kxVTFBK4UI3CMkkTsuecTvVbsyAEZPspeFBaEr70jg0vBx3aJ6+YFNXsJri7Bbl
FljQsIKnnzFlbLa+cCirYuF9fw4nGBybBSlpHVWefgYfw27+/LGuQrFGnwPzDutK
qCrsEWe0xQ/gGK/VqdyygmoYxAf9NcJZ7IsW5JZjDdPSSGjr91Sd/eb9LG1CBC52
0aeIWVl5Nssrh/i1sh9rvWLllyPYlb9V5HGigjq6cxLF3US+tvlzcx5+lBaQIBTU
P7e7LyF/7IRk/pol0c2Nj3bLrXXu2EP0Wz2RBQIDAQABAoIBAEUR6sN2rnRC8X9W
TKYunukeW3RU6PxsETOTOC6KACGgNwGJwmhEj8JYjTPqhgAHJuG1Qp/ESgtxJj/g
nfTJ5KkjfG+5Qat1fyNpuhBAwwIUONWFjAo7bWH3ig003HeHuIewCgMfGO4lJhZI
SIZeimG6Z1sCMoXJWre9G+hV68a88ZScXIpeErbhbnUfg+2IDx5/i0e3EnBd+NV8
0kmYhCu4uq9/sb0x2mYSjwuC15AzaN3GbVWERDDLkmkXwP+fx+tslmmHRteJl6xk
qRvoYmZApdpnZ2DC57g/npQQdiDpl07bEoYLlMFQrBB1kvAveJ7v1mSCv3UOx3kY
0tUTgMkCgYEA+CYOKGq9IpuLyI4tc8IP8aYu1TdvwiyHNh6s7Xr6ftT8j3GVZL0m
ZYCaEB1uktMR5tjinax8Yft+5mann0GKLLZnus9NDGER7SbG5oudB7XNbDyh8S5R
y9NXq0JsGYITT0BXG1wQZvNF2CoKrGCY8rNYcA8aC7XVcKLrHBR8cw8CgYEAz9OV
GCMx+/0dXxhCrorZn3H0ngZXtpho6Doh49wl9V3cPjNJmgjn+oNur+U74jyc2oGY
PKEVQYPuiwM+74PUvDcRsovnf2cOCEICjr1SflTnHjDSMpUVcPNcngRdydY/lotE
8Og7fzKotojsHQmeNVjrxO2y8w46Vmzw/MH/6qsCgYEArMyrTT/PBztz4qwHQLXh
rm//6uAYxgmF+ozv9MuPhiTA3w7Ebos9Iq+kGRa1ui6bJ7reS9giIYUlgEH59e+I
zcwTfcX/rGAoQJGhLkgIiKb0LqwmRTHxKdO5F/xAFJ883RI71kSM83Pyri3QkusN
duym6BnMFF2CDVaWDE7DvscCgYB6Fq3rtCFVC2kJyFLD/sXBqUwu2UMF/ZsDccMe
/OE/t5f+4lpGpxzASh3oLx5y1XC/3In2dBrslfi4qXt7cVK0DxXSceXZLk1MBJtE
B2xC0tXDIqMZHAOwiwbJvX7rZ3WLlt01OPhazQPX16/9jvzmEgrPcWRC7QTQaMdZ
dQ5GaQKBgQDB8TtJRNtjaJDqhTXBFvCpXldAVScYXd3uJ+rzBYISkstxwGUi+nfa
Df1UJrSQt+gvbT3pakGEOsmfDxnKnPwXeeL9iDbtwTq4Jy47KW5gRyT7qE/+9WOK
tlrpGdDwBM/bNXApmiapTSmQBs33HxFJrIBnEtiS4s9zXk6qLfiw3A==
-----END RSA PRIVATE KEY-----
EOL
                    
                    # Set proper permissions
                    chmod 600 /tmp/labsuser.pem
                    
                    # Connect to the server using the key and execute commands
                    ssh -o StrictHostKeyChecking=no -i /tmp/labsuser.pem ubuntu@44.223.131.84 '
                        # First, let\'s verify and fix the package.json
                        echo "Checking and fixing package.json file..."
                        cat > /tmp/package.json << EOL
{
  "name": "cw2-server",
  "version": "1.0.0",
  "description": "A server for CW2",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}
EOL
                        
                        # Create a fixed Dockerfile
                        echo "Creating a proper Dockerfile..."
                        cat > /tmp/Dockerfile << EOL
FROM node:14-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY server.js ./

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "server.js"]
EOL
                        
                        # Check if we need to rebuild the image locally
                        echo "Creating a temporary build directory..."
                        mkdir -p /tmp/build-temp
                        cp /tmp/package.json /tmp/build-temp/
                        cp /tmp/Dockerfile /tmp/build-temp/
                        cp ~/devops-cw2/server.js /tmp/build-temp/
                        
                        cd /tmp/build-temp
                        
                        echo "Building a fixed Docker image locally..."
                        docker build -t shaheryarmohammad05/cw2-server:latest .
                        
                        # Login to Docker Hub
                        echo "Logging in to Docker Hub..."
                        echo "Sheri@4535" | docker login -u shaheryarmohammad5@gmail.com --password-stdin
                        
                        # Push the image
                        echo "Pushing the fixed image to Docker Hub..."
                        docker push shaheryarmohammad05/cw2-server:latest
                        
                        # Apply the deployment using the existing deployment.yaml
                        echo "Applying deployment from existing deployment.yaml file"
                        kubectl apply -f deployment.yaml
                        
                        # Delete all existing pods to force recreation with the fixed image
                        echo "Deleting all existing pods to force recreation with fixed image..."
                        kubectl delete pods -l app=cw2-server
                        
                        # Wait for rollout to complete
                        sleep 5
                        kubectl rollout status deployment/cw2-server --timeout=300s
                        
                        # Debug information
                        echo "--- Deployment Status ---"
                        kubectl describe deployment cw2-server
                        echo "--- Pod Status ---"
                        kubectl get pods -l app=cw2-server
                        echo "--- Pod Logs ---"
                        kubectl logs -l app=cw2-server --tail=50 || echo "No logs available yet"
                        
                        # Cleanup
                        echo "Cleaning up temporary files..."
                        rm -rf /tmp/build-temp
                        rm /tmp/package.json
                        rm /tmp/Dockerfile
                        
                        docker logout
                    '
                    
                    # Clean up
                    rm -f /tmp/labsuser.pem
                '''
            }
        }
    }
    post {
        always {
            echo "Cleaning up..."
            sh "docker logout || true"
            // No image cleanup since the container may be using it
        }
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Note: If the only errors are about Docker Hub credentials, check your Jenkins credentials configuration."
            echo "The deployment may still be successful. Check the running containers on your server."
        }
    }
}
