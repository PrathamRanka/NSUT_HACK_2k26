"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple Dictionary for MVP
const dictionary: Record<string, { en: string; hi: string }> = {
    // Navigation & Common
    'Dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
    'Scheme Registry': { en: 'Scheme Registry', hi: 'योजना पंजीकरण' },
    'Vendor Intelligence': { en: 'Vendor Intelligence', hi: 'विक्रेता खुफिया' },
    'Alerts & Anomalies': { en: 'Alerts & Anomalies', hi: 'चेतावनी और विसंगतियां' },
    'Network Graph': { en: 'Network Graph', hi: 'नेटवर्क ग्राफ' },
    'Geospatial Map': { en: 'Geospatial Map', hi: 'भौगोलिक मानचित्र' },
    'Audit Log': { en: 'Audit Log', hi: 'ऑडिट लॉग' },
    'New Transaction': { en: 'New Transaction', hi: 'नया लेनदेन' },
    'Sign Out': { en: 'Sign Out', hi: 'साइन आउट' },

    // Header
    'Government of India': { en: 'Government of India', hi: 'भारत सरकार' },
    'Ministry of Finance': { en: 'Ministry of Finance', hi: 'वित्त मंत्रालय' },
    'Department of Expenditure': { en: 'Department of Expenditure', hi: 'व्यय विभाग' },
    'Operational Dashboard': { en: 'Operational Dashboard', hi: 'परिचालन डैशबोर्ड' },
    'Search': { en: 'Search Case ID / Vendor...', hi: 'केस आईडी / विक्रेता खोजें...' },

    // Dashboard Stats
    'Total Vendors': { en: 'Total Vendors', hi: 'कुल विक्रेता' },
    'Active Alerts': { en: 'Active Alerts', hi: 'सक्रिय अलर्ट' },
    'Flagged Transactions': { en: 'Flagged Transactions', hi: 'चिह्नित लेनदेन' },
    'System Status': { en: 'System Status', hi: 'सिस्टम स्थिति' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    };

    const t = (key: string) => {
        const item = dictionary[key];
        if (!item) return key; // Fallback to key if missing
        return item[language];
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
