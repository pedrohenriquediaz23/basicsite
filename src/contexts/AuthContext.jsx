import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Check local storage for user
      const storedUser = localStorage.getItem('fusion_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
          localStorage.removeItem('fusion_user');
        }
      }

      // Seed Admin User if not exists
      let storedUsers = [];
      try {
        storedUsers = JSON.parse(localStorage.getItem('fusion_users') || '[]');
      } catch (e) {
        console.error('Error parsing stored users:', e);
        localStorage.removeItem('fusion_users');
        storedUsers = [];
      }

      if (!Array.isArray(storedUsers)) storedUsers = [];

      // REMOVE LEGACY ADMIN IF EXISTS (Cleanup)
      const legacyAdminIndex = storedUsers.findIndex(u => u.email === 'admin@fusion.com');
      if (legacyAdminIndex !== -1) {
          console.log('Removendo usuário admin legado (cleanup)...');
          storedUsers.splice(legacyAdminIndex, 1);
          localStorage.setItem('fusion_users', JSON.stringify(storedUsers));
      }

      // Legacy admin seed removed in favor of Server-Side Env Var Auth
      /*
      if (!storedUsers.some(u => u.email === 'admin@fusion.com')) {
          const adminUser = {
              id: 'admin-001',
              name: 'Administrador',
              email: 'admin@fusion.com',
              password: 'admin', // In real app, this should be hashed
              isAdmin: true,
              phone: '00000000000',
              cpf: '000.000.000-00'
          };
          storedUsers.push(adminUser);
          localStorage.setItem('fusion_users', JSON.stringify(storedUsers));
      }
      */
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // 1. Tenta login no Backend (Prioridade para Admin e Auth real)
    try {
      console.log(`Tentando login no backend: /api/auth/login`);
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Se o backend responder (mesmo com erro 401/400), processamos
      if (response.ok) {
          const data = await response.json();
          if (data.ok || data.token || data.user) {
              const userData = data.user || data;
              setUser(userData);
              localStorage.setItem('fusion_user', JSON.stringify(userData));
              return userData;
          }
      }
    } catch (error) {
      console.warn('Backend login falhou ou offline, tentando mock local...', error);
    }

    // 2. Fallback para Mock Local (apenas se backend falhar ou não encontrar usuário)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedUsers = JSON.parse(localStorage.getItem('fusion_users') || '[]');
      const user = storedUsers.find(u => u.email === email);

      if (user && user.password === password) {
        // Create a safe user object without password to store in session
        const userSession = { ...user };
        delete userSession.password;
        
        setUser(userSession);
        localStorage.setItem('fusion_user', JSON.stringify(userSession));
        return userSession;
      } else {
        throw new Error('Email ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (name, email, password, phone, cpf) => {
    // MOCK AUTHENTICATION IMPLEMENTATION
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedUsers = JSON.parse(localStorage.getItem('fusion_users') || '[]');
      
      if (storedUsers.some(u => u.email === email)) {
        throw new Error('Usuário já existe');
      }

      const newUser = {
        _id: Date.now().toString(),
        name,
        email,
        password, // In a real app, never store passwords plainly!
        phone,
        cpf,
        isAdmin: false,
        token: 'mock-jwt-token-' + Date.now()
      };

      // Add to "database"
      storedUsers.push(newUser);
      localStorage.setItem('fusion_users', JSON.stringify(storedUsers));

      // Auto login
      const userSession = { ...newUser };
      delete userSession.password;
      
      setUser(userSession);
      localStorage.setItem('fusion_user', JSON.stringify(userSession));
      
      return userSession;
    } catch (error) {
      console.error('Erro no registro (Mock):', error);
      throw error;
    }

    /* REAL BACKEND IMPLEMENTATION (DISABLED)
    try {
      console.log(`Tentando registro em: ${API_URL}`);
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, cpf }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao registrar');
      }

      // Auto login after register
      setUser(data);
      localStorage.setItem('fusion_user', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('Erro no registro:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está online e a URL está correta.');
      }
      throw error;
    }
    */
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fusion_user');
    // Clear other sensitive data
    localStorage.removeItem('fusion_invoices');
  };

  const updateProfile = async (updatedData) => {
    // TODO: Implement update endpoint in backend
    // For now, update local state only
    const updatedUser = { 
        ...user, 
        ...updatedData,
        updatedAt: new Date().toISOString() 
    };
    
    setUser(updatedUser);
    localStorage.setItem('fusion_user', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
