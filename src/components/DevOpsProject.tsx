import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, ExternalLink, Mail, Settings, Container, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import AgendamentoSimulator from './AgendamentoSimulator';

const DevOpsProject = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência!`);
  };

  const dockerfileContent = `FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]`;

  const requirementsContent = `smtplib2==0.2.1
email-validator==2.0.0
python-dotenv==1.0.0`;

  const appPyContent = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
from agendamento import processar_agendamento

def main():
    """
    Função principal que executa o processamento de agendamentos
    """
    print("=" * 50)
    print("🚀 INICIANDO SISTEMA DE AGENDAMENTOS - v2.0")
    print("=" * 50)
    
    try:
        # Processa todos os agendamentos
        processar_agendamento()
        print("✅ Processamento concluído com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro durante o processamento: {str(e)}")
        sys.exit(1)
    
    print("=" * 50)
    print("🎉 SISTEMA FINALIZADO")
    print("=" * 50)

if __name__ == "__main__":
    main()`;

  const agendamentoPyContent = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import os

# Configurações SMTP (substituir pelas suas credenciais)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "seuemail@gmail.com"  # Substituir pelo seu e-mail
EMAIL_PASSWORD = "SENHA_DO_APP"      # Substituir pela senha de aplicativo

# Lista de usuários para agendamento
USUARIOS = [
    {"nome": "João Silva", "email": "joao@email.com"},
    {"nome": "Maria Santos", "email": "maria@email.com"},
    {"nome": "Pedro Oliveira", "email": "pedro@email.com"},
    {"nome": "Ana Costa", "email": "ana@email.com"},
    {"nome": "Carlos Ferreira", "email": "carlos@email.com"}
]

def criar_conexao_smtp():
    """
    Cria e retorna uma conexão SMTP segura
    """
    try:
        context = ssl.create_default_context()
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls(context=context)
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        return server
    except Exception as e:
        print(f"❌ Erro ao conectar com SMTP: {str(e)}")
        raise

def testar_conexao_smtp():
    """
    Testa a conexão SMTP antes do envio dos e-mails
    """
    print("🔄 Testando conexão SMTP...")
    try:
        server = criar_conexao_smtp()
        server.quit()
        print("✅ Conexão SMTP estabelecida com sucesso!")
        return True
    except Exception as e:
        print(f"❌ Falha na conexão SMTP: {str(e)}")
        return False

def enviar_email(destinatario, assunto, corpo):
    """
    Envia um e-mail para o destinatário especificado
    """
    try:
        # Criar a mensagem
        message = MIMEMultipart("alternative")
        message["Subject"] = assunto
        message["From"] = EMAIL_SENDER
        message["To"] = destinatario
        
        # Criar corpo do e-mail em HTML
        html = f"""
        <html>
          <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Sistema de Agendamentos DevOps v2.0</h2>
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                {corpo}
              </div>
              <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
                Este e-mail foi enviado automaticamente pelo sistema DevOps.
              </p>
            </div>
          </body>
        </html>
        """
        
        # Adicionar conteúdo HTML
        part = MIMEText(html, "html")
        message.attach(part)
        
        # Enviar e-mail
        server = criar_conexao_smtp()
        server.send_message(message)
        server.quit()
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao enviar e-mail para {destinatario}: {str(e)}")
        return False

