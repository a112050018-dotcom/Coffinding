import React, { useState } from 'react';
import { ALL_TAGS, UserPreferences } from '../types';
import { MapPin, Search, Coffee, Zap, Star } from 'lucide-react';

interface Props {
  onSearch: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState('民生社區');
  const [mustHave, setMustHave] = useState<string[]>([]);
  const [niceToHave, setNiceToHave] = useState<string[]>([]);

  const toggleTag = (tag: string, type: 'must' | 'nice') => {
    if (type === 'must') {
      if (mustHave.includes(tag)) {
        setMustHave(mustHave.filter(t => t !== tag));
      } else {
        setMustHave([...mustHave, tag]);
        // Remove from nice if exists
        setNiceToHave(niceToHave.filter(t => t !== tag));
      }
    } else {
      if (niceToHave.includes(tag)) {
        setNiceToHave(niceToHave.filter(t => t !== tag));
      } else {
        setNiceToHave([...niceToHave, tag]);
        // Remove from must if exists
        setMustHave(mustHave.filter(t => t !== tag));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location,
      mustHaveTags: mustHave,
      niceToHaveTags: niceToHave
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl max-w-md w-full mx-auto border border-stone-100">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-coffee-900 mb-1">尋找你的完美角落</h2>
        <p className="text-stone-500 text-sm">告訴 AI 你今天的咖啡廳需求</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-coffee-800">
            <MapPin className="w-4 h-4 mr-2 text-coffee-500" />
            目前位置 / 區域
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coffee-400 focus:outline-none text-stone-700 transition-all"
            placeholder="例如：民生社區、中山區..."
          />
        </div>

        {/* Must Have Tags */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-red-700">
            <Zap className="w-4 h-4 mr-2" />
            絕對匹配 (Must-have)
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => (
              <button
                key={`must-${tag}`}
                type="button"
                onClick={() => toggleTag(tag, 'must')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  mustHave.includes(tag)
                    ? 'bg-red-100 text-red-700 border-red-200 ring-1 ring-red-400'
                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100 border border-transparent'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Nice to Have Tags */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-coffee-600">
            <Star className="w-4 h-4 mr-2" />
            加分匹配 (Nice-to-have)
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => (
              <button
                key={`nice-${tag}`}
                type="button"
                onClick={() => toggleTag(tag, 'nice')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  niceToHave.includes(tag)
                    ? 'bg-coffee-100 text-coffee-800 border-coffee-200 ring-1 ring-coffee-400'
                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100 border border-transparent'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-coffee-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-coffee-800 active:transform active:scale-95 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI 計算中...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              開始尋咖
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;