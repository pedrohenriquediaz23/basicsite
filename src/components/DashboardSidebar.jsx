import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Download, 
  CreditCard, 
  User, 
  Home,
  Settings,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active, badge, onClick, state }) => {
  const content = (
    <>
      <div className="relative">
        <Icon className={`w-6 h-6 mb-1 ${active ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-300'}`} />
        {badge && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 rounded-full text-[10px] flex items-center justify-center text-white font-bold border-2 border-[#0f0f1a]">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
      
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
      )}
    </>
  );

  const className = `flex flex-col items-center justify-center p-3 rounded-xl mb-4 transition-all group relative w-full ${
      active 
        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link to={path} state={state} className={className}>
      {content}
    </Link>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-full w-[90px] bg-[#0f0f1a] border-r border-white/5 flex flex-col items-center py-6 z-40">
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
      </div>

      <nav className="flex-1 w-full px-3 overflow-y-auto no-scrollbar">
        <SidebarItem 
          icon={Home} 
          label="Início" 
          path="/" 
          active={isActive('/')} 
        />
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          path="/dashboard" 
          active={isActive('/dashboard')} 
          badge="3"
        />
        <SidebarItem 
          icon={FileText} 
          label="Faturas" 
          path="/dashboard/invoices" 
          active={isActive('/dashboard/invoices')}
          badge="3"
        />
        <SidebarItem 
          icon={Download} 
          label="Downloads" 
          path="/download" 
          active={isActive('/download')} 
        />
        <SidebarItem 
          icon={CreditCard} 
          label="Planos" 
          path="/" 
          state={{ scrollTo: 'plans' }}
          active={false} 
        />
      </nav>

      <div className="w-full px-3 mt-auto relative" ref={profileRef}>
        {isProfileOpen && (
            <div className="absolute left-[80px] bottom-0 w-72 bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in-up ml-4">
                <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase">Minha Conta</h3>
                
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="font-bold text-white truncate text-sm">{user?.name || 'Usuário'}</h4>
                        <p className="text-xs text-gray-400 truncate">{user?.email || 'usuario@email.com'}</p>
                    </div>
                </div>

                <div className="space-y-1">
                    <button 
                        onClick={() => {
                            navigate('/dashboard/profile');
                            setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm font-medium">Configurações</span>
                    </button>
                    <button 
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Fazer Logout</span>
                    </button>
                </div>
            </div>
        )}
        <SidebarItem 
          icon={User} 
          label="Perfil" 
          active={isProfileOpen || isActive('/dashboard/profile')} 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        />
      </div>
    </aside>
  );
};

export default DashboardSidebar;
