import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Zap,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DocsTerms = () => {
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
                    <span className="text-4xl">📜</span>
                    Política de Regras – Fusion Cloud
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                    Ao contratar qualquer serviço da Fusion Cloud, o cliente declara estar ciente e de acordo com todas as regras abaixo. 
                    O pagamento confirma que o cliente leu, compreendeu e aceitou todos os termos.
                </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
                
                {/* 1. Ciência prévia */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/20 text-purple-500 rounded-lg flex items-center justify-center font-bold text-sm">1</div>
                        Ciência prévia dos planos
                    </h2>
                    <p className="text-gray-300">
                        Todos os planos possuem explicações antes da assinatura. Após a confirmação do pagamento, o cliente declara que leu, compreendeu e aceitou todas as regras e limitações do plano escolhido.
                    </p>
                </section>

                {/* 2. Free Trial */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/20 text-purple-500 rounded-lg flex items-center justify-center font-bold text-sm">2</div>
                        Teste Free Trial
                    </h2>
                    <p className="text-gray-300">
                        Oferecemos Free Trial antes de qualquer plano pago. O cliente pode impulsionar o servidor para garantir um teste, sem pagamento via PIX. O teste é apenas para avaliação e não garante prioridade.
                    </p>
                </section>

                {/* 3. Planos de horas */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/20 text-purple-500 rounded-lg flex items-center justify-center font-bold text-sm">3</div>
                        Planos de horas
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-300 font-medium">Os planos de horas são exclusivamente para teste.</p>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                Possuem fila de espera
                            </li>
                            <li className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                A demora pode ser significativa
                            </li>
                            <li className="flex items-start gap-2">
                                <HelpCircle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                É obrigatório consultar o suporte antes da compra
                            </li>
                            <li className="flex items-start gap-2">
                                <Calendar className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                Caso a fila esteja cheia, o cliente aguardará a próxima sessão, podendo ser em outro dia
                            </li>
                        </ul>
                        
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p><strong>Atenção:</strong> Apagar jogos, aplicativos ou arquivos dessas máquinas gera punição.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Planos Semanal, Quinzenal e Mensal */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/20 text-purple-500 rounded-lg flex items-center justify-center font-bold text-sm">4</div>
                        Planos Semanal, Quinzenal e Mensal
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-300 font-medium">Incluem Spot, Sem Spot e On-Demand Sem Spot.</p>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Não possuem fila
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Podem ser liberados imediatamente
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Máquina sem jogos é liberada mais rápido
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Caso solicite jogos, será necessário aguardar a preparação
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 5. Planos Spot e On-Demand */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/20 text-purple-500 rounded-lg flex items-center justify-center font-bold text-sm">5</div>
                        Planos Spot e On-Demand
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-300">
                            Planos Spot utilizam máquinas de baixo custo e podem sofrer desligamentos automáticos por indisponibilidade do fornecedor.
                        </p>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                                O valor é mais barato justamente por esse risco
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                                Não há reposição de dias perdidos
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                                Indisponibilidades não geram compensação
                            </li>
                        </ul>
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-300 text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            As mesmas regras se aplicam aos planos On-Demand Sem Spot.
                        </div>
                    </div>
                </section>

                {/* 6. Uso indevido */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-red-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none"></div>
                    
                    <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-600/20 text-red-500 rounded-lg flex items-center justify-center font-bold text-sm">6</div>
                        Uso indevido da máquina (Tolerância ZERO)
                    </h2>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-white font-bold mb-2">É estritamente proibido:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    Baixar arquivos pirateados
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    Utilizar cracks, cheats ou mods ilegais
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    Cometer crimes ou atividades ilícitas
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-white flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                            <div>
                                <strong className="block text-red-400">PENALIDADE:</strong>
                                BANIMENTO PERMANENTE, sem direito a reembolso.
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            Antes de baixar qualquer arquivo ou app fora do padrão, consulte o suporte.
                        </p>
                    </div>
                </section>

                {/* 7. Reembolsos */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/20 text-purple-500 rounded-lg flex items-center justify-center font-bold text-sm">7</div>
                        Reembolsos
                    </h2>
                    <div className="space-y-4">
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2 text-red-400">
                                <XCircle className="w-5 h-5 shrink-0" />
                                Não realizamos reembolso em planos ativos ou já utilizados.
                            </li>
                            <li className="flex items-start gap-2 text-red-400">
                                <XCircle className="w-5 h-5 shrink-0" />
                                Desistência no meio do período não gera devolução.
                            </li>
                        </ul>
                        
                        <p className="text-gray-400 text-sm italic border-l-2 border-purple-500 pl-4 py-1">
                            O pagamento é dividido com terceiros fornecedores das máquinas.
                        </p>

                        <div className="flex items-start gap-2 text-green-400 font-medium pt-2">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            Reembolso somente em caso de erro técnico comprovado, após análise.
                        </div>
                    </div>
                </section>

                <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-gray-500 text-sm">
                        Fusion Cloud • Transparência e responsabilidade
                    </p>
                </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DocsTerms;
