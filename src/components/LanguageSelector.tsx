import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex justify-end gap-2 p-4 absolute top-0 right-0 z-50">
      <button
        onClick={() => setLanguage('pt')}
        className={cn(
          "transition-transform hover:scale-110 overflow-hidden rounded-sm border border-white/10",
          language !== 'pt' && "grayscale opacity-50"
        )}
        title="Português"
      >
        <img
          src="https://flagcdn.com/w40/br.png"
          alt="Brasil"
          className="w-6 h-4 object-cover"
        />
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "transition-transform hover:scale-110 overflow-hidden rounded-sm border border-white/10",
          language !== 'en' && "grayscale opacity-50"
        )}
        title="English"
      >
        <img
          src="https://flagcdn.com/w40/us.png"
          alt="USA"
          className="w-6 h-4 object-cover"
        />
      </button>
    </div>
  );
};

export default LanguageSelector;