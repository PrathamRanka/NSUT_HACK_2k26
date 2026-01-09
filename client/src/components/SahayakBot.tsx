"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export function SahayakBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: 'Namaste! I am Sahayak, your PFMS AI Assistant. Ask me about Scheme Utilization, Vendor Risk, or recent Alerts.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Mock AI Response Logic
        setTimeout(() => {
            let response = "I'm still learning, but I can help navigate the dashboard.";
            const query = userMsg.toLowerCase();

            if (query.includes('risk') || query.includes('vendor')) {
                response = "I found 3 Vendors with HIGH RISK scores (>80) in the Mumbai region. You can view them in the Vendor Intelligence module.";
            } else if (query.includes('scheme') || query.includes('fund')) {
                response = "MGNREGA utilization is at 45% for the current fiscal quarter. 12 Alerts have been flagged related to duplicate beneficiaries.";
            } else if (query.includes('alert') || query.includes('fraud')) {
                response = "There are 5 Critical Alerts requiring immediate attention today. Most are related to 'Velocity Checks' in PM-KISAN.";
            } else if (query.includes('hello') || query.includes('hi')) {
                response = "Namaste Officer! How can I assist you with fraud detection today?";
            }

            setMessages(prev => [...prev, { role: 'bot', text: response }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-lg shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-blue-900 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center">
                            <Bot className="h-5 w-5 mr-2" />
                            <h3 className="font-bold text-sm">PFMS Sahayak AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-800 p-1 rounded">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 mr-2"
                            placeholder="Ask Sahayak..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="bg-blue-900 text-white p-2 rounded-full hover:bg-blue-800 transition-colors">
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>
        </div>
    );
}
