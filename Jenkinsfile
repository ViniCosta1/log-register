pipeline {
    agent any  // Usa o nó padrão (EC2)

    environment {
        AWS_REGION = 'sa-east-1'
        ECR_REPO = '416271425097.dkr.ecr.sa-east-1.amazonaws.com/jenkins-repo-prod'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        GITHUB_CREDENTIALS = 'jenkins-github'
        AWS_CREDENTIALS = 'aws-jenkins'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', 
                    url: 'https://github.com/ViniCosta1/log-register.git', 
                    credentialsId: "${GITHUB_CREDENTIALS}"
            }
        }

        stage('Build') {
            steps {
                echo 'Building...'
                sh 'docker build -t log-register:${IMAGE_TAG} .'
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
                // Adicione comandos de teste aqui, se houver
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                withAWS(credentials: "${AWS_CREDENTIALS}", region: "${AWS_REGION}") {
                    sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}'
                    sh 'docker tag log-register:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG}'
                    sh 'docker push ${ECR_REPO}:${IMAGE_TAG}'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker rmi log-register:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG} || true'
        }
        success {
            echo 'Pipeline concluído com sucesso!'
        }
        failure {
            echo 'Falha no pipeline. Verifique os logs.'
        }
    }
}