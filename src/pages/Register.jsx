import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }
    
    setPhone(value);
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    if (value.length > 7) {
      value = `${value.slice(0, 7)}.${value.slice(7)}`;
    }
    if (value.length > 11) {
      value = `${value.slice(0, 11)}-${value.slice(11)}`;
    }
    
    setCpf(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        return setError('As senhas não coincidem.');
    }

    if (password.length < 6) {
        return setError('A senha deve ter pelo menos 6 caracteres.');
    }

    setLoading(true);

    try {
      await register(name, email, password, phone, cpf);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Falha ao criar conta');
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
                    <UserPlus className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Crie sua conta</h1>
                <p className="text-gray-400 text-sm">Comece sua jornada na Fusion Cloud.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Seu nome"
                        required
                    />
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Telefone</label>
                        <input 
                            type="text" 
                            value={phone}
                            onChange={handlePhoneChange}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="(11) 99999-9999"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CPF</label>
                        <input 
                            type="text" 
                            value={cpf}
                            onChange={handleCpfChange}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="000.000.000-00"
                            required
                        />
                    </div>
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
                </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirmar Senha</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CRIAR CONTA'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                    Fazer login
                </Link>
            </div>
        </div>
    </div>
  );
};

export default Register;
