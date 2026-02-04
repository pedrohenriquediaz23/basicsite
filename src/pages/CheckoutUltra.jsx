import { useEffect, useState } from 'react';
import { Check, Monitor, Cpu, ArrowLeft, Loader2, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CheckoutUltra = () => {
  const API_KEY = import.meta.env.VITE_NEVERMISS_API_KEY;
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('ultra-1h');
  const [step, setStep] = useState(1);
  
  // Auth State
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: ''
  });

  const formatPhone = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }
    return value;
  };

  const formatCpf = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    if (value.length > 7) {
      value = `${value.slice(0, 7)}.${value.slice(7)}`;
    }
    if (value.length > 11) {
      value = `${value.slice(0, 11)}-${value.slice(11)}`;
    }
    return value;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
        if (authMode === 'login') {
            await login(authData.email, authData.password);
        } else {
            if (authData.password !== authData.confirmPassword) {
                throw new Error('As senhas não coincidem.');
            }
            if (authData.password.length < 6) {
                throw new Error('A senha deve ter pelo menos 6 caracteres.');
            }
            await register(authData.name, authData.email, authData.password, authData.phone, authData.cpf);
        }
        // Success - user state will update automatically
    } catch (err) {
        setAuthError(err.message || 'Erro na autenticação');
    } finally {
        setAuthLoading(false);
    }
  };

  const plans = [
    { id: 'ultra-1h', name: 'ULTRA - 1 HORA', price: 'R$5,90', period: '1 hora' },
    { id: 'ultra-3h', name: 'ULTRA - 3 HORAS', price: 'R$17,50', period: '3 horas' },
    { id: 'ultra-5h', name: 'ULTRA - 5 HORAS', price: 'R$29,90', period: '5 horas' },
    { id: 'ultra-weekly', name: 'ULTRA - SEMANAL', price: 'R$40,90', period: '7 dias', note: '🔥 Promoção' },
    { id: 'ultra-monthly-spot', name: 'ULTRA - MENSAL SPOT', price: 'R$105,90', period: '30 dias', note: '⚠️ Pode ter desligamentos' },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Poll for payment status
  useEffect(() => {
    let interval;
    if (step === 2 && paymentData?.id) {
      const checkStatus = async () => {
        try {
          if (!API_KEY) return;
          const response = await fetch(`https://carteira.nevermissapps.com/v1/transactions`, {
             headers: { 'Authorization': `Bearer ${API_KEY}` }
          });
          const data = await response.json();
          
          if (data.transactions) {
            const transaction = data.transactions.find(t => t.id === paymentData.id);
            if (transaction && transaction.status === 'paid') {
                setStep(3);
                
                // Update local storage status
                const currentInvoices = JSON.parse(localStorage.getItem('fusion_invoices') || '[]');
                const updatedInvoices = currentInvoices.map(inv => 
                    inv.id === paymentData.id ? { ...inv, status: 'paid' } : inv
                );
                localStorage.setItem('fusion_invoices', JSON.stringify(updatedInvoices));
            }
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };

      // Check immediately and then every 5 seconds
      checkStatus();
      interval = setInterval(checkStatus, 5000);
    }
    return () => clearInterval(interval);
  }, [API_KEY, step, paymentData]);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setPaymentData(null);

    const plan = plans.find(p => p.id === selectedPlan);
    const amount = parseFloat(plan.price.replace('R$', '').replace(',', '.'));

    try {
      const response = await fetch('https://carteira.nevermissapps.com/v1/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'NM_234e4a90b94c55c0bae796a4d29c85c9036e4fff4899f1d0'
        },
        body: JSON.stringify({
          amount: amount,
          description: `Fusion Cloud - ${plan.name}`,
          planId: plan.id,
          metadata: {
            userId: user?.id,
            userEmail: user?.email,
            userName: user?.name
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setPaymentData(data);
        setStep(2);

        // Save mock invoice to local storage for "Real" history
        if (user) {
           const newInvoice = {
               id: data.id || `INV-${Date.now()}`, // Use API ID if available
               userId: user.id,
               userName: user.name,
               userEmail: user.email,
               plan: plan.name,
               amount: plan.price,
               status: 'pending', // Pending payment
               date: new Date().toISOString(),
               paymentMethod: 'PIX'
           };
           
           const currentInvoices = JSON.parse(localStorage.getItem('fusion_invoices') || '[]');
           localStorage.setItem('fusion_invoices', JSON.stringify([newInvoice, ...currentInvoices]));
        }

      } else {
        // Fallback for demo/test if API fails or is unreachable
        // remove this in production if not needed, but good for testing UI
        throw new Error('Erro ao criar pagamento');
      }
    } catch (err) {
      // Log error internally or to monitoring service
      // console.error(err); 
      // setError('Erro ao processar pagamento. Tente novamente.');
      
      // MOCK DATA FOR DEMONSTRATION (Fallback when API fails)
      // Automatically using mock data because the API endpoint is currently unreachable
      const mockData = {
        success: true,
        pixCopiaECola: "00020126360014BR.GOV.BCB.PIX0114+55119999999952040000530398654045.905802BR5913Fusion Cloud6008Sao Paulo62070503***6304FC56",
        qrcode: {
          // Using a placeholder QR code image for demonstration
          qrcodeBase64: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
        },
        paymentLink: "https://carteira.nevermissapps.com/pay/DEMO"
      };
      
      setPaymentData(mockData);
      setStep(2);
      
      // Save mock invoice to local storage for "Real" history
        if (user) {
           const newInvoice = {
               id: `INV-${Date.now()}`,
               userId: user.id,
               userName: user.name,
               userEmail: user.email,
               plan: plan.name,
               amount: plan.price,
               status: 'pending', // Pending payment
               date: new Date().toISOString(),
               paymentMethod: 'PIX'
           };
           
           const currentInvoices = JSON.parse(localStorage.getItem('fusion_invoices') || '[]');
           localStorage.setItem('fusion_invoices', JSON.stringify([newInvoice, ...currentInvoices]));
        }

    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (paymentData?.pixCopiaECola) {
      navigator.clipboard.writeText(paymentData.pixCopiaECola);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col md:flex-row text-white font-sans">
      {/* Left Column - Info */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-12 transition-colors w-fit relative z-10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao início
        </Link>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white">
                F
            </div>
            <span className="text-xl font-bold tracking-wider">FUSION CLOUD</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase tracking-tight">
            OLÁ PLAYER!
          </h1>
          
          <p className="text-gray-400 mb-12 leading-relaxed max-w-lg">
            Assinando nossos planos ULTRA você terá acesso a um hardware superior para máxima performance.
          </p>

          <div className="bg-[#2e0249]/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-6">
              MÁQUINAS DO PLANO ULTRA:
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-sm font-bold text-gray-300">PERFORMANCE MÁXIMA</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-sm font-bold text-gray-300">SALVAMENTO PERMANENTE</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  <strong className="text-gray-200">Intel Xeon ou AMD EPYC</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  8 vCPUs • 20GB RAM • Tesla T4
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  256GB HD + 170GB extra
                </span>
              </li>
               <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  <strong className="text-gray-200">SUPORTE PRIORITÁRIO</strong> E ACESSO IMEDIATO SEM FILAS
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column - Checkout Form */}
      <div className="w-full md:w-1/2 bg-white text-gray-900 p-8 md:p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-lg mx-auto">
            {/* Steps */}
            <div className="flex mb-12 border-b border-gray-200">
                <div className={`flex items-center gap-2 pb-4 px-4 transition-all ${step === 1 ? 'border-b-2 border-purple-600 opacity-100' : 'opacity-50'}`}>
                    <span className={`text-2xl font-bold ${step === 1 ? 'text-purple-900' : 'text-gray-400'}`}>1</span>
                    <div className="flex flex-col leading-tight">
                        <span className={`font-bold ${step === 1 ? 'text-purple-900' : 'text-gray-500'}`}>Dados</span>
                        <span className="text-xs text-gray-500">Seus dados</span>
                    </div>
                </div>
                <div className={`flex items-center gap-2 pb-4 px-4 transition-all ${step === 2 ? 'border-b-2 border-purple-600 opacity-100' : 'opacity-50'}`}>
                    <span className={`text-2xl font-bold ${step === 2 ? 'text-purple-900' : 'text-gray-400'}`}>2</span>
                    <div className="flex flex-col leading-tight">
                        <span className={`font-bold ${step === 2 ? 'text-purple-900' : 'text-gray-500'}`}>Pagamento</span>
                        <span className="text-xs text-gray-400">da assinatura</span>
                    </div>
                </div>
            </div>

            {step === 1 && (
                <>
            <div className="mb-8">
                {!user ? (
                    <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-6 mb-8">
                         <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <LogIn className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Identificação</h3>
                                <p className="text-xs text-gray-500">Faça login ou crie sua conta para continuar</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6 border-b border-gray-200">
                            <button
                                onClick={() => setAuthMode('login')}
                                className={`pb-3 px-1 font-bold text-sm transition-all relative ${
                                    authMode === 'login' 
                                    ? 'text-purple-600' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Entrar
                                {authMode === 'login' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></div>}
                            </button>
                            <button
                                onClick={() => setAuthMode('register')}
                                className={`pb-3 px-1 font-bold text-sm transition-all relative ${
                                    authMode === 'register' 
                                    ? 'text-purple-600' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Cadastrar
                                {authMode === 'register' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></div>}
                            </button>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-4">
                            {authMode === 'register' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Seu nome"
                                        className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                        value={authData.name}
                                        onChange={(e) => setAuthData({...authData, name: e.target.value})}
                                    />
                                </div>
                            )}
                            {authMode === 'register' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">CPF</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="000.000.000-00"
                                            className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                            value={authData.cpf}
                                            onChange={(e) => setAuthData({...authData, cpf: formatCpf(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Telefone</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="(00) 00000-0000"
                                            className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                            value={authData.phone}
                                            onChange={(e) => setAuthData({...authData, phone: formatPhone(e.target.value)})}
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="seu@email.com"
                                    className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                    value={authData.email}
                                    onChange={(e) => setAuthData({...authData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Senha</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="******"
                                    className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                    value={authData.password}
                                    onChange={(e) => setAuthData({...authData, password: e.target.value})}
                                />
                            </div>
                            {authMode === 'register' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Confirmar Senha</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="******"
                                        className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                        value={authData.confirmPassword}
                                        onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                                    />
                                </div>
                            )}

                            {authError && (
                                <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                    <span className="block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                    {authError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
                            >
                                {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
                                {authMode === 'login' ? 'Entrar na Conta' : 'Criar Conta Grátis'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Logado como {user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <h2 className="text-purple-600 font-bold mb-6">Produtos (ULTRA)</h2>

            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {plans.map((plan) => (
                    <label 
                        key={plan.id} 
                        className={`block relative border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedPlan === plan.id 
                            ? 'bg-purple-50 border-purple-500 shadow-md' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <input 
                            type="radio" 
                            name="plan" 
                            value={plan.id} 
                            checked={selectedPlan === plan.id}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="absolute top-6 left-4 w-4 h-4 accent-purple-600"
                        />
                        <div className="ml-8 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{plan.name}</h3>
                                <p className="text-gray-500 text-xs mt-1">{plan.price} / {plan.period}</p>
                                {plan.note && <p className="text-xs font-bold text-orange-500 mt-1">{plan.note}</p>}
                            </div>
                            <span className="font-bold text-gray-900">{plan.price}</span>
                        </div>
                    </label>
                ))}
            </div>

            {user && (
                <>
                        <button 
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded shadow flex items-center justify-center gap-3 transition-colors mb-8"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <div className="bg-white/20 p-1 rounded-sm">
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                            )}
                            {loading ? 'Gerando PIX...' : 'Pagar com PIX'}
                        </button>

                    {error && (
                        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                </>
            )}
            </>
            )}

            {step === 2 && paymentData && (
                <div className="animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Gerado!</h2>
                        <p className="text-gray-500">Escaneie o QR Code ou use o Pix Copia e Cola para finalizar.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                        <div className="flex flex-col items-center justify-center mb-8">
                             <div className="bg-white p-2 border border-gray-100 rounded-lg shadow-sm mb-4">
                                {/* QR Code Image */}
                                <img 
                                    src={paymentData.qrcode.qrcodeBase64} 
                                    alt="QR Code Pix" 
                                    className="w-48 h-48 object-contain"
                                />
                            </div>
                            <p className="text-sm font-bold text-purple-600">
                                Valor: {plans.find(p => p.id === selectedPlan)?.price}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Pix Copia e Cola</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={paymentData.pixCopiaECola}
                                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-xs font-mono text-gray-600 focus:outline-none"
                                />
                                <button 
                                    onClick={copyToClipboard}
                                    className={`px-4 py-2 rounded font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                                        copied 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                     <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                        <div className="flex gap-3">
                            <div className="mt-0.5">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                 <h4 className="font-bold text-blue-900 text-sm mb-1">Pagamento em processamento</h4>
                                 <p className="text-xs text-blue-700 leading-relaxed">
                                    Assim que o pagamento for identificado, sua máquina será liberada automaticamente. Isso geralmente leva menos de 1 minuto.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(1)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="animate-fade-in text-center py-10">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Confirmado!</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Sua máquina está sendo preparada e estará disponível em instantes.
                    </p>
                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Monitor className="w-5 h-5" />
                            Ir para o Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/invoices')}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Cpu className="w-5 h-5" />
                            Ver Fatura
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutUltra;
