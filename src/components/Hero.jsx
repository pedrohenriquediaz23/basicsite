import { MessageCircle, MessageSquare, Cloud, Monitor, Coffee } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Background stars/particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-20 left-10 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"></div>
         <div className="absolute top-40 right-20 w-2 h-2 bg-white rounded-full opacity-30"></div>
         <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-ping"></div>
         <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-purple-500 rounded-full opacity-60"></div>
         <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-blue-500 rounded-full opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-left">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/10 text-gray-300 text-sm font-medium border border-white/5">
              Desenvolvido por Fusion Cloud
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Seu <span className="text-purple-500">super PC</span><br />
              na Nuvem
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed">
              A Fusion Cloud se esforça para se tornar a plataforma de nuvem definitiva para jogadores, criadores e empresas.
              <br /><br />
              Nosso objetivo é democratizar o acesso à tecnologia de ponta, e aos jogos mais pesados do momento, transformando seu dispositivo em um supercomputador.
            </p>

            <div className="flex justify-start mb-12">
               <div className="bg-purple-900/30 border border-purple-500/30 rounded-full px-6 py-2 text-purple-300 font-semibold inline-flex items-center gap-3 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-bold">15% DE DESCONTO</span>
                  <span className="text-sm tracking-wide">CUPOM NATAL2025!</span>
               </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
            {/* Abstract 3D illustration representation */}
            <div className="relative w-full max-w-lg aspect-square">
               {/* Floating elements */}
               <div className="absolute top-10 right-20 animate-bounce duration-[3000ms] z-10">
                  <div className="w-16 h-24 bg-purple-900/60 border border-purple-500/50 rounded-xl backdrop-blur-md transform rotate-12 flex items-center justify-center shadow-lg">
                    <Coffee className="text-purple-300 w-8 h-8" />
                  </div>
               </div>
               
               {/* Main device (Platform base) */}
               <div className="absolute bottom-32 left-10 right-10 h-48 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] rounded-2xl border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-x-12 rotate-z-[-5deg] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="text-center z-10">
                    <Monitor className="w-20 h-20 text-purple-500 mx-auto mb-2 opacity-80" />
                  </div>
               </div>

               {/* Tablet/Phone Device */}
               <div className="absolute bottom-10 right-10 w-40 h-72 bg-gray-900 border-8 border-gray-800 rounded-[2rem] transform rotate-[-10deg] shadow-2xl flex flex-col items-center justify-center overflow-hidden z-20 hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full bg-[#0f0f1a] flex flex-col items-center justify-center relative">
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
                      <Cloud className="text-white w-12 h-12 mb-2" />
                      <span className="text-white font-bold text-lg">FUSION</span>
                      <div className="mt-8 w-16 h-1.5 bg-purple-600 rounded-full"></div>
                  </div>
               </div>
               
               {/* Decorative squares */}
               <div className="absolute bottom-40 left-0 w-16 h-16 border-2 border-purple-500/30 rounded-xl transform rotate-45"></div>
               <div className="absolute top-1/2 right-0 w-12 h-12 border-2 border-pink-500/30 rounded-lg transform -rotate-12"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Widgets */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center">
           <MessageCircle className="w-6 h-6" />
        </button>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center">
           <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
