"use client";

import { Bell, Search, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
    const { user } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();

    // Font Size Handlers
    const setFontSize = (size: string) => {
        const root = document.documentElement;
        if (size === 'small') root.style.fontSize = '14px';
        if (size === 'default') root.style.fontSize = '16px';
        if (size === 'large') root.style.fontSize = '18px';
    };

    return (
        <div className="flex flex-col w-full shadow-md z-20">
            {/* Top Accessibility Bar */}
            <div className="bg-[#2a2a2a] text-[#ddd] text-xs py-1.5 px-4 md:px-6 flex justify-between items-center">
                <div className="hidden md:flex gap-4">
                    <a href="#" className="hover:text-white border-r border-gray-600 pr-4">{t('Government of India')}</a>
                    <a href="#" className="hover:text-white">{t('Ministry of Finance')}</a>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setFontSize('small')} className="hover:text-white font-bold" title="Decrease Font Size">A-</button>
                    <button onClick={() => setFontSize('default')} className="hover:text-white font-bold" title="Default Font Size">A</button>
                    <button onClick={() => setFontSize('large')} className="hover:text-white font-bold" title="Increase Font Size">A+</button>
                    <span className="h-3 w-px bg-gray-600 mx-1"></span>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 hover:text-white font-semibold text-yellow-500 transition-colors"
                    >
                        <Globe className="w-3 h-3" />
                        {language === 'en' ? 'Hindi' : 'English'}
                    </button>
                </div>
            </div>

            {/* Main Government Banner */}
            <header className="bg-white border-b border-gray-300 py-3 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                    {/* Emblem Placeholders */}
                    <div className="flex flex-col items-center">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                            alt="Emblem"
                            className="h-10 md:h-12 w-auto opacity-90"
                        />
                    </div>
                    <div>
                        <h1 className="text-sm md:text-base font-bold text-[#1b1b1b] uppercase leading-tight">
                            {t('Ministry of Finance')}
                        </h1>
                        <h2 className="text-xs md:text-sm font-semibold text-[#444]">
                            {language === 'en' ? 'Department of Expenditure' : 'व्यय विभाग'}
                        </h2>
                    </div>
                </div>

                {/* Dashboard Title & Search */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-sm font-bold text-blue-900 border-b border-blue-900 mb-0.5">Vitt-Prahari <span className="text-xs font-normal text-gray-600">(PFMS Intel)</span></span>
                        <span className="text-xs text-gray-500">
                            {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <div className="relative flex-1 md:flex-none">
                        <input
                            type="text"
                            placeholder={t('Search')}
                            className="w-full md:w-64 pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 bg-gray-50"
                        />
                        <Search className="h-4 w-4 text-gray-500 absolute right-3 top-2.5" />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative" title="Notifications">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-600 rounded-full border border-white"></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Saffron/White/Green Strip (Decoration) */}
            <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] opacity-80"></div>
        </div>
    );
}
