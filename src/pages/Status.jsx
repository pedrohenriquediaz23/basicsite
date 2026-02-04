import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Globe, 
  Database, 
  Cpu, 
  ShieldCheck,
  Activity,
  Clock
} from 'lucide-react';

const Status = () => {
  const services = [
    {
      name: 'Website / Frontend',
      description: 'Acesso ao site principal e painel do usuário',
      status: 'operational',
      icon: Globe
    },
    {
      name: 'Autenticação & Login',
      description: 'Sistema de login, registro e recuperação de senha',
      status: 'operational',
      icon: ShieldCheck
    },
    {
      name: 'Banco de Dados',
      description: 'Persistência de dados e informações de usuários',
      status: 'operational',
      icon: Database
    },
    {
      name: 'API de Máquinas',
      description: 'Sistema de provisionamento e controle das VMs',
      status: 'operational',
      icon: Cpu
    },
    {
      name: 'Pagamentos (Gateway)',
      description: 'Processamento de transações e PIX',
      status: 'operational',
      icon: Activity
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'operational':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          label: 'Operacional',
          icon: CheckCircle
        };
      case 'maintenance':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          label: 'Em Manutenção',
          icon: Clock
        };
      case 'incident':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          label: 'Indisponível',
          icon: XCircle
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
          label: 'Desconhecido',
          icon: AlertTriangle
        };
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-[#030014] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-20">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                    <Activity className="w-4 h-4" />
                    System Status
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Status dos Serviços
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Acompanhe em tempo real a disponibilidade de todos os nossos sistemas e serviços.
                </p>
            </div>

            {/* Overall Status Banner */}
            <div className="bg-[#0f0f1a] border border-green-500/30 rounded-2xl p-6 mb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <div className="flex items-start md:items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl shrink-0">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Todos os Sistemas Operacionais</h2>
                        <p className="text-gray-400 text-sm">
                            Todos os serviços estão funcionando normalmente sem interrupções.
                        </p>
                    </div>
                </div>
            </div>

            {/* Services List */}
            <div className="space-y-4">
                {services.map((service, index) => {
                    const config = getStatusConfig(service.status);
                    const StatusIcon = config.icon;
                    const ServiceIcon = service.icon;

                    return (
                        <div key={index} className="bg-[#0f0f1a]/60 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-lg text-gray-400">
                                    <ServiceIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{service.name}</h3>
                                    <p className="text-sm text-gray-500">{service.description}</p>
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.bgColor} ${config.borderColor} ${config.color} whitespace-nowrap`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="font-bold text-sm">{config.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Last Update */}
            <div className="mt-12 text-center text-gray-600 text-sm">
                <p>Última atualização: {new Date().toLocaleTimeString()} - Atualizado automaticamente</p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Status;
