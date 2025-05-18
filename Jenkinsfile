pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from your GitHub repository
                git url: 'https://github.com/muhammadbilalnasir/Story-generator.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build docker images using docker-compose
                    sh 'docker-compose -p storygen build'
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    // Run containers in detached mode
                    sh 'docker-compose -p storygen -f docker-compose.yml up -d'
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment completed successfully!'
        }
        failure {
            echo 'Build or deployment failed. Please check logs.'
        }
    }
}
