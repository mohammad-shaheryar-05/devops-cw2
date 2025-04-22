pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDS = credentials('dockerhub')
        APP_VERSION = "${env.BUILD_NUMBER}"
        DOCKER_IMAGE = "shaheryarmohammad05/cw2-server"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        KUBE_CONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }
        
        stage('Test Container') {
            steps {
                sh """
                docker run -d --name test-container-${BUILD_NUMBER} ${DOCKER_IMAGE}:${DOCKER_TAG}
                sleep 5
                CONTAINER_ID=\$(docker ps -q -f name=test-container-${BUILD_NUMBER})
                if [ -z "\$CONTAINER_ID" ]; then
                    echo "Container failed to start"
                    exit 1
                fi
                echo "Container is running successfully"
                docker stop test-container-${BUILD_NUMBER}
                docker rm test-container-${BUILD_NUMBER}
                """
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                sh "echo ${DOCKER_HUB_CREDS_PSW} | docker login -u ${DOCKER_HUB_CREDS_USR} --password-stdin"
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_IMAGE}:latest"
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Connect to production server via SSH and update the deployment
                    sh """
                    ssh ubuntu@your-production-server-ip '
                    kubectl set image deployment/cw2-server cw2-server=${DOCKER_IMAGE}:${DOCKER_TAG}
                    kubectl rollout status deployment/cw2-server
                    '
                    """
                }
            }
        }
    }
    
    post {
        always {
            sh "docker logout"
        }
    }
}
