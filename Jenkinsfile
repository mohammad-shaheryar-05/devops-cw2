pipeline {
    agent any

    environment {
        DOCKER_USER = 'shaheryarmohammad05'
        DOCKER_PASS = credentials('docker-hub-password')
        IMAGE_NAME = 'shaheryarmohammad05/cw2-server'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
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
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
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
                withCredentials([string(credentialsId: 'docker-hub-password', variable: 'DOCKER_PASS')]) {
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sshagent(['ubuntu']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@44.223.131.84 '
                        # First check if deployment exists
                        if kubectl get deployment cw2-server &>/dev/null; then
                            # Update the image
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
            sh "docker logout || true"
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker rmi ${IMAGE_NAME}:latest || true"
        }
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed. Check the logs for details."
        }
    }
}
