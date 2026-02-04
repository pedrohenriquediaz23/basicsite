
const Footer = () => {
  return (
    <footer className="bg-[#030014] py-12 border-t border-white/5 text-center text-gray-500 text-sm relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
                <span className="text-xl font-bold text-white">Fusion Cloud</span>
            </div>
            <div className="flex space-x-6">
                <a href="#" className="hover:text-purple-400 transition-colors">Termos</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Privacidade</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Contato</a>
            </div>
        </div>
        <p>&copy; {new Date().getFullYear()} Fusion Cloud Games. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
