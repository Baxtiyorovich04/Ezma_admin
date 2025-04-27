import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from 'react-icons/io';
import uzFlag from '../assets/icons/flag-uz.avif';
import ruFlag from '../assets/icons/flag-ru.avif';

const languages = [
  { code: 'uz', name: 'Uzb', flag: uzFlag },
  { code: 'ru', name: 'Рус', flag: ruFlag }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'uz';
  });

  useEffect(() => {
    i18n.changeLanguage(currentLang);
    localStorage.setItem('language', currentLang);
  }, [currentLang, i18n]);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <div className="language-switcher">
      <button 
        className="language-switcher__button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={currentLanguage?.flag} alt={currentLanguage?.name} />
        {currentLanguage?.name}
        <IoIosArrowDown className={`arrow ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="language-switcher__dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-switcher__option ${
                currentLang === lang.code ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <img src={lang.flag} alt={lang.name} />
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 