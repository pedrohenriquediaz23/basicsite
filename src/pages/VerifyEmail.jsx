import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user is logged in, redirect to login
    // Note: If "Confirm Email" is OFF in Supabase, user is logged in after registration.
    if (!user) {
        // We might want to allow passing email via state if not logged in, but for now assume logged in
        // navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!user) throw new Error('Usuário não identificado. Faça login novamente.');

      // Fetch the stored code from profiles
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('verification_code, is_verified')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (profile.is_verified) {
        setSuccess('Email já verificado! Redirecionando...');
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      if (profile.verification_code === code) {
        // Code matches! Update verified status
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_verified: true,
            verification_code: null // Clear code after use
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        setSuccess('Email verificado com sucesso!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError('Código incorreto. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro na verificação:', err);
      setError(err.message || 'Erro ao verificar código.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
        if (!user) throw new Error('Usuário não identificado.');

        const newCode = Math.floor(10000 + Math.random() * 90000).toString();

        // Update DB
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ verification_code: newCode })
            .eq('id', user.id);
        
        if (updateError) throw updateError;

        // Send Email
        const response = await fetch('http://localhost:3000/api/send-verification-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, code: newCode })
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);

        setSuccess('Novo código enviado para seu email!');
    } catch (err) {
        console.error('Erro ao reenviar:', err);
        setError('Erro ao reenviar código.');
    } finally {
        setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0f1219] border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10">
            <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao login
            </Link>

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 mb-4">
                    <Mail className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Verifique seu Email</h1>
                <p className="text-gray-400 text-sm">Digite o código de 5 dígitos enviado para {user?.email}</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg mb-6 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Código de Verificação</label>
                    <input 
                        type="text" 
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg p-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="00000"
                        maxLength={5}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading || code.length !== 5}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'VERIFICAR CÓDIGO'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm">
                <p className="text-gray-500 mb-2">Não recebeu o código?</p>
                <button 
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-purple-400 hover:text-purple-300 font-bold transition-colors disabled:opacity-50"
                >
                    {resendLoading ? 'Enviando...' : 'Reenviar código'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default VerifyEmail;
