import { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Upload, 
  Trash2, 
  Shield, 
  Check, 
  Monitor, 
  LogOut,
  Smartphone,
  MessageSquare,
  CreditCard,
  Save
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../contexts/AuthContext';

const DashboardProfile = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [currentSession, setCurrentSession] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: user?.cpf || '',
    phone: user?.phone || '',
    discord: user?.discord || ''
  });

  useEffect(() => {
    const fetchSessionInfo = async () => {
        // Detect Browser and OS
        const userAgent = navigator.userAgent;
        let browser = 'Desconhecido';
        if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
        else if (userAgent.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
        else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
        else if (userAgent.indexOf("Trident") > -1) browser = "Internet Explorer";
        else if (userAgent.indexOf("Edge") > -1) browser = "Edge";
        else if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
        else if (userAgent.indexOf("Safari") > -1) browser = "Safari";

        let os = 'Desconhecido';
        if (userAgent.indexOf("Win") !== -1) os = "Windows";
        else if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
        else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
        else if (userAgent.indexOf("Android") !== -1) os = "Android";
        else if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

        // Fetch IP (mocking the fetch if it fails or using a simple public API)
        let ip = '127.0.0.1';
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            if (response.ok) {
                const data = await response.json();
                ip = data.ip;
            }
        } catch (error) {
            console.log('Using fallback IP');
        }

        setCurrentSession({
            browser,
            os,
            ip,
            device: /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Desktop',
            createdAt: new Date().toISOString() // Simulating session start time as "now" for this view or getting from user login time
        });
    };

    fetchSessionInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      const dataToUpdate = {
        ...formData,
        avatar: avatarPreview
      };
      
      await updateProfile(dataToUpdate);
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex">
      <DashboardSidebar />
      
      <main className="flex-1 ml-[90px] p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Configurações</h1>
          <p className="text-gray-400">sua conta, API keys e integrações</p>
        </header>

        <div className="max-w-4xl space-y-6">
          {/* Profile Section */}
          <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Column */}
              <div className="flex flex-col gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-purple-500/20 overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'K'
                  )}
                </div>
                <button 
                  onClick={handleUploadClick}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a2e] hover:bg-[#252540] border border-white/10 rounded-lg text-sm font-medium transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
                <button 
                  onClick={handleRemoveAvatar}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover
                </button>
              </div>

              {/* Form Column */}
              <div className="flex-1 w-full space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Nome
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    readOnly
                    className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">O email não pode ser alterado</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> CPF
                        </label>
                        <input 
                            type="text" 
                            name="cpf"
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={handleChange}
                            className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                            <Smartphone className="w-4 h-4" /> Telefone
                        </label>
                        <input 
                            type="text" 
                            name="phone"
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Discord
                  </label>
                  <input 
                    type="text" 
                    name="discord"
                    placeholder="seu_usuario#0000"
                    value={formData.discord}
                    onChange={handleChange}
                    className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-400" /> Informações da Conta
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <span className="block text-xs text-gray-500 mb-1 flex items-center gap-2">
                   ID da Conta
                </span>
                <p className="font-mono text-gray-300 text-sm">{user?.id || 'N/A'}</p>
              </div>
              
              <div>
                <span className="block text-xs text-gray-500 mb-1 flex items-center gap-2">
                   <Mail className="w-3 h-3" /> Email Verificado
                </span>
                <p className="text-green-500 font-bold text-sm flex items-center gap-1">
                  <Check className="w-4 h-4" /> Verificado
                </p>
              </div>

              <div>
                <span className="block text-xs text-gray-500 mb-1 flex items-center gap-2">
                   <Shield className="w-3 h-3" /> Tipo de Conta
                </span>
                <p className="text-white font-bold">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
              </div>

              <div>
                <span className="block text-xs text-gray-500 mb-1 flex items-center gap-2">
                   Membro desde
                </span>
                <p className="text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>

              <div>
                <span className="block text-xs text-gray-500 mb-1 flex items-center gap-2">
                   Última Atualização
                </span>
                <p className="text-white">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>

              <div>
                <span className="block text-xs text-gray-500 mb-1 flex items-center gap-2">
                   Método de Login
                </span>
                <p className="text-white">Email e Senha</p>
              </div>
            </div>
          </div>

          {/* Active Sessions Section */}
          <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-gray-400" /> Sessões Ativas
                </h3>
                <button className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                    <LogOut className="w-3 h-3" /> Encerrar Outras
                </button>
            </div>
            <p className="text-gray-500 text-sm mb-6">Gerencie os dispositivos e navegadores onde sua conta está conectada.</p>
            
            <div className="space-y-4">
                {/* Current Session */}
                <div className="bg-[#13131f] border border-green-500/20 p-4 rounded-xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                            {currentSession?.device === 'Mobile' ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-sm">{currentSession ? `${currentSession.browser} em ${currentSession.os}` : 'Carregando...'}</h4>
                                <span className="bg-green-500 text-[#030014] text-[10px] font-bold px-2 py-0.5 rounded-full">Sessão Atual</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <span>{currentSession?.ip || '...'}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span>Criada agora</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">Expira em 30 dias</p>
                        </div>
                    </div>
                </div>

                {/* Other Session 1 (Mock for history) */}
                <div className="bg-[#13131f] border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                            <Monitor className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Chrome em Windows</h4>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <span>177.9.217.225</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span>Criada em 01 de jan. de 2026, 18:10</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">Expira em 09 de jan. de 2026</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-all flex items-center gap-2">
                        <Trash2 className="w-3 h-3" /> Encerrar
                    </button>
                </div>

                {/* Other Session 2 */}
                <div className="bg-[#13131f] border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                            <Monitor className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Chrome em Windows</h4>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <span>177.8.52.132</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span>Criada em 28 de dez. de 2025, 00:00</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">Expira em 10 de jan. de 2026</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-all flex items-center gap-2">
                        <Trash2 className="w-3 h-3" /> Encerrar
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardProfile;
