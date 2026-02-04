import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Download as DownloadIcon, Monitor, Smartphone, Globe } from 'lucide-react';

const Download = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-[#030014] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Central de <span className="text-purple-500">Downloads</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Baixe os aplicativos necessários para conectar na sua máquina virtual Fusion Cloud.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Moonlight Section */}
            <div className="bg-[#0f0f1a] border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all group">
                <div className="p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl shrink-0">
                            <img src="https://moonlight-stream.org/images/moonlight_logo_small.png" alt="Moonlight Logo" className="w-16 h-16 object-contain" onError={(e) => {e.target.style.display='none'; e.target.parentElement.innerHTML = '<svg class="w-12 h-12 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'}} />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">Moonlight Game Streaming</h2>
                            <p className="text-gray-400 mb-6">
                                O cliente de streaming de jogos de código aberto de alto desempenho. 
                                Permite jogar seus jogos de PC em quase qualquer dispositivo, seja você em outra sala ou a quilômetros de distância.
                            </p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <a 
                                    href="https://moonlight-stream.org/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 group-hover:scale-105"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                    Baixar Agora
                                </a>
                                <a 
                                    href="https://github.com/moonlight-stream" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
                                >
                                    <Globe className="w-5 h-5" />
                                    Site Oficial
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platforms Grid */}
                <div className="bg-[#13131f] border-t border-white/5 p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <a 
                        href="https://github.com/moonlight-stream/moonlight-qt/releases/download/v6.1.0/MoonlightSetup-6.1.0.exe" 
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <Monitor className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-gray-300">Windows</span>
                    </a>
                    <a 
                        href="https://github.com/moonlight-stream/moonlight-qt/releases/download/v6.1.0/Moonlight-6.1.0.dmg" 
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <Monitor className="w-6 h-6 text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-gray-300">macOS</span>
                    </a>
                    <a 
                        href="https://snapcraft.io/moonlight" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <Monitor className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-gray-300">Linux</span>
                    </a>
                    <a 
                        href="https://play.google.com/store/apps/details?id=com.limelight&hl=pt-BR&pli=1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <Smartphone className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-gray-300">Android</span>
                    </a>
                    <a 
                        href="https://apps.apple.com/br/app/moonlight-game-streaming/id1000551566" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <Smartphone className="w-6 h-6 text-gray-300 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-gray-300">iOS</span>
                    </a>
                </div>
            </div>

            {/* Other Downloads Section (Placeholder for future) */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6 opacity-50 grayscale cursor-not-allowed">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                            <Monitor className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Parsec (Em Breve)</h3>
                            <p className="text-xs text-gray-500">Alternativa para desktop remoto</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6 opacity-50 grayscale cursor-not-allowed">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                            <Monitor className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Sunshine (Em Breve)</h3>
                            <p className="text-xs text-gray-500">Host de streaming de jogos</p>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Download;
