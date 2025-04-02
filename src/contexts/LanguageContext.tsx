
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define supported languages
export type Language = 'en' | 'rw';

// Translations interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Initial translations
const translations: Translations = {
  en: {
    // Home page
    "welcome": "Welcome to Iwacu",
    "tagline": "Discover Rwanda through authentic local experiences",
    "explore": "Explore Experiences",
    "aboutUs": "About Us",
    "services": "Services",
    "contactUs": "Contact Us",

    // Auth
    "login": "Sign In",
    "register": "Sign Up",
    "email": "Email",
    "password": "Password",
    "firstName": "First Name",
    "lastName": "Last Name",
    "forgotPassword": "Forgot password?",
    "accountType": "Account Type",
    "tourist": "Tourist",
    "provider": "Service Provider",
    "termsConditions": "terms and conditions",
    "alreadyHaveAccount": "Already have an account?",
    "dontHaveAccount": "Don't have an account?",
    "createAccount": "Create account",
  },
  rw: {
    // Home page
    "welcome": "Murakaza Neza kuri Iwacu",
    "tagline": "Menya u Rwanda binyuze mu bikorwa nyarwanda",
    "explore": "Reba Ibintu Bijyanye",
    "aboutUs": "Abo Turi Bo",
    "services": "Serivisi",
    "contactUs": "Twandikire",

    // Auth
    "login": "Injira",
    "register": "Iyandikishe",
    "email": "Imeri",
    "password": "Ijambo ry'ibanga",
    "firstName": "Izina",
    "lastName": "Izina ry'umuryango",
    "forgotPassword": "Wibagiwe ijambo ry'ibanga?",
    "accountType": "Ubwoko bwa konti",
    "tourist": "Mukerarugendo",
    "provider": "Utanga serivisi",
    "termsConditions": "amabwiriza n'amategeko",
    "alreadyHaveAccount": "Usanzwe ufite konti?",
    "dontHaveAccount": "Nta konti ufite?",
    "createAccount": "Gufungura konti",
  }
};

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'rw')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    
    // Fallback to English
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    
    // Return key if translation not found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
