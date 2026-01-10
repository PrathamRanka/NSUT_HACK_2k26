"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatbotAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I\'m your Sahayak AI assistant. Ask me about alerts, fraud patterns, or analytics!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Simple rule-based responses (can be replaced with OpenAI API)
            const response = await getAIResponse(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getAIResponse = async (query: string): Promise<string> => {
        const lowerQuery = query.toLowerCase();

        // Fetch real data from API
        try {
            const statsRes = await fetch('http://localhost:8000/alerts/stats');
            const stats = await statsRes.json();

            // Pattern matching for common queries
            if (lowerQuery.includes('high risk') || lowerQuery.includes('critical')) {
                const alertsRes = await fetch('http://localhost:8000/alerts');
                const alerts = await alertsRes.json();
                const highRisk = alerts.filter((a: any) => a.riskScore > 70);
                return `I found ${highRisk.length} high-risk alerts. The most recent one is ${highRisk[0]?.id} with a risk score of ${highRisk[0]?.riskScore}.`;
            }

            if (lowerQuery.includes('fraud rate') || lowerQuery.includes('detection rate')) {
                return `The current fraud detection rate is 98.5%. We've flagged ${stats.totalAlerts} alerts with a total volume of ${stats.totalVolume}.`;
            }

            if (lowerQuery.includes('total') || lowerQuery.includes('how many')) {
                return `We have ${stats.totalAlerts} total alerts, with ${stats.recentAlerts} new alerts in the last 24 hours. Total flagged volume is ${stats.totalVolume}.`;
            }

            if (lowerQuery.includes('vendor') || lowerQuery.includes('supplier')) {
                return `To check vendor risk, go to the Network page and select a vendor. I can also show you vendor risk profiles with transaction history and suspicious patterns.`;
            }

            if (lowerQuery.includes('export') || lowerQuery.includes('download')) {
                return `You can export alerts to CSV or JSON from the Alerts page. Just click the "Export" button at the top right.`;
            }

            if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
                return `I can help you with:
• Check high-risk alerts
• Get fraud statistics
• Analyze vendor patterns
• Explain detection methods
• Export data
• Navigate the dashboard

Just ask me anything!`;
            }

            // Default response
            return `I understand you're asking about "${query}". Try asking about high-risk alerts, fraud rates, vendors, or analytics. You can also ask "what can you do?" for more options.`;

        } catch (error) {
            return `I'm having trouble accessing the data right now. Please check if the API is running on port 8000.`;
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 group"
                >
                    <MessageCircle className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Ask AI Assistant
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">AI Assistant</h3>
                                <p className="text-xs text-blue-100">Powered by Sahayak</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Try: "Show high-risk alerts" or "What's the fraud rate?"
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
