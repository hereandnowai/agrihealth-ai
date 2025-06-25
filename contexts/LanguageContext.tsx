
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Language, LocalizedStrings } from '../types';
import enStrings from '../translations/en';
import hiStrings from '../translations/hi';
import taStrings from '../translations/ta';
import frStrings from '../translations/fr'; // Added French import

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getLocalizedString: (key: keyof LocalizedStrings, fallback?: string) => string;
}

const translations: Record<Language, LocalizedStrings> = {
  [Language.EN]: enStrings,
  [Language.HI]: hiStrings,
  [Language.TA]: taStrings,
  [Language.FR]: frStrings, // Added French translations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.EN); // Default language

  const getLocalizedString = useCallback((key: keyof LocalizedStrings, fallback?: string): string => {
    return translations[language]?.[key] || translations[Language.EN]?.[key] || fallback || String(key);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getLocalizedString }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};