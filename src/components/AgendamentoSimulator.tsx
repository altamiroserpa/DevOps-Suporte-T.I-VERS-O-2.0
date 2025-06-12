
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Mail, CheckCircle, User, Calendar, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  horarioAgendamento: string;
  statusSolicitacao: 'pendente' | 'enviado' | 'confirmado';
  statusConfirmacao: 'pendente' | 'enviado' | 'concluido';
}

const AgendamentoSimulator = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nome: "João Silva", email: "joao@email.com", horarioAgendamento: "11/06/2025 às 14:30", statusSolicitacao: 'pendente', statusConfirmacao: 'pendente' },
    { id: 2, nome: "Maria Santos", email: "maria@email.com", horarioAgendamento: "11/06/2025 às 16:30", statusSolicitacao: 'pendente', statusConfirmacao: 'pendente' },
    { id: 3, nome: "Pedro Oliveira", email: "pedro@email.com", horarioAgendamento: "11/06/2025 às 18:30", statusSolicitacao: 'pendente', statusConfirmacao: 'pendente' },
    { id: 4, nome: "Ana Costa", email: "ana@email.com", horarioAgendamento: "11/06/2025 às 20:30", statusSolicitacao: 'pendente', statusConfirmacao: 'pendente' },
    { id: 5, nome: "Carlos Ferreira", email: "carlos@email.com", horarioAgendamento: "11/06/2025 às 22:30", statusSolicitacao: 'pendente', statusConfirmacao: 'pendente' }
  ]);

  const [logs, setLogs] = useState<string[]>([
    "🚀 INICIANDO SISTEMA DE AGENDAMENTOS - v2.0",
    "=" * 50,
    "📧 Iniciando processamento de agendamentos...",
    "🔄 Testando conexão SMTP...",
    "✅ Conexão SMTP estabelecida com sucesso!"
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const processarAgendamento = async (usuario: Usuario, step: 'solicitacao' | 'confirmacao') => {
    if (step === 'solicitacao') {
      addLog(`📅 Agendamento solicitado para ${usuario.nome} (${usuario.email}) - ${usuario.horarioAgendamento}`);
      
      // Simular envio de e-mail
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsuarios(prev => prev.map(u => 
        u.id === usuario.id ? { ...u, statusSolicitacao: 'enviado' } : u
      ));
      
      addLog(`✅ E-mail de solicitação enviado para ${usuario.nome}`);
      toast.success(`E-mail de solicitação enviado para ${usuario.nome}`);
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 500));
      addLog(`⏳ Processando agendamento para ${usuario.nome}...`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // Confirmação
      setUsuarios(prev => prev.map(u => 
        u.id === usuario.id ? { ...u, statusConfirmacao: 'enviado' } : u
      ));
      
      addLog(`📧 Agendamento atendido para ${usuario.nome} (${usuario.email}) - ${usuario.horarioAgendamento}`);
      toast.success(`Agendamento confirmado para ${usuario.nome}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsuarios(prev => prev.map(u => 
        u.id === usuario.id ? { ...u, statusSolicitacao: 'confirmado', statusConfirmacao: 'concluido' } : u
      ));
    }
  };

  const iniciarProcessamento = async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    
    // Reset estados
    setUsuarios(prev => prev.map(u => ({
      ...u,
      statusSolicitacao: 'pendente',
      statusConfirmacao: 'pendente'
    })));
    
    setLogs([
      "🚀 INICIANDO SISTEMA DE AGENDAMENTOS - v2.0",
      "=" * 50,
      "📧 Iniciando processamento de agendamentos...",
      "🔄 Testando conexão SMTP...",
      "✅ Conexão SMTP estabelecida com sucesso!"
    ]);

    // Processar cada usuário
    for (let i = 0; i < usuarios.length; i++) {
      setCurrentStep(i + 1);
      const usuario = usuarios[i];
      
      // Enviar solicitação
      await processarAgendamento(usuario, 'solicitacao');
      
      // Enviar confirmação
      await processarAgendamento(usuario, 'confirmacao');
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const totalAgendamentos = usuarios.length;
    const totalEmails = usuarios.length * 2;
    
    addLog(`📊 Resumo: ${totalAgendamentos} agendamentos processados`);
    addLog(`📧 Total de e-mails enviados: ${totalEmails}`);
    addLog("=" * 50);
    addLog("🎉 SISTEMA FINALIZADO");
    addLog("=" * 50);
    
    setIsProcessing(false);
    setCurrentStep(0);
    toast.success("Processamento concluído com sucesso!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'enviado':
        return <Badge className="bg-blue-100 text-blue-700">Enviado</Badge>;
      case 'confirmado':
        return <Badge className="bg-green-100 text-green-700">Confirmado</Badge>;
      case 'concluido':
        return <Badge className="bg-green-100 text-green-700">Concluído</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Sistema de Agendamentos em Funcionamento
          </CardTitle>
          <CardDescription>
            Simulação do processo de envio de e-mails de solicitação e confirmação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={iniciarProcessamento}
              disabled={isProcessing}
              className="bg-gradient-to-r from-blue-600 to-blue-700"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processando... (Usuário {currentStep}/5)
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Iniciar Processamento
                </>
              )}
            </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Usuários</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {usuarios.filter(u => u.statusSolicitacao === 'enviado' || u.statusSolicitacao === 'confirmado').length}
              </div>
              <div className="text-sm text-gray-600">Solicitações Enviadas</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {usuarios.filter(u => u.statusConfirmacao === 'concluido').length}
              </div>
              <div className="text-sm text-gray-600">Confirmações Enviadas</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {usuarios.filter(u => u.statusSolicitacao === 'enviado' || u.statusSolicitacao === 'confirmado').length + 
                 usuarios.filter(u => u.statusConfirmacao === 'concluido').length}
              </div>
              <div className="text-sm text-gray-600">Total E-mails</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Lista de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{usuario.nome}</h3>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {usuario.horarioAgendamento}
                      </div>
                    </div>
                    {currentStep === usuario.id && isProcessing && (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Solicitação:</span>
                      {getStatusBadge(usuario.statusSolicitacao)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Confirmação:</span>
                      {getStatusBadge(usuario.statusConfirmacao)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Console de Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Console de Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 w-full rounded border p-4 bg-gray-900 text-green-400 font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
              {isProcessing && (
                <div className="text-yellow-400 animate-pulse">
                  ⏳ Processando...
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* E-mails Templates */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">📧 Template - E-mail de Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="mb-3">
                <strong>Para:</strong> joao@email.com<br />
                <strong>Assunto:</strong> 🔔 Solicitação de Agendamento - João Silva
              </div>
              <div className="p-3 bg-white rounded border text-sm">
                <h3 className="font-bold mb-2">Olá, João Silva!</h3>
                <p>Sua solicitação de agendamento foi recebida com sucesso.</p>
                <p><strong>📅 Data/Hora:</strong> 11/06/2025 às 14:30</p>
                <p><strong>🔄 Status:</strong> Aguardando confirmação</p>
                <p>Em breve você receberá a confirmação do seu agendamento.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">✅ Template - E-mail de Confirmação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="mb-3">
                <strong>Para:</strong> joao@email.com<br />
                <strong>Assunto:</strong> ✅ Agendamento Confirmado - João Silva
              </div>
              <div className="p-3 bg-white rounded border text-sm">
                <h3 className="font-bold mb-2 text-green-600">Agendamento Confirmado!</h3>
                <p>Olá, João Silva!</p>
                <p>Seu agendamento foi <strong>confirmado</strong> com sucesso!</p>
                <p><strong>📅 Data/Hora:</strong> 11/06/2025 às 14:30</p>
                <p><strong>✅ Status:</strong> Confirmado</p>
                <p>Obrigado por utilizar nosso sistema!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgendamentoSimulator;
