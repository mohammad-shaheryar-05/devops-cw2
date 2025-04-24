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
                        # Apply the deployment using the existing deployment.yaml
                        echo "Applying deployment from existing deployment.yaml file"
                        kubectl apply -f deployment.yaml
                        
                        # Check if the image in the deployment matches our pushed image
                        CURRENT_IMAGE=$(kubectl get deployment cw2-server -o jsonpath="{.spec.template.spec.containers[0].image}")
                        
                        if [ "$CURRENT_IMAGE" != "shaheryarmohammad05/cw2-server:latest" ]; then
                            echo "Updating image to shaheryarmohammad05/cw2-server:latest"
                            kubectl set image deployment/cw2-server cw2-server=shaheryarmohammad05/cw2-server:latest
                        fi
                        
                        # Delete any failed pods to force recreation
                        echo "Restarting any failed pods..."
                        kubectl get pods -l app=cw2-server | grep -i CrashLoop | awk "{print \\$1}" | xargs -r kubectl delete pod
                        
                        # Force a rollout restart in case the image is the same but content updated
                        echo "Force rolling restart of deployment"
                        kubectl rollout restart deployment cw2-server
                        
                        # Wait for rollout to complete
                        kubectl rollout status deployment/cw2-server --timeout=300s
                        
                        # Debug information
                        echo "--- Deployment Status ---"
                        kubectl describe deployment cw2-server
                        echo "--- Pod Status ---"
                        kubectl get pods -l app=cw2-server
                        echo "--- Pod Logs ---"
                        kubectl logs -l app=cw2-server --tail=50 || echo "No logs available yet"
                        
                        # Check if any pods are in CrashLoopBackOff and show more details
                        if kubectl get pods -l app=cw2-server | grep -i CrashLoop; then
                            echo "WARNING: Some pods are in CrashLoopBackOff state. Checking pod details:"
                            CRASH_POD=$(kubectl get pods -l app=cw2-server | grep -i CrashLoop | head -1 | awk "{print \\$1}")
                            kubectl describe pod $CRASH_POD
                            echo "--- Last few log lines from crashed pod ---"
                            kubectl logs $CRASH_POD --previous || echo "No previous logs available"
                        fi
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
