import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
  lang: 'fr' | 'en';
  onToggleLang: () => void;
}

const Header = ({ onSearch, lang, onToggleLang }: Props) => {
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">K</span>
          </div>
          <span className="text-zinc-900 font-semibold text-lg tracking-tight">Knovia</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={lang === 'fr' ? 'Rechercher un sujet...' : 'Search a topic...'}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-zinc-900 placeholder-gray-400 focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
        </div>

        {/* Lang toggle */}
        <button
          onClick={onToggleLang}
          className="shrink-0 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>

      </div>
    </header>
  );
};

export default Header;