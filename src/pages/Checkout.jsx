import { useState } from 'react';
import { Check, ArrowLeft, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { nebulaService } from '../services/nebulaService';

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('basic-1h');

  const handleCheckout = async () => {
    setLoading(true);
    try {
        const plan = plans.find(p => p.id === selectedPlan);
        await nebulaService.create({ name: plan.name });
        // Redirect to dashboard after successful "payment"
        navigate('/dashboard');
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
        setLoading(false);
    }
  };

  const plans = [
    { id: 'basic-1h', name: 'BASIC - 1 HORA', price: 'R$4,90', period: '1 hora' },
    { id: 'basic-weekly', name: 'BASIC - SEMANAL', price: 'R$49,90', period: '7 dias' },
    { id: 'basic-biweekly', name: 'BASIC - QUINZENAL', price: 'R$62,90', period: '15 dias' },
    { id: 'basic-monthly-spot', name: 'BASIC - MENSAL SPOT', price: 'R$99,90', period: '30 dias', note: '⚠️ Pode ter desligamentos' },
    { id: 'basic-monthly', name: 'BASIC - MENSAL VIP', price: 'R$169,90', period: '30 dias', note: '💎 Sem desligamentos' },
  ];

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
            Assinando nossos planos você terá acesso a um app exclusivo para iniciar uma máquina só pra você a cada sessão. Nosso estoque é composto por uma fila de máquinas localizadas especificamente no estado de São Paulo - Brasil.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-6">
              MÁQUINAS DO PLANO BASIC:
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-sm font-bold text-gray-300">FILA DE MÁQUINAS LOCALIZADAS EM SÃO PAULO - BR</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-sm font-bold text-gray-300">SALVA OS ARQUIVOS</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  <strong className="text-gray-200">Intel Xeon ou AMD EPYC</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  8 vCPUs • 20GB RAM • Tesla T4
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  256GB HD + 170GB extra
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
                <div className="flex items-center gap-2 pb-4 border-b-2 border-purple-600 px-4">
                    <span className="text-2xl font-bold text-purple-900">1</span>
                    <div className="flex flex-col leading-tight">
                        <span className="font-bold text-purple-900">Dados</span>
                        <span className="text-xs text-gray-500">Seus dados</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 pb-4 px-4 opacity-50">
                    <span className="text-2xl font-bold text-gray-400">2</span>
                    <div className="flex flex-col leading-tight">
                        <span className="font-bold text-gray-500">Pagamento</span>
                        <span className="text-xs text-gray-400">da assinatura</span>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 border border-purple-600 rounded flex items-center justify-center"></div>
                    <span className="text-gray-600">Já é cliente? <a href="#" className="text-orange-500 font-bold hover:underline">Clique aqui para entrar</a></span>
                </div>
            </div>

            <h2 className="text-purple-600 font-bold mb-6">Produtos</h2>

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

            <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-3 transition-all mb-8 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
                {loading ? (
                    <span>Processando...</span>
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        <span>FINALIZAR PAGAMENTO E CRIAR DISCO</span>
                    </>
                )}
            </button>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Nome <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Sobrenome <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-purple-500" />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-1">CPF <span className="text-red-500">*</span></label>
                <input type="text" placeholder="000.000.000-00" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-purple-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Telefone / WhatsApp <span className="text-red-500">*</span></label>
                    <input type="tel" placeholder="(00) 00000-0000" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Usuário do Discord <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="ex: usuario" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-purple-500" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
