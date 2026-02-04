import { useState, useEffect } from 'react';
import { FileText, Download, Search, Calendar, CreditCard } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../contexts/AuthContext';

const DashboardInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const API_KEY = import.meta.env.VITE_NEVERMISS_API_KEY;

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      
      try {
        if (!API_KEY) {
          throw new Error('VITE_NEVERMISS_API_KEY não configurada');
        }

        const allTransactions = []; 
        let offset = 0; 
        const limit = 100; 
        let hasMore = true;
        
        while (hasMore) { 
          const response = await fetch( 
            `https://carteira.nevermissapps.com/v1/transactions?limit=${limit}&offset=${offset}`, 
            { headers: { 'Authorization': `Bearer ${API_KEY}` } } 
          ); 
          
          const data = await response.json(); 
          
          if (data.transactions) {
            allTransactions.push(...data.transactions); 
          }
          
          hasMore = Boolean(data.pagination?.hasMore);
          if (hasMore) offset += limit; 
        }

        // Map API transactions to UI invoice format
        const mappedInvoices = allTransactions.map(tx => ({
          id: tx.id,
          userId: tx.metadata?.userId || 'N/A', // Use metadata if available
          userName: tx.metadata?.userName || tx.payer?.name || 'Cliente',
          userEmail: tx.metadata?.userEmail || tx.payer?.email || 'email@exemplo.com',
          plan: tx.description || 'Transação',
          amount: tx.amount ? `R$ ${parseFloat(tx.amount).toFixed(2).replace('.', ',')}` : 'R$ 0,00',
          status: tx.status || 'pending',
          date: tx.createdAt || new Date().toISOString(),
          paymentMethod: 'PIX'
        }));
        
        // Fetch local invoices (pending/created locally)
        let localInvoices = [];
        try {
            localInvoices = JSON.parse(localStorage.getItem('fusion_invoices') || '[]');
            if (!Array.isArray(localInvoices)) localInvoices = [];
        } catch (e) {
            console.error("Error parsing local invoices", e);
            localInvoices = [];
        }
        
        // Merge API invoices with local invoices
        // We prioritize API invoices, but show local ones that might not be in API yet
        const combinedInvoices = [...mappedInvoices];

        // Add local invoices ONLY if they don't match an existing API invoice ID
        localInvoices.forEach(localInv => {
            const existsInApi = mappedInvoices.some(apiInv => apiInv.id === localInv.id);
            if (!existsInApi) {
                // Check for potential "fuzzy match" (same amount, same plan, created within last 1 hour)
                // This helps avoid showing a pending local invoice AND a paid API invoice for the same transaction
                // if the ID wasn't synced correctly
                const isLikelyDuplicate = mappedInvoices.some(apiInv => {
                    const timeDiff = Math.abs(new Date(apiInv.date).getTime() - new Date(localInv.date).getTime());
                    const isRecent = timeDiff < 60 * 60 * 1000; // 1 hour
                    const sameAmount = apiInv.amount === localInv.amount;
                    return isRecent && sameAmount;
                });

                if (!isLikelyDuplicate) {
                    combinedInvoices.push(localInv);
                }
            }
        });

        // Filter invoices based on user role
        const displayedInvoices = user.role === 'admin' 
            ? combinedInvoices 
            : combinedInvoices.filter(inv => {
                const invoiceEmail = inv.userEmail?.toLowerCase();
                const currentUserEmail = user.email?.toLowerCase();
                
                // Allow matches by email
                if (invoiceEmail === currentUserEmail) return true;
                
                // Also show if it's a local invoice created by this user (stored in their browser)
                // Local invoices might not have email set correctly in some legacy cases, but they are in the user's localStorage
                const isLocal = inv.id.toString().startsWith('INV-');
                if (isLocal && inv.userEmail === currentUserEmail) return true;

                return false;
            });
        
        // Remove duplicates if any (based on ID, though local IDs are different)
        // Sort by date descending
        displayedInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));

        setInvoices(displayedInvoices);

      } catch (error) {
        console.error('Error fetching transactions:', error);
        // On error, show empty list or error state, DO NOT fallback to simulated data
        setInvoices([]); 
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInvoices();
    }
  }, [user, API_KEY]);

  const filteredInvoices = invoices.filter(invoice => 
    (invoice.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (invoice.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (invoice.plan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex">
      <DashboardSidebar />
      
      <main className="flex-1 ml-[90px] p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Faturas</h1>
            <p className="text-gray-400">Histórico de compras e pagamentos</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar faturas..." 
              className="bg-[#0f0f1a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
             <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Nenhuma fatura encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID / Data</th>
                    {user?.role === 'admin' && (
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Usuário</th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Plano</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{invoice.id}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {new Date(invoice.date).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                                    {invoice.userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-white font-medium">{invoice.userName}</span>
                                    <span className="text-xs text-gray-500">{invoice.userEmail}</span>
                                </div>
                            </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{invoice.plan}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-white">{invoice.amount}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <CreditCard className="w-3 h-3" />
                            {invoice.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white" title="Baixar PDF">
                            <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardInvoices;
