pipeline {
    agent {
        docker {
            image 'docker:20.10'  // Imagem oficial do Docker
            args '-v /var/run/docker.sock:/var/run/docker.sock'  // Monta o socket do Docker
        }
    }

    // Variáveis de ambiente para facilitar a configuração
    environment {
        AWS_REGION = 'sa-east-1'  // Substitua pela sua região
        ECR_REPO = '416271425097.dkr.ecr.sa-east-1.amazonaws.com/jenkins-repo-prod'  // Substitua pelo URI do seu repositório ECR
        IMAGE_TAG = "${env.BUILD_NUMBER}"  // Usa o número do build como tag
        GITHUB_CREDENTIALS = 'github-jenkins'  // ID das credenciais GitHub no Jenkins
        AWS_CREDENTIALS = 'jenkins-user'  // ID das credenciais AWS no Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                // Clona o repositório da branch master usando as credenciais do GitHub
                git branch: 'master', 
                    url: 'https://github.com/ViniCosta1/log-register.git', 
                    credentialsId: "${GITHUB_CREDENTIALS}"
            }
        }

        stage('Build') {
            steps {
                echo 'Building...'
                // Constrói a imagem Docker a partir do Dockerfile
                sh 'docker build -t log-register:${IMAGE_TAG} .'
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
                // Adicione seus comandos de teste aqui, exemplo:
                // sh 'npm test'  // Para Node.js
                // sh 'pytest'    // Para Python
                // Por enquanto, apenas um placeholder
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // Usa as credenciais AWS para autenticar e enviar a imagem ao ECR
                withAWS(credentials: "${AWS_CREDENTIALS}", region: "${AWS_REGION}") {
                    // Autentica no ECR
                    sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}'
                    // Marca a imagem com o URI do ECR
                    sh 'docker tag meu-app:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG}'
                    // Envia a imagem ao ECR
                    sh 'docker push ${ECR_REPO}:${IMAGE_TAG}'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Remove imagens Docker locais para evitar acúmulo
            sh 'docker rmi meu-app:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG} || true'
        }
        success {
            echo 'Pipeline concluído com sucesso!'
        }
        failure {
            echo 'Falha no pipeline. Verifique os logs.'
        }
    }
}