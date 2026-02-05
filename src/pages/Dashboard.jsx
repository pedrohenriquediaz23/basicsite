import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Cloud, 
  Cpu, 
  HardDrive, 
  Activity, 
  Shield, 
  Power,
  RotateCw,
  Monitor,
  Trash2,
  RefreshCw,
  Terminal,
  Smartphone,
  Ticket,
  Copy
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { nebulaService } from '../services/nebulaService';

const VMCard = ({ vm, onAction }) => {
  const [loading, setLoading] = useState(false);
  const isOnline = vm.status === 'online';
  const statusText = vm.status === 'unknown' ? 'verificando' : vm.status;
  const statusDisplay = vm.status === 'unknown' ? 'Verificando' : vm.status;

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await onAction(action, vm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6 mb-6 hover:border-purple-500/20 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1c1c2e] flex items-center justify-center border border-white/5">
            <Cloud className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white">{vm.name}</h3>
              <span className="text-xs text-gray-500 font-mono">({vm.id})</span>
              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
                isOnline 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-[10px] font-bold uppercase">{statusText}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Criado em {vm.created_at}
            </p>
          </div>
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0f0f1a] p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Tamanho</span>
          </div>
          <p className="text-sm font-bold text-white">{vm.sizeGb || vm.specs?.storage || 'N/A'} GB</p>
        </div>
        <div className="bg-[#0f0f1a] p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Tipo</span>
          </div>
          <p className="text-sm font-bold text-white">{vm.type || vm.specs?.cpu || 'Standard'}</p>
        </div>
        <div className="bg-[#0f0f1a] p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Status</span>
          </div>
          <p className={`text-sm font-bold ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
            {isOnline ? 'Operacional' : (statusDisplay === 'Verificando' ? 'Verificando' : (statusDisplay === 'online' ? 'Operacional' : 'Inativo'))}
          </p>
        </div>
        <div className="bg-[#0f0f1a] p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Expira em</span>
          </div>
          <p className="text-sm font-bold text-white">{vm.expires_at}</p>
        </div>
      </div>


      {/* Connection Info Toggle - HIDDEN AS REQUESTED
      {isOnline && vm.connection && (
        <div className="mb-6">
            <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#0f0f1a] border border-white/5 hover:bg-white/5 rounded-xl transition-all group"
            >
                <span className="text-sm font-medium text-gray-300 group-hover:text-white flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-purple-400" />
                    {showDetails ? 'Ocultar Detalhes de Conexão' : 'Mostrar Detalhes de Conexão'}
                </span>
                {showDetails ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
            </button>

            {showDetails && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4 flex items-start gap-3">
                        <div className="mt-0.5 p-1 bg-green-500 rounded-full">
                            <Activity className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-green-400">Máquina Online e Pronta!</h4>
                            <p className="text-xs text-green-300/70 mt-0.5">Use as credenciais abaixo para se conectar</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#0f0f1a] p-4 rounded-xl border border-white/5 relative group">
                            <div className="flex items-center gap-2 mb-2">
                                <Wifi className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-bold text-gray-300">IP Público</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <code className="text-sm text-white font-mono">{vm.connection.ip}</code>
                                <button onClick={() => copyToClipboard(vm.connection.ip)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <Copy className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0f0f1a] p-4 rounded-xl border border-white/5 relative group">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-bold text-gray-300">Usuário</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <code className="text-sm text-white font-mono">{vm.connection.user}</code>
                                <button onClick={() => copyToClipboard(vm.connection.user)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <Copy className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0f0f1a] p-4 rounded-xl border border-white/5 relative group">
                            <div className="flex items-center gap-2 mb-2">
                                <Key className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-bold text-gray-300">Senha</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <code className="text-sm text-white font-mono">
                                    {showPassword ? vm.connection.password : '••••••••••••'}
                                </code>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setShowPassword(!showPassword)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <button onClick={() => copyToClipboard(vm.connection.password)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                        <Copy className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
      */}

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3">
        {isOnline ? (
            <>
                <button 
                    onClick={() => handleAction('connect')}
                    className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <Monitor className="w-4 h-4" />
                    Conectar à Máquina
                </button>
                <button 
                    disabled={loading}
                    onClick={() => handleAction('restart')}
                    className="flex-1 bg-[#2e1d05] hover:bg-[#422a08] text-orange-400 border border-orange-500/30 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
                    Reiniciar
                </button>
                <button 
                    disabled={loading}
                    onClick={() => handleAction('stop')}
                    className="flex-1 bg-[#2e0505] hover:bg-[#420808] text-red-400 border border-red-500/30 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Power className="w-4 h-4" />
                    Desligar
                </button>
            </>
        ) : (
            <button 
                disabled={loading}
                onClick={() => handleAction('start')}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                Iniciar Máquina
            </button>
        )}
        
        <div className="flex gap-2">
            <button 
                title="Formatar Disco"
                onClick={() => handleAction('format')}
                className="p-3 bg-[#0f0f1a] hover:bg-red-900/20 text-gray-400 hover:text-red-400 border border-white/5 rounded-xl transition-all"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            <button 
                title="Parear Dispositivo"
                onClick={() => handleAction('pair')}
                className="p-3 bg-[#0f0f1a] hover:bg-purple-900/20 text-gray-400 hover:text-purple-400 border border-white/5 rounded-xl transition-all"
            >
                <Smartphone className="w-4 h-4" />
            </button>
            <button 
                title="Gerar Token de Acesso"
                onClick={() => handleAction('generate-token')}
                className="p-3 bg-[#0f0f1a] hover:bg-yellow-900/20 text-gray-400 hover:text-yellow-400 border border-white/5 rounded-xl transition-all"
            >
                <Ticket className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('fusion_user') || '{}');
  // Enhanced admin detection: checks boolean isAdmin OR role 'admin'
  const isAdmin = user?.isAdmin === true || user?.role === 'admin';

  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const vmsRef = useRef([]);
  
  // Redeem Token State
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [token, setToken] = useState('');

  // Generate Token State
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [selectedDiskId, setSelectedDiskId] = useState(null);
  const [maxUses, setMaxUses] = useState(1);
  const [duration, setDuration] = useState('permanent'); // 'permanent', '7days', '30days'
  const [generatedToken, setGeneratedToken] = useState(null);

  // Admin Token Management
  const [adminTokens, setAdminTokens] = useState([]);
  const [adminTokensModalOpen, setAdminTokensModalOpen] = useState(false);

  const loadTokens = async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch('/api/local/tokens');
      if (res.ok) {
        const data = await res.json();
        setAdminTokens(data);
      }
    } catch (e) {
      console.error('Failed to load tokens', e);
    }
  };

  const handleDeleteToken = async (tokenStr) => {
    if (!confirm('Tem certeza que deseja remover este token?')) return;
    try {
      const res = await fetch(`/api/local/tokens/${tokenStr}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminTokens(prev => prev.filter(t => t.token !== tokenStr));
        alert('Token removido.');
      } else {
        alert('Erro ao remover: ' + data.error);
      }
    } catch (e) {
      alert('Erro de conexão.');
    }
  };

  useEffect(() => {
    if (isAdmin && adminTokensModalOpen) {
      loadTokens();
    }
  }, [isAdmin, adminTokensModalOpen]);


  useEffect(() => {
    loadVms();
  }, []);

  useEffect(() => {
    vmsRef.current = vms;
  }, [vms]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void refreshVmStatuses(vmsRef.current);
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  const refreshVmStatuses = async (currentVms) => {
    const results = await Promise.allSettled(
      (currentVms || []).map(async (vm) => {
        const diskName = vm?.name;
        if (!diskName) return null;
        if (vm?.status === 'expired') return null;
        const statusRes = await nebulaService.getStatus(diskName);
        if (!statusRes?.status) return null;
        return { id: vm?.id, status: statusRes.status };
      })
    );

    const statusById = results.reduce((acc, r) => {
      if (r.status !== 'fulfilled' || !r.value?.id) return acc;
      acc[r.value.id] = r.value.status;
      return acc;
    }, {});

    setVms((prev) =>
      (prev || []).map((vm) => {
        const nextStatus = statusById[vm?.id];
        if (!nextStatus) return vm;
        return { ...vm, status: nextStatus };
      })
    );
  };

  const loadVms = async () => {
    try {
      setError(null);
      const data = await nebulaService.getAll();
      
      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setVms(data);
        void refreshVmStatuses(data);
      } else if (data && Array.isArray(data.data)) {
        // Handle case where API returns object with data array
        setVms(data.data);
        void refreshVmStatuses(data.data);
      } else if (data && Array.isArray(data.vms)) {
        // Handle case where API returns object with vms array
        setVms(data.vms);
        void refreshVmStatuses(data.vms);
      } else {
        console.error('Invalid data format received from API:', data);
        setVms([]);
        if (data && data.error) {
           setError(data.error);
        }
      }
    } catch (error) {
      console.error("Failed to load VMs", error);
      setError('Não foi possível conectar à API da Fusion Cloud. Verifique a URL e sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleVMAction = async (action, vm) => {
    // Optimistic update or reload after action
    const vmIndex = vms.findIndex(v => v.id === vm?.id);
    if (vmIndex === -1) return;

    const newVms = [...vms];
    
    try {
        if (action === 'start') {
            newVms[vmIndex].status = 'starting'; // Temporary state
            setVms(newVms);
            await nebulaService.start(vm?.name);
            newVms[vmIndex].status = 'online';
            // Mock adding connection info
            newVms[vmIndex].connection = {
                ip: '34.39.185.232',
                user: 'nebulagg.com',
                password: 'password123'
            };
        } else if (action === 'stop') {
            newVms[vmIndex].status = 'stopping';
            setVms(newVms);
            await nebulaService.stop(vm?.name);
            newVms[vmIndex].status = 'offline';
            newVms[vmIndex].connection = null;
        } else if (action === 'restart') {
            await nebulaService.restart(vm?.name);
        } else if (action === 'format') {
            if (confirm('Tem certeza que deseja formatar este disco? Todos os dados serão perdidos.')) {
                await nebulaService.format(vm?.id);
                alert('Disco formatado com sucesso.');
            }
        } else if (action === 'pair') {
            const pin = prompt('Digite o PIN do dispositivo:');
            if (pin) {
                await nebulaService.pairDevice(vm?.name, pin);
                alert('Dispositivo pareado com sucesso.');
            }
        } else if (action === 'generate-token') {
            setSelectedDiskId(vm?.id);
            setGeneratedToken(null);
            setMaxUses(1);
            setDuration('permanent');
            setGenerateModalOpen(true);
            return; // Don't trigger vm state update logic
        }
        setVms([...newVms]);
    } catch (error) {
        console.error("Action failed", error);
        alert('Falha na operação: ' + error.message);
        loadVms(); // Revert on error
    }
  };

  const handleRedeem = async (e) => {
      e.preventDefault();
      if (!token) return;
      try {
          await nebulaService.redeemToken(token.trim(), user);
          alert('Token resgatado com sucesso!');
          setToken('');
          setRedeemModalOpen(false);
          loadVms();
      } catch (error) {
          alert('Erro ao resgatar token: ' + error.message);
      }
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/local/tokens/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          diskId: selectedDiskId,
          maxUses: parseInt(maxUses),
          duration: duration
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setGeneratedToken(data.token);
      } else {
        alert('Erro ao gerar token');
      }
    } catch (error) {
      console.error('Error generating token:', error);
      alert('Erro de conexão');
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex">
      <DashboardSidebar />
      
      <main className="flex-1 ml-[90px] p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white mb-1">
                    {isAdmin ? 'Painel Administrativo' : 'Meus Discos'}
                </h1>
                {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                        Admin Mode
                    </span>
                )}
            </div>
            <div className="flex items-center gap-3">
                <p className="text-gray-400">
                    {isAdmin ? 'Visão geral de todas as instâncias do sistema' : 'Gerencie seus discos virtuais e recursos'}
                </p>
                {!loading && !error && (
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        API Operacional
                    </span>
                )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Busque por nome ou ID..." 
                className="bg-[#0f0f1a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 w-64 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
                onClick={() => setRedeemModalOpen(true)}
                className="px-4 py-2.5 bg-[#0f0f1a] hover:bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white transition-all flex items-center gap-2"
            >
                <Terminal className="w-4 h-4" />
                Resgatar Token
            </button>
            {isAdmin && (
                <button 
                    onClick={() => setAdminTokensModalOpen(true)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center gap-2"
                >
                    <Ticket className="w-4 h-4" />
                    Gerenciar Tokens
                </button>
            )}
            <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)] flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adquirir Máquina
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-5xl">
          {loading ? (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-[#13131f] border border-red-500/20 rounded-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Erro de Conexão</h3>
                <p className="text-gray-400 mb-6 max-w-md">{error}</p>
                <button 
                    onClick={loadVms}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Tentar Novamente
                </button>
            </div>
          ) : vms.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                Nenhuma máquina encontrada.
            </div>
          ) : (
            vms
            .filter(vm => {
                // Admin sees everything
                if (isAdmin) return true;
                
                // Normal user sees only their own VMs
                // Check if VM has owner info matching current user
                if (vm.ownerId && vm.ownerId === user.id) return true;
                if (vm.ownerEmail && vm.ownerEmail === user.email) return true;
                
                // If VM has no owner info (e.g. from legacy API), 
                // hide it from normal users to prevent "seeing all disks"
                return false; 
            })
            .map(vm => (
                <VMCard key={vm.id} vm={vm} onAction={handleVMAction} isAdmin={isAdmin} />
            ))
          )}
        </div>
      </main>

      {/* Redeem Modal */}
      {redeemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-[#13131f] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Resgatar Token</h3>
                  <form onSubmit={handleRedeem}>
                      <input 
                        type="text" 
                        placeholder="Insira seu código aqui..."
                        className="w-full bg-[#0f0f1a] border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-purple-500 font-mono"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                      />
                      <div className="flex gap-3">
                          <button 
                            type="button" 
                            onClick={() => setRedeemModalOpen(false)}
                            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-white transition-all"
                          >
                              Cancelar
                          </button>
                          <button 
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-bold text-white transition-all"
                          >
                              Resgatar
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Generate Token Modal */}
      {generateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-[#13131f] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Gerar Token de Acesso</h3>
                  
                  {!generatedToken ? (
                      <form onSubmit={handleGenerateSubmit}>
                          <div className="mb-4">
                              <label className="block text-sm text-gray-400 mb-2">Máximo de Usos</label>
                              <input 
                                type="number" 
                                min="1"
                                max="100"
                                className="w-full bg-[#0f0f1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                value={maxUses}
                                onChange={(e) => setMaxUses(e.target.value)}
                              />
                          </div>

                          <div className="mb-6">
                              <label className="block text-sm text-gray-400 mb-2">Duração do Acesso</label>
                              <div className="grid grid-cols-3 gap-3">
                                <button
                                  type="button"
                                  onClick={() => setDuration('permanent')}
                                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                                    duration === 'permanent' 
                                      ? 'bg-purple-600 border-purple-500 text-white' 
                                      : 'bg-[#0f0f1a] border-white/10 text-gray-400 hover:bg-white/5'
                                  }`}
                                >
                                  Permanente
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDuration('7days')}
                                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                                    duration === '7days' 
                                      ? 'bg-purple-600 border-purple-500 text-white' 
                                      : 'bg-[#0f0f1a] border-white/10 text-gray-400 hover:bg-white/5'
                                  }`}
                                >
                                  7 Dias
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDuration('30days')}
                                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                                    duration === '30days' 
                                      ? 'bg-purple-600 border-purple-500 text-white' 
                                      : 'bg-[#0f0f1a] border-white/10 text-gray-400 hover:bg-white/5'
                                  }`}
                                >
                                  30 Dias
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                  {duration === 'permanent' && 'O acesso à máquina nunca expira.'}
                                  {duration === '7days' && 'A máquina desaparecerá para o usuário após 7 dias.'}
                                  {duration === '30days' && 'A máquina desaparecerá para o usuário após 30 dias.'}
                              </p>
                          </div>

                          <div className="flex gap-3">
                              <button 
                                type="button" 
                                onClick={() => setGenerateModalOpen(false)}
                                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-white transition-all"
                              >
                                  Cancelar
                              </button>
                              <button 
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-sm font-bold text-white transition-all"
                              >
                                  Gerar Token
                              </button>
                          </div>
                      </form>
                  ) : (
                      <div className="text-center">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
                              <p className="text-sm text-green-400 mb-2">Token Gerado com Sucesso!</p>
                              <div className="flex items-center justify-between bg-[#0f0f1a] p-3 rounded-lg border border-green-500/30">
                                  <code className="text-xl font-mono font-bold text-white tracking-wider">{generatedToken}</code>
                                  <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedToken);
                                        alert('Copiado!');
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                  >
                                      <Copy className="w-5 h-5 text-gray-400" />
                                  </button>
                              </div>
                          </div>
                          <button 
                            onClick={() => setGenerateModalOpen(false)}
                            className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold text-white transition-all"
                          >
                              Fechar
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Admin Tokens Modal */}
      {adminTokensModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-[#13131f] border border-white/10 p-6 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Gerenciar Tokens (Admin)</h3>
                      <button onClick={() => setAdminTokensModalOpen(false)} className="text-gray-400 hover:text-white">
                          ✕
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2">
                      {adminTokens.length === 0 ? (
                          <p className="text-gray-400 text-center py-8">Nenhum token ativo.</p>
                      ) : (
                          <div className="space-y-3">
                              {adminTokens.map((t, i) => (
                                  <div key={i} className="bg-[#0f0f1a] border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                                      <div>
                                          <div className="flex items-center gap-3 mb-1">
                                              <code className="text-lg font-mono font-bold text-yellow-400">{t.token}</code>
                                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                                                  {t.duration === 'permanent' ? 'Permanente' : t.duration}
                                              </span>
                                          </div>
                                          <div className="text-xs text-gray-500 flex items-center gap-4">
                                              <span>Disk: {t.diskId}</span>
                                              <span>Usos: {t.uses || 0} / {t.maxUses}</span>
                                              <span>Criado: {new Date(t.createdAt).toLocaleDateString()}</span>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={() => handleDeleteToken(t.token)}
                                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                          title="Excluir Token"
                                      >
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                      <button 
                        onClick={() => setAdminTokensModalOpen(false)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold text-white transition-all"
                      >
                          Fechar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
