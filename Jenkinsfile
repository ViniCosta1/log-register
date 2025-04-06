pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="416271425097"
        AWS_DEFAULT_REGION="sa-east-1"
        IMAGE_REPO_NAME="jenkins-repo-prod"
        IMAGE_TAG="v${env.BUILD_NUMBER}"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    }
   
    stages {
        stage('Configurar AWS Credentials') {
            steps {
                script {
                    // Garante que as credenciais AWS do Jenkins sejam usadas
                    withAWS(credentials: 'aws-credentials', region: "${AWS_DEFAULT_REGION}") {
                        sh 'aws sts get-caller-identity' // Testa se as credenciais estão funcionando
                    }
                }
            }
        }
        
        stage('Logging into AWS ECR') {
            steps {
                script {
                    // Usa o plugin AWS CLI do Jenkins para fazer login no ECR
                    withAWS(credentials: 'aws-credentials', region: "${AWS_DEFAULT_REGION}") {
                        sh 'aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${REPOSITORY_URI}'
                    }
                }
            }
        }
        
        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', 
                          branches: [[name: '*/master']], 
                          doGenerateSubmoduleConfigurations: false, 
                          extensions: [], 
                          submoduleCfg: [], 
                          userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/sd031/aws_codebuild_codedeploy_nodeJs_demo.git']]])
            }
        }
  
        stage('Building image') {
            steps {
                script {
                    dockerImage = docker.build "${IMAGE_REPO_NAME}:${IMAGE_TAG}"
                }
            }
        }
   
        stage('Pushing to ECR') {
            steps {
                script {
                    withAWS(credentials: 'aws-credentials', region: "${AWS_DEFAULT_REGION}") {
                        sh "docker tag ${IMAGE_REPO_NAME}:${IMAGE_TAG} ${REPOSITORY_URI}:${IMAGE_TAG}"
                        sh "docker push ${REPOSITORY_URI}:${IMAGE_TAG}"
                    }
                }
            }
        }
    }
}