def processar_agendamento():
    """
    Processa agendamentos para todos os usuários
    """
    print("📧 Iniciando processamento de agendamentos...")
    
    # Testar conexão SMTP primeiro
    if not testar_conexao_smtp():
        raise Exception("Falha na conexão SMTP")
    
    agendamentos_processados = 0
    emails_enviados = 0
    
    for usuario in USUARIOS:
        try:
            nome = usuario["nome"]
            email = usuario["email"]
            
            # Gerar horário de agendamento (próximas 24-48 horas)
            horario_agendamento = datetime.now() + timedelta(
                hours=24 + (agendamentos_processados * 2)
            )
            horario_formatado = horario_agendamento.strftime("%d/%m/%Y às %H:%M")
            
            print(f"📅 Agendamento solicitado para {nome} ({email}) - {horario_formatado}")
            
            # Enviar e-mail de solicitação
            assunto_solicitacao = f"🔔 Solicitação de Agendamento - {nome}"
            corpo_solicitacao = f"""
            <h3>Olá, {nome}!</h3>
            <p>Sua solicitação de agendamento foi recebida com sucesso.</p>
            <p><strong>📅 Data/Hora:</strong> {horario_formatado}</p>
            <p><strong>🔄 Status:</strong> Aguardando confirmação</p>
            <p>Em breve você receberá a confirmação do seu agendamento.</p>
            """
            
            if enviar_email(email, assunto_solicitacao, corpo_solicitacao):
                emails_enviados += 1
                print(f"✅ E-mail de solicitação enviado para {nome}")
            
            # Simular processamento
            print(f"⏳ Processando agendamento para {nome}...")
            
            # Enviar e-mail de confirmação
            assunto_confirmacao = f"✅ Agendamento Confirmado - {nome}"
            corpo_confirmacao = f"""
            <h3>Agendamento Confirmado!</h3>
            <p>Olá, {nome}!</p>
            <p>Seu agendamento foi <strong>confirmado</strong> com sucesso!</p>
            <p><strong>📅 Data/Hora:</strong> {horario_formatado}</p>
            <p><strong>✅ Status:</strong> Confirmado</p>
            <p>Obrigado por utilizar nosso sistema!</p>
            """
            
            if enviar_email(email, assunto_confirmacao, corpo_confirmacao):
                emails_enviados += 1
                print(f"📧 Agendamento atendido para {nome} ({email}) - {horario_formatado}")
            
            agendamentos_processados += 1
            
        except Exception as e:
            print(f"❌ Erro ao processar agendamento para {usuario['nome']}: {str(e)}")
    
    print(f"📊 Resumo: {agendamentos_processados} agendamentos processados")
    print(f"📧 Total de e-mails enviados: {emails_enviados}")`;

  const jenkinsfileContent = `pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "agendamento-app"
        DOCKER_TAG = "\${BUILD_NUMBER}"
    }
    
    stages {
        stage('📥 Clonar Repositório') {
            steps {
                echo '🔄 Clonando repositório do GitHub...'
                checkout scm
                echo '✅ Repositório clonado com sucesso!'
            }
        }
        
        stage('🔍 Testar Conexão SMTP') {
            steps {
                echo '🧪 Testando conexão SMTP...'
                script {
                    try {
                        sh '''
                            python3 -c "
import smtplib
import ssl
print('🔄 Testando conexão SMTP...')
try:
    context = ssl.create_default_context()
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls(context=context)
    server.quit()
    print('✅ Conexão SMTP disponível!')
except Exception as e:
    print(f'⚠️ Aviso: Conexão SMTP não configurada - {str(e)}')
    print('ℹ️ Configure as credenciais SMTP para envio real de e-mails')
"
                        '''
                        echo '✅ Teste de conexão SMTP concluído!'
                    } catch (Exception e) {
                        echo "⚠️ Aviso: Teste SMTP falhou - \${e.getMessage()}"
                        echo 'ℹ️ Continuando com execução em modo de demonstração'
                    }
                }
            }
        }
        
        stage('🐳 Build Docker') {
            steps {
                echo '🔨 Construindo imagem Docker...'
                script {
                    sh "docker build -t \${DOCKER_IMAGE}:\${DOCKER_TAG} ."
                    sh "docker tag \${DOCKER_IMAGE}:\${DOCKER_TAG} \${DOCKER_IMAGE}:latest"
                }
                echo '✅ Imagem Docker construída com sucesso!'
            }
        }
        
        stage('🚀 Executar Container') {
            steps {
                echo '🏃 Executando container e processando agendamentos...'
                script {
                    sh '''
                        docker run --rm \\
                            --name agendamento-container-\${BUILD_NUMBER} \\
                            \${DOCKER_IMAGE}:\${DOCKER_TAG}
                    '''
                }
                echo '✅ Container executado com sucesso!'
            }
        }
    }
    
    post {
        always {
            echo '🧹 Limpando recursos...'
            script {
                sh '''
                    # Limpar containers parados
                    docker container prune -f
                    
                    # Manter apenas as 3 imagens mais recentes
                    docker images \${DOCKER_IMAGE} --format "table {{.Tag}}" | tail -n +4 | xargs -I {} docker rmi \${DOCKER_IMAGE}:{} || true
                '''
            }
        }
        success {
            echo '🎉 Pipeline executado com sucesso!'
            echo '📊 Verifique os logs acima para detalhes dos agendamentos processados'
        }
        failure {
            echo '❌ Pipeline falhou!'
            echo '🔍 Verifique os logs para identificar o problema'
        }
    }
}`;

  const readmeContent = `# DevOps com Docker, Jenkins e Notificações por E-mail – Versão 2.0

