pipeline {
    agent {
        node {
            label 'Jenkins'  // Match your Jenkins agent's label (replace 'Jenkins' if needed)
        }
    }

    environment {
        DOCKER_IMAGE = "shaheryarmohammad05/cw2-server:latest"
        DOCKER_CREDENTIALS_ID = "dockerhub" 
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
                withCredentials([usernamePassword(
                    credentialsId: "$DOCKER_CREDENTIALS_ID", 
                    usernameVariable: 'DOCKER_USER', 
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sshagent(credentials: ['ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@3.81.148.201 '
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
            node('Jenkins') {  // Match your agent label here too
                sh "docker logout"
            }
        }
    }
}
