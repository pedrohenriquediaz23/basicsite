import { useState } from 'react';
import { Menu, X, Cloud, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    setIsOpen(false);
    if (item === 'Planos') {
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: 'plans' } });
      } else {
        document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item === 'Docs') {
      navigate('/docs');
    } else if (item === 'Download') {
      navigate('/download');
    } else if (item === 'Status') {
      navigate('/status');
    }
  };

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-[#030014]/80 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Cloud className="w-8 h-8 text-white" />
            <span className="self-center text-2xl font-bold whitespace-nowrap text-white">Fusion Cloud</span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse items-center">
            {user ? (
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-white text-sm font-bold">{user.name}</span>
                        <span className="text-purple-400 text-xs uppercase">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
                    </div>
                    <button 
                        onClick={logout}
                        className="text-white bg-white/10 hover:bg-white/20 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-4 py-2.5 text-center transition-all flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">SAIR</span>
                    </button>
                    <Link to="/dashboard" className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-4 py-2.5 text-center transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                        PAINEL
                    </Link>
                </div>
            ) : (
                <>
                    <Link to="/register" className="hidden md:block text-white bg-white/10 hover:bg-white/20 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-6 py-2.5 text-center transition-all">REGISTRO</Link>
                    <Link to="/login" className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-6 py-2.5 text-center transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)]">ENTRAR</Link>
                </>
            )}
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X /> : <Menu />}
            </button>
        </div>
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-gray-800/50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <Link to="/" className="block py-2 px-3 text-white bg-white/10 rounded md:bg-white/10 md:px-4 md:py-1 md:rounded-full font-bold text-sm" aria-current="page">INÍCIO</Link>
            </li>
            {['Docs', 'Empresas', 'Planos', 'Download', 'Status'].map((item) => (
              <li key={item}>
                <button 
                  onClick={() => handleNavClick(item)} 
                  className="block w-full md:w-auto text-left py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-purple-400 md:p-0 transition-colors uppercase text-xs font-bold tracking-wider cursor-pointer focus:outline-none"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
