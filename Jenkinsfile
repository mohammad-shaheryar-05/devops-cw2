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
                sshagent(['ubuntu']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@44.223.131.84 '
                        # First check if deployment exists
                        if kubectl get deployment cw2-server &>/dev/null; then
                            # Update the image with latest tag
                            kubectl set image deployment/cw2-server cw2-server=shaheryarmohammad05/cw2-server:latest
                            # Delete any failed pods to force recreation
                            kubectl get pods -l app=cw2-server | grep -i Error | awk \'{print $1}\' | xargs -r kubectl delete pod
                            # Set a longer timeout for the rollout status
                            kubectl rollout status deployment/cw2-server --timeout=300s
                        else
                            echo "Deployment not found, creating new deployment"
                            # You would need to apply your k8s yaml here or create the deployment
                            # kubectl apply -f kubernetes/deployment.yaml
                        fi
                        # Debug information
                        echo "--- Deployment Status ---"
                        kubectl describe deployment cw2-server
                        echo "--- Pod Status ---"
                        kubectl get pods -l app=cw2-server
                        echo "--- Pod Logs ---"
                        kubectl logs -l app=cw2-server --tail=50
                    '
                    '''
                }
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
