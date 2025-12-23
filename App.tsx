import React, { useState } from 'react';
import { MOCK_DB } from './constants';
import { SearchResult, Shop, UserPreferences } from './types';
import SearchForm from './components/SearchForm';
import ResultCard from './components/ResultCard';
import { Coffee, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'search' | 'results'>('search');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentPrefs, setCurrentPrefs] = useState<UserPreferences | null>(null);

  const calculateScore = (shop: Shop, prefs: UserPreferences): SearchResult => {
    const { mustHaveTags, niceToHaveTags } = prefs;
    
    // 1. Must-have check (Absolute Match)
    const missingMustHaves = mustHaveTags.filter(tag => !shop.tags.includes(tag));
    
    if (missingMustHaves.length > 0) {
      return {
        shop,
        score: 0,
        matchDetails: { matchedTags: [], missingMustHaves }
      };
    }

    // 2. Score Calculation
    // Combine lists effectively for the "User selected tags" pool
    // Note: The formula says "Total User Selected Tags". 
    // If User selects 2 must-have and 1 nice-to-have, total is 3.
    const allUserTags = [...mustHaveTags, ...niceToHaveTags];
    
    // If user selected no tags at all, give a neutral score or 0? 
    // Spec implies filtering by needs. If no tags, score might rely purely on defaults, but let's assume 0 if empty to prompt input.
    if (allUserTags.length === 0) {
        // Fallback for empty search: Return all with base score based on "General Quality" (simulated by average attr)
        // or just return 0. Let's return 3 stars as base.
        return {
            shop,
            score: 3,
            matchDetails: { matchedTags: [], missingMustHaves: [] }
        };
    }

    const matchedTags = allUserTags.filter(tag => shop.tags.includes(tag));
    let score = (matchedTags.length / allUserTags.length) * 5;

    // 3. Distance Bonus Logic: < 500m & Score >= 4
    // Note: The spec says "In recommendation text add 'Close distance'".
    // It doesn't explicitly say "Add points to score", but usually ranking algorithms might bump it.
    // However, I will strictly follow the "Match Score" formula S provided for the number.
    // The "Close distance" logic will be handled in the AI Prompt injection or display.
    
    return {
      shop,
      score,
      matchDetails: { matchedTags, missingMustHaves: [] }
    };
  };

  const handleSearch = async (prefs: UserPreferences) => {
    setLoading(true);
    setCurrentPrefs(prefs);

    // Simulate network delay for effect
    setTimeout(() => {
      const calculatedResults = MOCK_DB.map(shop => calculateScore(shop, prefs));
      
      // Sort: Descending score, then ascending distance
      calculatedResults.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.shop.distance - b.shop.distance;
      });

      setResults(calculatedResults);
      setLoading(false);
      setView('results');
    }, 800);
  };

  const handleReset = () => {
    setView('search');
    setResults([]);
    setCurrentPrefs(null);
  };

  // Check if any valid results exist
  const hasValidResults = results.some(r => r.score > 0);

  return (
    <div className="min-h-screen bg-[#fdf8f6] text-stone-800 pb-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fdf8f6]/95 backdrop-blur-sm border-b border-stone-200 px-6 py-4 flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-coffee-900 text-white p-1.5 rounded-lg">
             <Coffee size={20} />
           </div>
           <h1 className="text-xl font-bold tracking-tight text-coffee-900">Coffinding 尋咖</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 max-w-lg">
        {view === 'search' ? (
          <div className="animate-fade-in-up">
            <SearchForm onSearch={handleSearch} isLoading={loading} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <button 
              onClick={handleReset}
              className="mb-4 flex items-center text-sm font-medium text-stone-500 hover:text-coffee-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              重新搜尋
            </button>

            {!hasValidResults ? (
               <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-stone-100">
                  <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Coffee className="w-8 h-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2">找不到符合「絕對匹配」的店家</h3>
                  <p className="text-stone-600 mb-6">目前的條件組合較嚴苛，是否建議我放寬部分標籤來為您搜尋？</p>
                  
                  <button 
                    onClick={handleReset}
                    className="w-full py-3 bg-coffee-600 text-white rounded-xl font-bold shadow hover:bg-coffee-700 transition-colors"
                  >
                    調整搜尋條件
                  </button>
               </div>
            ) : (
              <div>
                <div className="mb-4 pl-1">
                   <h2 className="text-lg font-bold text-stone-800">為您找到的契合店家</h2>
                   <p className="text-xs text-stone-500">根據您的需求與 AI 契合度評分排序</p>
                </div>
                {results.map((result, index) => (
                  <ResultCard 
                    key={result.shop.id} 
                    result={result} 
                    preferences={currentPrefs!}
                    isTopResult={index === 0}
                    delayIndex={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;