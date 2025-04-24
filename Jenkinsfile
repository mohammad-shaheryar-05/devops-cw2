pipeline {
    agent any
    environment {
        DOCKER_USER = 'shaheryarmohammad05'
        IMAGE_NAME = 'shaheryarmohammad05/cw2-server'
        IMAGE_TAG = 'latest'
        PRODUCTION_SERVER = '44.223.131.84'
    }
    stages {
        stage('Clone repository') {
            steps {
                git url: 'https://github.com/mohammad-shaheryar-05/devops-cw2.git', branch: 'master'
                
                // Create correct package.json
                sh '''
                cat > package.json << 'EOL'
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

                # Create a clean Dockerfile
                cat > Dockerfile << 'EOL'
FROM node:14-alpine

# Create app directory
WORKDIR /app

# Copy package.json file
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
                '''
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
                sh "docker login -u shaheryarmohammad5@gmail.com -p 'Sheri@4535'"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
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
                
                # SSH commands to apply deployment and update image
                ssh -o StrictHostKeyChecking=no -i /tmp/labsuser.pem ubuntu@44.223.131.84 "kubectl apply -f deployment.yaml && kubectl set image deployment/cw2-server cw2-server=shaheryarmohammad05/cw2-server:latest && kubectl rollout restart deployment cw2-server"
                
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
        }
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed. Check the logs for details."
        }
    }
}
