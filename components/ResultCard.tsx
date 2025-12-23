import React, { useEffect, useState } from 'react';
import { SearchResult, UserPreferences } from '../types';
import { generateAIAnalysis } from '../services/aiService';
import { Star, MapPin, Coffee, Navigation, Utensils } from 'lucide-react';

interface Props {
  result: SearchResult;
  preferences: UserPreferences;
  isTopResult: boolean;
  delayIndex: number;
}

const ResultCard: React.FC<Props> = ({ result, preferences, isTopResult, delayIndex }) => {
  const [aiData, setAiData] = useState<{
    loading: boolean;
    data: { recommendation: string; atmosphere: string; actionGuide: string } | null
  }>({ loading: true, data: null });

  useEffect(() => {
    let isMounted = true;
    
    const fetchAI = async () => {
      // Only fetch AI analysis for valid matches or if it's the specific recommendation needed
      if (result.score === 0) {
        if (isMounted) setAiData({ loading: false, data: null });
        return;
      }

      setAiData({ loading: true, data: null });

      // Stagger requests to avoid 429 Rate Limit
      if (delayIndex > 0) {
        await new Promise(resolve => setTimeout(resolve, delayIndex * 1500));
      }

      if (!isMounted) return;

      const analysis = await generateAIAnalysis(result, preferences);
      if (isMounted) {
        setAiData({ loading: false, data: analysis });
      }
    };

    fetchAI();

    return () => { isMounted = false; };
  }, [result.shop.id, preferences, delayIndex]);

  if (result.score === 0) return null;

  // Star rendering helper
  const renderStars = (score: number) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.round(score) ? 'fill-current' : 'text-stone-300'}`}
          />
        ))}
        <span className="ml-2 text-stone-600 text-sm font-semibold">{score.toFixed(1)}</span>
      </div>
    );
  };

  const handleNavigation = () => {
    const query = result.shop.address || result.shop.name;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const handleViewMenu = () => {
    // Include location in the search query for better results
    const query = `${result.shop.name} ${result.shop.location} 菜單`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
    window.open(url, '_blank');
  };

  return (
    <div className={`mb-6 rounded-2xl overflow-hidden transition-all duration-300 ${isTopResult ? 'shadow-2xl border-2 border-coffee-400 bg-white transform scale-[1.02]' : 'shadow-md bg-white border border-stone-100 opacity-90'}`}>
      
      {/* Header */}
      <div className="bg-stone-50 p-4 border-b border-stone-100 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-coffee-900">{result.shop.name}</h3>
            {isTopResult && <span className="bg-coffee-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Top Match</span>}
          </div>
          {result.shop.address && (
            <div className="text-xs text-stone-500 mb-1">{result.shop.address}</div>
          )}
          <div className="flex items-center text-stone-500 text-sm">
             <MapPin className="w-3 h-3 mr-1" />
             {result.shop.distance < 1000 ? `${result.shop.distance}m` : `${(result.shop.distance / 1000).toFixed(1)}km`} 
             <span className="mx-2">•</span>
             約步行 {Math.ceil(result.shop.distance / 80)} 分鐘
          </div>
        </div>
        <div className="flex flex-col items-end">
           {renderStars(result.score)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
            {result.shop.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded-md">
                    {tag}
                </span>
            ))}
        </div>

        {/* AI Content Area */}
        <div className="bg-coffee-50 rounded-xl p-4 border border-coffee-100 relative">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Coffee className="w-12 h-12" />
          </div>
          
          {aiData.loading ? (
             <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-coffee-200 rounded w-3/4"></div>
                <div className="h-4 bg-coffee-200 rounded w-full"></div>
                <div className="h-4 bg-coffee-200 rounded w-1/2"></div>
             </div>
          ) : aiData.data ? (
            <div className="space-y-3 text-sm">
                <div>
                    <span className="font-bold text-coffee-800 block mb-1">💡 推薦理由</span>
                    <p className="text-stone-700 leading-relaxed">{aiData.data.recommendation}</p>
                </div>
                <div>
                    <span className="font-bold text-coffee-800 block mb-1">✨ AI 氛圍快照</span>
                    <p className="text-stone-600 italic">"{aiData.data.atmosphere}"</p>
                </div>
                <div className="pt-2 border-t border-coffee-200">
                    <span className="font-bold text-coffee-800 inline-block mr-2">🚀 行為引導</span>
                    <span className="text-stone-700">{aiData.data.actionGuide}</span>
                </div>
            </div>
          ) : (
             <p className="text-sm text-stone-500">無法產生分析。</p>
          )}
        </div>
        
        {/* Action Button Mockup */}
        <div className="flex gap-2 pt-2">
            <button 
                onClick={handleNavigation}
                className="flex-1 bg-stone-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors flex items-center justify-center"
            >
                <Navigation className="w-4 h-4 mr-2" />
                導航前往
            </button>
             <button 
                onClick={handleViewMenu}
                className="flex-1 border border-stone-300 text-stone-600 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors flex items-center justify-center">
                <Utensils className="w-4 h-4 mr-2" />
                查看菜單
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;