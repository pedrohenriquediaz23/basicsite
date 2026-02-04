import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  MessageSquare, 
  Ticket, 
  Clock, 
  Smartphone, 
  Wifi, 
  HelpCircle, 
  CheckCircle,
  AlertTriangle,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DocsFirstSteps = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-[#030014] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/docs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Voltar para Documentação
            </Link>

            {/* Header */}
            <div className="mb-12 border-b border-white/10 pb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-4xl">🚀</span>
                    Guia de Primeiros Passos
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                    Parabéns pela sua compra na <span className="text-purple-400 font-bold">Fusion Cloud Games</span>! 
                    Para garantir que você tenha a melhor experiência possível desde o início, preparamos este guia completo com tudo o que você precisa fazer após a compra da sua máquina.
                </p>
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>Leia com atenção cada etapa abaixo para evitar atrasos na entrega da sua máquina.</p>
                </div>
            </div>

            {/* Steps Content */}
            <div className="space-y-12">
                
                {/* Step 1 */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                        Entre no Discord Oficial <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full ml-2">OBRIGATÓRIO</span>
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p>Após finalizar sua compra, o primeiro passo é entrar no nosso Discord oficial, pois todo o suporte e entrega das máquinas acontecem por lá.</p>
                        
                        <div className="bg-[#5865F2]/10 border border-[#5865F2]/20 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 my-6">
                            <div className="flex items-center gap-4">
                                <MessageSquare className="w-8 h-8 text-[#5865F2]" />
                                <div>
                                    <h3 className="font-bold text-white">Discord da Fusion Cloud Games</h3>
                                    <p className="text-sm text-gray-400">Comunidade oficial e suporte</p>
                                </div>
                            </div>
                            <a 
                                href="https://discord.gg/53PjV8vUVR" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#5865F2]/20 whitespace-nowrap"
                            >
                                Entrar no Discord
                            </a>
                        </div>
                        
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p><strong>Importante:</strong> Sem entrar no Discord, não é possível receber sua máquina nem solicitar suporte.</p>
                        </div>
                    </div>
                </section>

                {/* Step 2 */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">2</div>
                        Abra um Ticket de Suporte
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p>Assim que entrar no Discord:</p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                            <li>Vá até o canal de <strong>suporte / tickets</strong></li>
                            <li>Abra um ticket</li>
                            <li>Informe:
                                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-400">
                                    <li>Seu nome ou ID</li>
                                    <li>O plano comprado</li>
                                    <li>O comprovante, se solicitado</li>
                                </ul>
                            </li>
                            <li>Aguarde o atendimento da equipe</li>
                        </ol>

                        <div className="mt-6">
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-purple-400" />
                                O ticket é essencial para:
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Entrega da máquina', 'Suporte técnico', 'Dúvidas', 'Problemas de acesso'].map((item) => (
                                    <div key={item} className="bg-white/5 p-3 rounded-lg text-center text-sm font-medium border border-white/5">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3 */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">3</div>
                        Entenda o Prazo de Entrega
                    </h2>
                    <p className="text-gray-300 mb-6">Os prazos variam de acordo com o tipo de plano adquirido:</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Planos por Horas */}
                        <div className="bg-[#1a1a24] p-6 rounded-xl border border-white/5">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-400" />
                                Planos por Horas
                            </h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></span>
                                    Entram em fila de recebimento
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></span>
                                    Não há previsão exata de entrega
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></span>
                                    A entrega ocorre durante a semana
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-200 text-xs">
                                ⚠️ Planos por horas não são entregues na hora.
                            </div>
                        </div>

                        {/* Planos Periódicos */}
                        <div className="bg-[#1a1a24] p-6 rounded-xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 bg-green-500/10 rounded-bl-xl border-b border-l border-green-500/20">
                                <Zap className="w-4 h-4 text-green-500" />
                            </div>
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                Semanal, Quinzenal e Mensal
                            </h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                                    <span className="text-green-400 font-bold">Entrega imediata</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                                    Assim que o pagamento é confirmado
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                                    Recomendado para quem quer rapidez
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Step 4 */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">4</div>
                        Aplicativo Necessário: Moonlight
                    </h2>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <p className="text-gray-300 mb-4">
                                Para acessar e jogar na sua máquina da Fusion Cloud Games, você precisará usar o <strong>Moonlight</strong>.
                            </p>
                            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-purple-400" />
                                O que é o Moonlight?
                            </h3>
                            <ul className="space-y-2 text-gray-400 text-sm ml-1">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-500" />
                                    Conectar você à sua máquina na nuvem
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-500" />
                                    Transmitir imagem, áudio e comandos
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-500" />
                                    Garantir baixa latência para jogos
                                </li>
                            </ul>
                        </div>
                        <div className="bg-black/40 p-6 rounded-xl border border-white/10 text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-xs text-gray-500">Disponível para PC, Android e iOS</p>
                        </div>
                    </div>
                </section>

                {/* Step 5 */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">5</div>
                        Requisitos de Internet
                    </h2>
                    
                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-6 rounded-xl mb-6">
                        <div className="flex items-center gap-4 mb-2">
                            <Wifi className="w-8 h-8 text-blue-400" />
                            <div>
                                <h3 className="font-bold text-white">Velocidade mínima recomendada</h3>
                                <p className="text-2xl font-black text-blue-400">25 Mbps <span className="text-sm font-normal text-gray-400">de download</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Com 25 Mbps você consegue:</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Jogar em resolução baixa
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Ter uma experiência estável no Moonlight
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Velocidades menores causam:</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    Travamentos e Atrasos (lag)
                                </li>
                                <li className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    Quedas de conexão e baixa qualidade
                                </li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-6 italic">💡 Quanto maior a velocidade, melhor será sua experiência.</p>
                </section>

                {/* Step 6 */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">6</div>
                        Suporte Sempre Disponível
                    </h2>
                    <div className="flex items-start gap-4">
                        <HelpCircle className="w-12 h-12 text-purple-500 shrink-0" />
                        <div>
                            <p className="text-gray-300 mb-4">Se surgir qualquer dúvida ou problema:</p>
                            <ul className="space-y-2 text-gray-400 mb-4">
                                <li>1. Entre no Discord</li>
                                <li>2. Abra ou utilize seu ticket</li>
                                <li>3. Nossa equipe estará pronta para ajudar 🤝</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Summary */}
                <section className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-purple-500" />
                        Resumo Rápido
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['Entrar no Discord', 'Abrir ticket de suporte', 'Entender o prazo', 'Instalar Moonlight', 'Ter min. 25 Mbps'].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-gray-300 bg-black/20 p-3 rounded-lg">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                {item}
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-white font-bold mb-1">A Fusion Cloud Games agradece sua confiança 💙</p>
                        <p className="text-gray-400 text-sm">Esperamos que você aproveite ao máximo sua máquina e tenha uma excelente experiência na nuvem!</p>
                    </div>
                </section>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DocsFirstSteps;
