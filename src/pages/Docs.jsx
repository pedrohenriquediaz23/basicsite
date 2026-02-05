import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText, Youtube, Wrench, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Docs = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-[#030014] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Documentação & <span className="text-purple-500">Tutoriais</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Aprenda como configurar, acessar e tirar o máximo proveito da sua máquina virtual na Fusion Cloud.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Tutorial Video Section */}
            <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="p-2 bg-red-600/10 rounded-lg">
                    <Youtube className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Como Baixar e Instalar (Android & iOS)</h2>
                    <p className="text-sm text-gray-400">Tutorial completo passo a passo</p>
                </div>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube-nocookie.com/embed/IkjfA52_sKs" 
                    title="Tutorial GTA RP" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 bg-[#13131f]">
                <h3 className="font-bold text-white mb-2">Neste tutorial você vai aprender:</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        Como baixar o aplicativo de conexão
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        Configurando o IP e credenciais
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        Otimizando para melhor performance
                    </li>
                </ul>
              </div>
            </div>

            {/* Text Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/docs/primeiros-passos" className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group cursor-pointer block">
                    <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Guia de Primeiros Passos</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Tudo o que você precisa saber logo após assinar seu plano.
                    </p>
                    <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Ler Artigo</span>
                </Link>

                <Link to="/docs/solucao-de-problemas" className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group cursor-pointer block">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Wrench className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Resolução de Problemas</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Soluções para os erros mais comuns de conexão e áudio.
                    </p>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Ler Artigo</span>
                </Link>

                <Link to="/docs/termos" className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group cursor-pointer block md:col-span-2 lg:col-span-1">
                    <div className="w-12 h-12 bg-yellow-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Política de Regras e Termos</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Regras de uso, reembolso e funcionamento dos planos. Leitura obrigatória.
                    </p>
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Ler Artigo</span>
                </Link>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Docs;
