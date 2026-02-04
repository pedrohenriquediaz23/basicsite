import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Send, X, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setInputText('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId
        })
      });

      const data = await response.json();
      
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Erro ao conectar com o servidor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[350px] h-[500px] bg-[#1a1a1a] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 flex items-center justify-between shadow-md border-b border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full border border-white/10">
                  <Headphones className="text-purple-300 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">Fusion IA</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    <span className="text-xs text-purple-200/90">Online agora</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-purple-200/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a16] scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="text-center mt-10 opacity-60">
                  <div className="bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-500/20">
                    <Headphones className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Olá! 👋 Como posso te ajudar hoje?
                  </p>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-900/20' 
                        : 'bg-[#1a1a2e] text-gray-200 rounded-tl-none border border-purple-500/20 shadow-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a2e] p-3 rounded-2xl rounded-tl-none flex gap-1 border border-purple-500/20">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-[#0f0f1a] border-t border-purple-500/20">
              <div className="flex items-center gap-2 bg-[#1a1a2e] rounded-full px-4 py-2 border border-purple-500/20 focus-within:border-purple-500/50 transition-colors shadow-inner">
                <Paperclip className="w-4 h-4 text-purple-400/50 cursor-pointer hover:text-purple-300 transition-colors" />
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-purple-400/30 min-w-0"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputText.trim()}
                  className={`p-1.5 rounded-full transition-all flex-shrink-0 ${
                    inputText.trim() 
                      ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30' 
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all hover:scale-110 active:scale-95 group relative z-50 border border-purple-400/30"
      >
        <Headphones className="w-6 h-6" />
        {!isOpen && (
          <span className="absolute right-0 top-0 flex h-3 w-3 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 border-2 border-[#030014]"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;