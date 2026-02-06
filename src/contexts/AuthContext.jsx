import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to format user object
  const formatUser = (sessionUser) => {
    if (!sessionUser) return null;
    
    // Check admin status via metadata or env var
    const isAdmin = 
      sessionUser.user_metadata?.isAdmin === true || 
      sessionUser.email === import.meta.env.VITE_ADMIN_EMAIL;

    return {
      ...sessionUser,
      ...sessionUser.user_metadata, // Flatten metadata (name, phone, etc.)
      isAdmin
    };
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(formatUser(session?.user));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(formatUser(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync user to localStorage for legacy components/external scripts
  useEffect(() => {
    if (user) {
      localStorage.setItem('fusion_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fusion_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return formatUser(data.user);
    } catch (error) {
      console.error('Erro no login:', error.message);
      throw error;
    }
  };

  const register = async (name, email, password, phone, cpf, verificationCode) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            cpf,
            // WARNING: Storing password in metadata is insecure, but requested by user
            password, 
            // Set initial admin status based on email
            isAdmin: email === import.meta.env.VITE_ADMIN_EMAIL
          },
        },
      });

      if (error) throw error;

      // Force insert into profiles table
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          username: name,
          phone: phone,
          cpf: cpf,
          is_admin: email === import.meta.env.VITE_ADMIN_EMAIL,
          password: password, // Saving password as requested
          verification_code: verificationCode,
          is_verified: false
        });

        if (profileError) {
            console.error('Erro ao criar perfil:', profileError);
            // Don't throw here to allow registration to complete, but log it
        }
      }

      return formatUser(data.user);
    } catch (error) {
      console.error('Erro no registro:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      localStorage.removeItem('fusion_user'); // Clean up legacy
      localStorage.removeItem('fusion_users'); // Clean up legacy
    } catch (error) {
      console.error('Erro ao sair:', error.message);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updatedData
      });
      
      if (error) throw error;
      setUser(formatUser(data.user));
      return data.user;
    } catch (error) {
      console.error("Error updating profile:", error.message);
      throw error;
    }
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
