
const steps = [
  {
    id: 1,
    title: 'Assine',
    description: 'Para acessar o serviço, é necessário uma assinatura. Após assinar, siga para o próximo passo.',
  },
  {
    id: 2,
    title: 'Baixe',
    description: 'Baixe nosso aplicativo para acessar sua máquina remotamente.',
  },
  {
    id: 3,
    title: 'Acesse',
    description: 'Inicie sua máquina através de nosso painel e acesse através de um dos aplicativos baixados.',
  },
  {
    id: 4,
    title: 'Seja feliz',
    description: 'Agora é só aproveitar o melhor das nossas super máquinas, fazendo o que você bem entender!',
  }
];

const Steps = () => {
  return (
    <section className="py-20 bg-[#030014] text-center relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-10 right-1/4 w-1 h-1 bg-white rounded-full opacity-60"></div>
         <div className="absolute bottom-20 left-10 w-1.5 h-1.5 bg-white rounded-full opacity-30"></div>
      </div>

      <h2 className="text-4xl lg:text-5xl font-bold mb-24 relative z-10">Então, como <span className="text-purple-500">funciona?</span></h2>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step) => (
            <div key={step.id} className="relative group flex flex-col items-center">
              {/* Giant Number Background */}
              <div className="text-[120px] lg:text-[150px] font-black text-[#0f0f1a] group-hover:text-[#1a1a2e] leading-none select-none absolute top-[-60px] lg:top-[-80px] left-1/2 transform -translate-x-1/2 z-0 transition-colors duration-500">
                {step.id}
              </div>
              
              <div className="relative z-10 mt-12">
                 <h3 className="text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors duration-300">{step.title}<span className="text-purple-500 text-2xl">.</span></h3>
                 <p className="text-gray-400 text-sm leading-relaxed max-w-[200px] mx-auto">
                   {step.description}
                 </p>
              </div>
              
              {/* Dot decoration */}
              <div className="mt-8 w-1 h-1 bg-gray-700 rounded-full group-hover:bg-purple-500 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-20">
            <a href="#" className="text-[10px] lg:text-xs font-bold tracking-[0.2em] text-white border-b border-gray-600 pb-2 hover:text-purple-400 hover:border-purple-400 transition-colors uppercase">
                Visite nossa documentação
            </a>
            <div className="w-8 h-0.5 bg-gray-700 mx-auto mt-2 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