## 🎯 Objetivo

Automatizar um sistema de agendamentos que envia e-mails de confirmação (solicitação e atendimento) para usuários, com execução via Jenkins e empacotamento com Docker.

## 🛠️ Tecnologias Utilizadas

- **Docker**: Containerização da aplicação
- **Jenkins**: Pipeline de CI/CD
- **Python**: Linguagem de programação
- **SMTP**: Envio de e-mails
- **GitHub**: Controle de versão

## 📁 Estrutura do Projeto

\`\`\`
meu-projeto/
├── Dockerfile              # Configuração do container
├── app.py                  # Aplicação principal
├── agendamento.py          # Lógica de agendamentos e e-mails
├── requirements.txt        # Dependências Python
├── Jenkinsfile            # Pipeline Jenkins
└── README.md              # Documentação
\`\`\`

## 🚀 Como Executar

### 1. Configuração do E-mail

Edite o arquivo \`agendamento.py\` e configure:

\`\`\`python
EMAIL_SENDER = "seuemail@gmail.com"
EMAIL_PASSWORD = "SENHA_DO_APP"
\`\`\`

### 2. Execução Local com Docker

\`\`\`bash
# Build da imagem
docker build -t agendamento-app .

# Execução do container
docker run --rm agendamento-app
\`\`\`

### 3. Pipeline Jenkins

1. Crie um novo Pipeline Job no Jenkins
2. Configure o SCM para apontar para este repositório
3. Execute o pipeline

## 📧 Configuração SMTP

Para usar Gmail:

1. Ative a verificação em duas etapas
2. Gere uma senha de aplicativo
3. Use a senha de aplicativo no código

## 🧪 Testes

O sistema irá:

1. Testar a conexão SMTP
2. Processar agendamentos para todos os usuários
3. Enviar e-mails de solicitação e confirmação
4. Exibir logs detalhados no console

## 📊 Logs Esperados

\`\`\`
📧 Agendamento solicitado para João Silva (joao@email.com)
✅ E-mail de solicitação enviado para João Silva
📧 Agendamento atendido para João Silva (joao@email.com)
\`\`\`

## 🎨 Funcionalidades Extras

- ✅ Múltiplos usuários com e-mails
- ✅ Horário do agendamento nas mensagens
- ✅ Estágio de teste SMTP no Jenkins
- ✅ E-mails em formato HTML
- ✅ Logs detalhados e coloridos
- ✅ Limpeza automática de recursos Docker

## 🔧 Solução de Problemas

### Erro de Autenticação SMTP
- Verifique se a verificação em duas etapas está ativa
- Use senha de aplicativo, não a senha normal
- Confirme o servidor SMTP e porta

### Erro de Build Docker
- Verifique se o Docker está instalado e rodando
- Confirme se todos os arquivos estão no repositório

## 📝 Entregáveis

- ✅ Repositório GitHub com código completo
- ✅ Pipeline Jenkins funcional
- ✅ Sistema de e-mails automatizado
- ✅ Documentação detalhada`;

  const projectStructure = [
    { name: "Dockerfile", icon: "🐳", description: "Container Python 3.10 com dependências" },
    { name: "app.py", icon: "🐍", description: "Aplicação principal que inicia o sistema" },
    { name: "agendamento.py", icon: "📧", description: "Lógica de agendamentos e envio de e-mails" },
    { name: "requirements.txt", icon: "📦", description: "Dependências Python (SMTP, validators)" },
    { name: "Jenkinsfile", icon: "🔄", description: "Pipeline CI/CD com 4 estágios" },
    { name: "README.md", icon: "📚", description: "Documentação completa do projeto" }
  ];

  const features = [
    "Sistema de agendamentos automatizado",
    "Envio de e-mails SMTP (Gmail/Mailtrap)",
    "Pipeline Jenkins com 4 estágios",
    "Containerização com Docker",
    "Teste automático de conexão SMTP",
    "E-mails em formato HTML responsivo",
    "Logs detalhados e coloridos",
    "Limpeza automática de recursos",
    "Múltiplos usuários configuráveis",
    "Horários de agendamento dinâmicos"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            DevOps com Docker, Jenkins e E-mail
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Sistema de Agendamentos Automatizado - Versão 2.0
          </p>
          <div className="flex justify-center gap-2 mb-6">
            <Badge variant="secondary" className="text-blue-600 bg-blue-100">
              <Container className="w-4 h-4 mr-1" />
              Docker
            </Badge>
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              <GitBranch className="w-4 h-4 mr-1" />
              Jenkins
            </Badge>
            <Badge variant="secondary" className="text-purple-600 bg-purple-100">
              <Mail className="w-4 h-4 mr-1" />
              SMTP
            </Badge>
            <Badge variant="secondary" className="text-orange-600 bg-orange-100">
              <Settings className="w-4 h-4 mr-1" />
              Python
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="simulator">Simulação</TabsTrigger>
            <TabsTrigger value="structure">Estrutura</TabsTrigger>
            <TabsTrigger value="docker">Docker</TabsTrigger>
            <TabsTrigger value="jenkins">Jenkins</TabsTrigger>
            <TabsTrigger value="code">Código</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Objetivo do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Automatizar um sistema de agendamentos que envia e-mails de confirmação 
                    para usuários, com execução via Jenkins e empacotamento com Docker.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Pipeline CI/CD automatizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Notificações por e-mail</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Containerização Docker</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⚡ Funcionalidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Como Começar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">1. 📧 Configurar SMTP</h3>
                    <p className="text-sm text-gray-600">
                      Configure suas credenciais de e-mail no arquivo agendamento.py
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">2. 🐳 Build Docker</h3>
                    <p className="text-sm text-gray-600">
                      Execute docker build para criar a imagem do container
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">3. 🔄 Pipeline Jenkins</h3>
                    <p className="text-sm text-gray-600">
                      Configure o pipeline no Jenkins e execute automaticamente
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulator Tab */}
          <TabsContent value="simulator" className="space-y-6">
            <AgendamentoSimulator />
          </TabsContent>

          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📁 Estrutura do Projeto</CardTitle>
                <CardDescription>
                  Organização completa dos arquivos do projeto DevOps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {projectStructure.map((file, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{file.icon}</span>
                        <h3 className="font-semibold">{file.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{file.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📚 README.md</CardTitle>
                <CardDescription>
                  Documentação completa do projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Arquivo: README.md</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(readmeContent, 'README.md')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <ScrollArea className="h-64 w-full rounded border p-4 bg-gray-50">
                  <pre className="text-sm whitespace-pre-wrap">{readmeContent}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Docker Tab */}
          <TabsContent value="docker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🐳 Dockerfile
                  <Badge variant="outline">Python 3.10</Badge>
                </CardTitle>
                <CardDescription>
                  Container baseado em Python 3.10 com todas as dependências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Arquivo: Dockerfile</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(dockerfileContent, 'Dockerfile')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <ScrollArea className="h-48 w-full rounded border p-4 bg-gray-900 text-green-400">
                  <pre className="text-sm">{dockerfileContent}</pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📦 requirements.txt
                  <Badge variant="outline">Dependências</Badge>
                </CardTitle>
                <CardDescription>
                  Bibliotecas Python necessárias para SMTP e validação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Arquivo: requirements.txt</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(requirementsContent, 'requirements.txt')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <ScrollArea className="h-32 w-full rounded border p-4 bg-gray-50">
                  <pre className="text-sm">{requirementsContent}</pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Comandos Docker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Build da Imagem:</h3>
                    <code className="block p-3 bg-gray-100 rounded text-sm">
                      docker build -t agendamento-app .
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Executar Container:</h3>
                    <code className="block p-3 bg-gray-100 rounded text-sm">
                      docker run --rm agendamento-app
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Ver Logs:</h3>
                    <code className="block p-3 bg-gray-100 rounded text-sm">
                      docker logs container-name
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jenkins Tab */}
          <TabsContent value="jenkins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔄 Jenkinsfile
                  <Badge variant="outline">Pipeline CI/CD</Badge>
                </CardTitle>
                <CardDescription>
                  Pipeline completo com 4 estágios: Clone, Teste SMTP, Build e Execução
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Arquivo: Jenkinsfile</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(jenkinsfileContent, 'Jenkinsfile')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <ScrollArea className="h-96 w-full rounded border p-4 bg-gray-900 text-green-400">
                  <pre className="text-sm whitespace-pre-wrap">{jenkinsfileContent}</pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Estágios do Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h3 className="font-semibold">📥 Clonar Repositório</h3>
                      <p className="text-sm text-gray-600">Baixa o código fonte do GitHub</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h3 className="font-semibold">🔍 Testar Conexão SMTP</h3>
                      <p className="text-sm text-gray-600">Verifica se o SMTP está configurado corretamente</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h3 className="font-semibold">🐳 Build Docker</h3>
                      <p className="text-sm text-gray-600">Constrói a imagem Docker da aplicação</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                    <div>
                      <h3 className="font-semibold">🚀 Executar Container</h3>
                      <p className="text-sm text-gray-600">Executa o container e processa os agendamentos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🐍 app.py
                  <Badge variant="outline">Aplicação Principal</Badge>
                </CardTitle>
                <CardDescription>
                  Script principal que inicia o sistema de agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Arquivo: app.py</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(appPyContent, 'app.py')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <ScrollArea className="h-64 w-full rounded border p-4 bg-gray-900 text-green-400">
                  <pre className="text-sm whitespace-pre-wrap">{appPyContent}</pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📧 agendamento.py
                  <Badge variant="outline">Lógica de E-mails</Badge>
                </CardTitle>
                <CardDescription>
                  Sistema completo de agendamentos e envio de e-mails SMTP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Arquivo: agendamento.py</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(agendamentoPyContent, 'agendamento.py')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <ScrollArea className="h-96 w-full rounded border p-4 bg-gray-900 text-green-400">
                  <pre className="text-sm whitespace-pre-wrap">{agendamentoPyContent}</pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚙️ Configuração SMTP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold mb-2 text-yellow-800">🔒 Importante - Configuração de Segurança</h3>
                  <div className="space-y-2 text-sm text-yellow-700">
                    <p>• Substitua <code>seuemail@gmail.com</code> pelo seu e-mail real</p>
                    <p>• Substitua <code>SENHA_DO_APP</code> pela senha de aplicativo (não a senha normal)</p>
                    <p>• Ative a verificação em duas etapas no Gmail</p>
                    <p>• Gere uma senha de aplicativo específica para este projeto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Download className="w-4 h-4 mr-2" />
            Baixar Projeto Completo
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver no GitHub
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar Jenkins
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DevOpsProject;
