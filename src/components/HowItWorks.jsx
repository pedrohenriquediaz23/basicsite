
const HowItWorks = () => {
  return (
    <section className="py-20 bg-[#030014] relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16">Como utilizar?</h2>
        
        <div className="relative max-w-4xl mx-auto perspective-[2000px]">
            {/* Laptop Frame */}
            <div className="relative bg-[#1a1a20] rounded-t-2xl p-3 pb-0 shadow-[0_0_50px_rgba(139,92,246,0.15)] border-t border-x border-gray-700/50 mx-auto w-full max-w-3xl aspect-video flex flex-col transform rotate-x-2 transition-transform duration-500 hover:rotate-x-0">
                 {/* Camera dot */}
                 <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                 
                 <div className="flex-1 bg-black rounded-t-lg overflow-hidden relative group border border-gray-800">
                    <iframe 
                        src="https://www.youtube-nocookie.com/embed/IkjfA52_sKs" 
                        title="Tutorial GTA RP" 
                        className="w-full h-full absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                    ></iframe>
                 </div>
            </div>
            {/* Laptop Base */}
            <div className="h-5 bg-[#25252b] rounded-b-2xl max-w-3xl mx-auto shadow-2xl border-b border-gray-700 relative z-20">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gray-800 rounded-b-lg"></div>
            </div>
            
            {/* Glow effect under laptop */}
            <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[80%] h-10 bg-purple-500/20 blur-3xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
