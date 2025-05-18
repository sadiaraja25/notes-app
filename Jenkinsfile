pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
              
                git url: 'https://github.com/sadiaraja25/notes-app.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    
                    sh 'docker-compose -p storygen build'
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    
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
