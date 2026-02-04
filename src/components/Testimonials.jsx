import { ThumbsUp } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'joafvk',
    role: 'Cliente',
    text: 'Forza Horizon 5 com os gráficos tudo no máximo, rodando lisinho, foda dms!!!🔥',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joafvk'
  },
  {
    id: 2,
    name: 'Fp',
    role: 'Cliente',
    text: 'Muito bom rapaziada 10/10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fp'
  },
  {
    id: 3,
    name: 'NERDOLA YT',
    role: 'Cliente',
    text: 'Muito bom rapaziada joguei até na capital a cidade que o Paulinho oloco joga, roda lizinho recomendo o semanal ou o mensal pq se vc jogar vc vai gostar e vai querer jogar mais.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NERDOLA'
  },
  {
    id: 4,
    name: 'Plutao.musk',
    role: 'Cliente',
    text: 'já havia pegado a maquina quinzenal para testar e não me arrependi e ja pulei para a mensal azure, simplesmente incrivel o desempenho que essa maquina possui rodando o fivem com mais de 140 fps sem nenhum tipo de otimização e com os gráficos todos no alto. Podem comprar sem medo que não vão se arrepender.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Plutao'
  },
  {
    id: 5,
    name: 'Kainanzerobala',
    role: 'Cliente',
    text: 'Recomendo rapaziada muito top, consegui realizar meu sonho de jogar fivem, os maninho aí são muito gente boa só agradeço ai aos que me atenderam',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kainanzerobala'
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-[#030014] relative overflow-hidden">
       {/* Background blob */}
       <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Feedbacks de <span className="text-gray-400">Clientes</span></h2>
            <ThumbsUp className="w-8 h-8 text-pink-300 animate-bounce" />
        </div>
        
        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent px-4">
            {testimonials.map((t) => (
                <div key={t.id} className="min-w-[300px] md:min-w-[350px] bg-gradient-to-b from-white to-gray-100 text-gray-800 rounded-xl p-8 flex flex-col justify-between snap-center shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-200">
                    <p className="text-xs leading-relaxed mb-6 font-medium text-gray-600">
                        &quot;{t.text}&quot;
                    </p>
                    <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 overflow-hidden border border-purple-200">
                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">{t.name}</h4>
                            <span className="text-xs text-gray-500 font-semibold uppercase">{t.role}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
