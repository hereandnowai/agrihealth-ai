
import React from 'react';
import { Link } from 'react-router-dom';
import { ORGANISATION_LOGO_URL, ORGANISATION_SHORT_NAME, BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR } from '../constants';
import { Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { MenuIcon, ChevronDownIcon } from './icons';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { language, setLanguage, getLocalizedString } = useLanguage();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-[${BRAND_SECONDARY_COLOR}] text-[${BRAND_PRIMARY_COLOR}] shadow-md p-3 flex items-center justify-between h-16`}>
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className={`text-[${BRAND_PRIMARY_COLOR}] p-2 rounded-md hover:bg-yellow-400 hover:text-teal-700 md:hidden`}
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center ml-2 md:ml-0">
          <img src={ORGANISATION_LOGO_URL} alt={`${ORGANISATION_SHORT_NAME} Logo`} className="h-10 w-auto mr-2 rounded" />
          <div className="flex flex-col">
            <span className={`text-xl font-bold text-[${BRAND_PRIMARY_COLOR}]`}>{ORGANISATION_SHORT_NAME}</span>
            <span className="text-xs text-yellow-200 opacity-80">AgriHealth AI</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={language}
            onChange={handleLanguageChange}
            className={`bg-transparent border border-[${BRAND_PRIMARY_COLOR}] text-[${BRAND_PRIMARY_COLOR}] text-sm rounded-md focus:ring-yellow-500 focus:border-yellow-500 py-1.5 pl-3 pr-8 appearance-none`}
            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          >
            <option value={Language.EN} className={`text-gray-800 bg-white`}>English</option>
            <option value={Language.HI} className={`text-gray-800 bg-white`}>हिन्दी</option>
            <option value={Language.TA} className={`text-gray-800 bg-white`}>தமிழ்</option>
            <option value={Language.FR} className={`text-gray-800 bg-white`}>Français</option> {/* Added French option */}
          </select>
          <ChevronDownIcon className={`w-4 h-4 text-[${BRAND_PRIMARY_COLOR}] absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none`} />
        </div>
        {/* Placeholder for User Profile/Login if added later */}
      </div>
    </header>
  );
};

export default Header;