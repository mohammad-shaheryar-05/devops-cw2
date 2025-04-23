pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "shaheryarmohammad05/cw2-server:latest"
        DOCKER_CREDENTIALS_ID = "dockerhub" // Update this if your Jenkins credentials ID is different
    }

    stages {
        stage('Clone repository') {
            steps {
                git 'https://github.com/mohammad-shaheryar-05/devops-cw2.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sshagent (credentials: ['ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@your-production-server-ip '
                        kubectl set image deployment/cw2-server cw2-server=$DOCKER_IMAGE
                        kubectl rollout status deployment/cw2-server
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            node('master') { // or your agent label
                sh "docker logout"
            }
        }
    }
}
