import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Loader2, LogIn } from 'lucide-react';
import { supabase } from '../supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      
      // Check verification status from profiles table
      if (user) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_verified')
            .eq('id', user.id)
            .single();
        
        if (profileError) {
            console.error('Error checking verification:', profileError);
            // If error (e.g. no profile), allow login or block?
            // Let's assume block if we can't verify status, OR allow if profile missing (legacy users)
            // But new users have profile.
            // If profile is missing, it's likely a legacy user, so allow.
        } else if (profile && profile.is_verified === false) {
            // Not verified
            navigate('/verify-email');
            return;
        }
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0f1219] border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao início
            </Link>

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 mb-4">
                    <LogIn className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
                <p className="text-gray-400 text-sm">Faça login para acessar sua conta.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="seu@email.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Senha</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="••••••••"
                        required
                    />
                    <div className="text-right mt-2">
                        <Link to="/reset-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                            Esqueci minha senha
                        </Link>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ENTRAR'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                    Cadastre-se
                </Link>
            </div>
        </div>
    </div>
  );
};

export default Login;
