export interface Shop {
  id: string;
  name: string;
  tags: string[]; // Features the shop has
  distance: number; // in meters
  location: string;
  address?: string;
  attributes: {
    quietness: number; // 1-5
    sockets: 'None' | 'Few' | 'Many';
    wifi: 'None' | 'Weak' | 'Strong';
    timeLimit: string; // "Unlimited" or "90min" etc
    food: string[];
    closingTime: string;
  };
}

export interface UserPreferences {
  location: string;
  mustHaveTags: string[];
  niceToHaveTags: string[];
}

export interface SearchResult {
  shop: Shop;
  score: number;
  matchDetails: {
    matchedTags: string[];
    missingMustHaves: string[];
  };
  aiAnalysis?: AIAnalysisResponse;
}

export interface AIAnalysisResponse {
  recommendation: string;
  atmosphere: string;
  actionGuide: string;
}

export const ALL_TAGS = [
  "插座多",
  "不限時",
  "安靜",
  "Wi-Fi強",
  "有簡餐",
  "採光極佳",
  "寵物友善",
  "營業至深夜",
  "單品咖啡"
];