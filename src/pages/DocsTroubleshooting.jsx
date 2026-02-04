import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Wifi, 
  WifiOff,
  Monitor, 
  Gamepad2, 
  VolumeX, 
  MonitorOff, 
  XCircle, 
  Zap, 
  LifeBuoy, 
  ChevronLeft,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Settings,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DocsTroubleshooting = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-[#030014] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full"></div>
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
                    <span className="text-4xl">🛠️</span>
                    Solução de Problemas no Moonlight
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                    O Moonlight é o aplicativo utilizado para acessar sua máquina na <span className="text-purple-400 font-bold">Fusion Cloud Games</span>. 
                    Abaixo estão as principais soluções para os problemas mais comuns de conexão, áudio e imagem.
                </p>
            </div>

            {/* Content Grid */}
            <div className="space-y-8">

                {/* 1. Moonlight não conecta */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-red-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-red-400">
                        <WifiOff className="w-8 h-8" />
                        Moonlight não conecta na máquina
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p>Se o Moonlight não consegue se conectar, verifique:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span><strong>Se você recebeu corretamente:</strong> IP ou nome da máquina e Autorização para acesso.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span><strong>Se o Moonlight está atualizado:</strong> Versões antigas podem causar falhas de conexão.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span><strong>Se sua internet está estável:</strong> Conexões instáveis ou com muitas quedas podem impedir a conexão.</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 shrink-0" />
                            <p><strong>Dica:</strong> Reinicie o Moonlight e tente novamente após alguns minutos.</p>
                        </div>
                    </div>
                </section>

                {/* 2. Internet lenta / Lag */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-orange-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-orange-400">
                        <Wifi className="w-8 h-8" />
                        Internet lenta, lag ou travamentos
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p>O Moonlight depende diretamente da qualidade da sua internet.</p>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                            <h4 className="font-bold text-white mb-2">Requisitos mínimos:</h4>
                            <p className="flex items-center gap-2"><Download className="w-4 h-4 text-blue-400" /> 25 Mbps de download (para resolução baixa)</p>
                        </div>
                        
                        <p>Se estiver enfrentando lag, quedas de FPS, imagem borrada ou atraso nos comandos, verifique:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Se ninguém está usando muita internet ao mesmo tempo.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Se você está conectado via cabo de rede (recomendado).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Se o Wi-Fi não está fraco ou distante do roteador.</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p>Internet móvel ou Wi-Fi instável pode causar problemas frequentes.</p>
                        </div>
                    </div>
                </section>

                {/* 3. Qualidade de imagem ruim */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-purple-400">
                        <Monitor className="w-8 h-8" />
                        Qualidade de imagem ruim ou pixelada
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p>Caso a imagem esteja com baixa qualidade, abra as configurações do Moonlight e ajuste:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Settings className="w-4 h-4" /> Reduza:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1 text-gray-400">
                                    <li>Resolução</li>
                                    <li>Bitrate</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Ajuste para:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1 text-gray-400">
                                    <li>720p ou inferior</li>
                                    <li>FPS mais baixo, se necessário</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            Isso ajuda bastante em conexões mais lentas.
                        </div>
                    </div>
                </section>

                {/* 4. Controle/Teclado/Mouse */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-blue-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-blue-400">
                        <Gamepad2 className="w-8 h-8" />
                        Controle, teclado ou mouse não funcionam
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p>Se seus comandos não respondem corretamente:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Clique dentro da tela do Moonlight para garantir foco.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Reconecte o controle ou teclado.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Evite usar programas de mapeamento junto com o Moonlight.</span>
                            </li>
                        </ul>
                        <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            Em alguns casos, fechar e abrir novamente o app resolve.
                        </div>
                    </div>
                </section>

                {/* 5. Sem áudio */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-pink-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-pink-400">
                        <VolumeX className="w-8 h-8" />
                        Sem áudio no Moonlight
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Verifique se o áudio não está mutado no Moonlight.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Confira se o dispositivo de saída correto está selecionado.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Teste com fone de ouvido ou outro dispositivo de áudio.</span>
                            </li>
                        </ul>
                        <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            Reiniciar a sessão geralmente resolve problemas de áudio.
                        </div>
                    </div>
                </section>

                {/* 6. Tela preta */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-gray-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-gray-400">
                        <MonitorOff className="w-8 h-8" />
                        Tela preta ou congelada
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p>Se a tela abrir preta ou travar:</p>
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>Aguarde alguns segundos.</li>
                            <li>Feche o Moonlight completamente.</li>
                            <li>Abra novamente e reconecte.</li>
                            <li>Verifique se sua internet não caiu momentaneamente.</li>
                        </ol>
                        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p>Isso costuma acontecer em quedas rápidas de conexão.</p>
                        </div>
                    </div>
                </section>

                {/* 7. Moonlight fecha sozinho */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 hover:border-red-500/20 transition-all">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-red-500">
                        <XCircle className="w-8 h-8" />
                        Moonlight fecha sozinho ou trava
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-white mb-2">Possíveis causas:</h4>
                                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                    <li>Internet instável</li>
                                    <li>Celular ou PC com pouca memória</li>
                                    <li>App desatualizado</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2">Soluções:</h4>
                                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                    <li>Feche apps em segundo plano</li>
                                    <li>Atualize o Moonlight</li>
                                    <li>Reinicie o dispositivo</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dicas de Performance */}
                <section className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-yellow-400" />
                        Dicas Importantes para Melhor Desempenho
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-300">Use cabo de rede sempre que possível</span>
                        </div>
                        <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-300">Evite downloads enquanto joga</span>
                        </div>
                        <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-gray-300">Não use VPN</span>
                        </div>
                        <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-300">Mantenha o Moonlight atualizado</span>
                        </div>
                        <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl md:col-span-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-300">Utilize resoluções compatíveis com sua internet</span>
                        </div>
                    </div>
                </section>

                {/* Support Section */}
                <section className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <LifeBuoy className="w-8 h-8 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Ainda com problemas?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Se mesmo após seguir este guia o problema continuar, entre no nosso Discord e abra um ticket de suporte informando o problema, um print do erro e sua velocidade de internet.
                    </p>
                    <a 
                        href="https://discord.gg/53PjV8vUVR" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#5865F2]/20"
                    >
                        Entrar no Discord
                    </a>
                </section>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DocsTroubleshooting;
