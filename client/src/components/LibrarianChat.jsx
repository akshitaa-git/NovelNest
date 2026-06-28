import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LibrarianChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([
        { role: 'model', content: "Welcome to the archives, friend. I am the NovelNest Librarian. How may I assist your literary journey today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    if (!user) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMsg = { role: 'user', content: message };
        setHistory(prev => [...prev, userMsg]);
        setMessage('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/ai/chat',
                { message, chatHistory: history },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setHistory(prev => [...prev, { role: 'model', content: res.data.response }]);
        } catch (err) {
            console.error('Chat Error:', err);
            setHistory(prev => [...prev, { role: 'model', content: "I'm sorry, my quill seems to have run out of ink. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[#1e3424] border border-[#5a9060]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[#5a9060]/20 bg-[#1a2c1d] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#c9863a]/20 flex items-center justify-center border border-[#c9863a]/40">
                                    <BookOpen size={20} className="text-[#c9863a]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-serif font-bold text-[#f2ead8]">The Librarian</h3>
                                    <span className="text-[10px] uppercase tracking-widest text-[#5a9060] font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-[#c9863a] rounded-full animate-pulse" />
                                        In the Archives
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#b5a98a] hover:text-[#f2ead8] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide"
                        >
                            {history.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-[#c9863a] text-[#fdfaf4] rounded-br-none shadow-lg'
                                        : 'bg-[#1a2c1d] text-[#b5a98a] border border-[#5a9060]/10 rounded-bl-none font-serif'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#1a2c1d] p-3 rounded-2xl rounded-bl-none flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-[#5a9060] rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-[#5a9060] rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-[#5a9060] rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-[#162a19] border-t border-[#5a9060]/10">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your inquiry..."
                                    className="w-full bg-[#1e3424] border border-[#5a9060]/20 text-[#f2ead8] text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-[#c9863a]/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#c9863a] hover:text-[#d4944a] disabled:opacity-50 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="mt-2 text-[10px] text-center text-[#b5a98a]/50 italic">
                                Ask about book recommendations or your shelf activity.
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-[#1a2c1d] rotate-90' : 'bg-[#c9863a]'
                    }`}
            >
                {isOpen ? <X className="text-[#f2ead8]" /> : <Sparkles className="text-[#fdfaf4]" />}
            </motion.button>
        </div>
    );
};

export default LibrarianChat;
