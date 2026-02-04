import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [planType, setPlanType] = useState('basic');

  return (
    <section id="plans" className="py-20 bg-[#030014] relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-300">
            PLANOS • <span className="text-white">FUSION CLOUD</span>
        </h2>
        
        {/* Segmented Control */}
        <div className="flex justify-center mb-12">
            <div className="bg-[#0f1219] p-1 rounded-full border border-gray-800 flex items-center">
                <button
                    onClick={() => setPlanType('basic')}
                    className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        planType === 'basic' 
                        ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    BASIC
                </button>
                <button
                    onClick={() => setPlanType('ultra')}
                    className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        planType === 'ultra' 
                        ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    ULTRA
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan - Always visible */}
            <div className="bg-[#0f1219] rounded-2xl p-8 border border-gray-800 flex flex-col hover:border-gray-600 transition-colors">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">PLANO FREE</h3>
                <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-300">R$0.0</span>
                    <span className="text-gray-500 text-sm">/mês</span>
                </div>
                <p className="text-gray-400 text-sm mb-8 border-b border-gray-800 pb-8">
                    Ideal para testar o serviço.
                </p>
                
                <ul className="space-y-4 mb-8 flex-1">
                    {['SERVIDOR BRASILEIRO', 'SESSÃO MÁXIMA DE 1 HORA', 'CONTÉM SPOT', 'CONTÉM ANTI-AFK', 'FILA DE MÁQUINAS'].map((feat, i) => (
                        <li key={i} className="flex items-center text-xs font-bold text-gray-400 tracking-wide">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                            {feat}
                        </li>
                    ))}
                </ul>
                
                <Link to="/checkout" className="w-full py-3 rounded-full border border-gray-700 text-xs font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group text-white">
                    SAIBA MAIS <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Basic Plans Group */}
            {planType === 'basic' && (
                <div className="bg-[#0f1219] rounded-[2rem] p-10 border border-gray-800 flex flex-col hover:border-purple-500/30 transition-colors h-full">
                     <div className="flex justify-between items-start mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">FUSION BASIC</h3>
                        <div className="bg-purple-500/10 text-purple-400 text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full">Popular</div>
                    </div>

                    <div className="space-y-4 flex-1">
                        {/* 1 Hora */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <div>
                                <h4 className="font-bold text-gray-200 text-sm uppercase">1 HORA</h4>
                                <span className="text-xs text-gray-500">Sessão única</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$4,90</span>
                                <Link to="/checkout" className="text-[10px] font-bold text-gray-500 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Semanal */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <div>
                                <h4 className="font-bold text-gray-200 text-sm uppercase">SEMANAL</h4>
                                <span className="text-xs text-gray-500">7 dias de acesso</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$49,90</span>
                                <Link to="/checkout" className="text-[10px] font-bold text-gray-500 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                         {/* Quinzenal */}
                         <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <div>
                                <h4 className="font-bold text-gray-200 text-sm uppercase">QUINZENAL</h4>
                                <span className="text-xs text-gray-500">15 dias de acesso</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$62,90</span>
                                <Link to="/checkout" className="text-[10px] font-bold text-gray-500 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Mensal Spot */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors group">
                            <div>
                                <h4 className="font-bold text-yellow-500 text-sm flex items-center gap-2 uppercase">⚠️ MENSAL SPOT</h4>
                                <span className="text-xs text-gray-500">Pode ter desligamentos</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$99,90</span>
                                <Link to="/checkout" className="text-[10px] font-bold text-gray-500 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                         {/* Mensal Non-Preemptible */}
                         <div className="flex justify-between items-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors group shadow-lg shadow-purple-900/20">
                            <div>
                                <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2 uppercase">💎 MENSAL VIP</h4>
                                <span className="text-xs text-gray-400">Sem desligamentos</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$169,90</span>
                                <Link to="/checkout" className="text-[10px] font-bold text-gray-500 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ultra Plan */}
            {planType === 'ultra' && (
                <div className="bg-[#2e0249] rounded-[2rem] p-10 border border-purple-500 flex flex-col relative shadow-[0_0_40px_rgba(147,51,234,0.3)] transform scale-105 z-10 h-full">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">FUSION ULTRA</h3>
                    
                    <div className="space-y-4 flex-1">
                        {/* 1 Hora */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors group">
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase">1 HORA</h4>
                                <span className="text-xs text-purple-200">Sessão única</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$5,90</span>
                                <Link to="/checkout-ultra" className="text-[10px] font-bold text-purple-300 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* 3 Horas */}
                         <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors group">
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase">3 HORAS</h4>
                                <span className="text-xs text-purple-200">Sessão única</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$17,50</span>
                                <Link to="/checkout-ultra" className="text-[10px] font-bold text-purple-300 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* 5 Horas */}
                         <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors group">
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase">5 HORAS</h4>
                                <span className="text-xs text-purple-200">Sessão única</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$29,90</span>
                                <Link to="/checkout-ultra" className="text-[10px] font-bold text-purple-300 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Semanal */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-transparent border border-purple-500/30 hover:border-purple-500/50 transition-colors group">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-white text-sm uppercase">SEMANAL</h4>
                                    <span className="bg-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">Promoção</span>
                                </div>
                                <span className="text-xs text-purple-200">7 dias de acesso</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$40,90</span>
                                <Link to="/checkout-ultra" className="text-[10px] font-bold text-purple-300 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Mensal Spot */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors group">
                            <div>
                                <h4 className="font-bold text-yellow-500 text-sm flex items-center gap-2 uppercase">⚠️ MENSAL SPOT</h4>
                                <span className="text-xs text-gray-300 max-w-[150px] block leading-tight mt-1">Pode ter desligamentos</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">R$105,90</span>
                                <Link to="/checkout-ultra" className="text-[10px] font-bold text-yellow-500 group-hover:text-white flex items-center justify-end gap-1 mt-1 transition-colors uppercase tracking-widest">
                                    ASSINAR <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
