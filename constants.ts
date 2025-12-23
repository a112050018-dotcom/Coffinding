import { Shop } from './types';

export const MOCK_DB: Shop[] = [
  // --- 店 A：工作型 (核心：插座多、極安靜、不限時) ---
  {
    id: "A1",
    name: "Homey Cafe",
    location: "忠孝敦化",
    address: "台北市大安區敦化南路一段 236 巷 36 號 2 樓",
    distance: 300, // 模擬距離
    tags: ["插座多", "不限時", "Wi-Fi強", "有簡餐", "單品咖啡"],
    attributes: {
      quietness: 4,
      sockets: 'Many',
      wifi: 'Strong',
      timeLimit: "Unlimited",
      food: ["簡餐"],
      closingTime: "23:00"
    }
  },
  {
    id: "A5",
    name: "All Day Roasting",
    location: "民生社區",
    address: "台北市松山區延壽街 329 號",
    distance: 800, // 模擬距離
    tags: ["插座多", "Wi-Fi強", "採光極佳", "單品咖啡"],
    attributes: {
      quietness: 5,
      sockets: 'Many',
      wifi: 'Strong',
      timeLimit: "Unlimited",
      food: ["單品咖啡"],
      closingTime: "21:00"
    }
  },
  // --- 店 B：網美型 (核心：採光極佳、有簡餐、限時) ---
  {
    id: "B1",
    name: "Drunk Cafe 爛醉咖啡",
    location: "國父紀念館",
    address: "台北市大安區光復南路 116 巷 9 號",
    distance: 1500, // 模擬距離
    tags: ["採光極佳", "有簡餐"],
    attributes: {
      quietness: 2,
      sockets: 'None',
      wifi: 'Weak',
      timeLimit: "90min",
      food: ["簡餐"],
      closingTime: "18:00"
    }
  },
  // --- 店 C：深夜型 (核心：營業至深夜、有水餃/漫畫、不限時) ---
  {
    id: "C1",
    name: "Sugar Man Cafe",
    location: "古亭站",
    address: "台北市大安區和平東路一段 87-1 號",
    distance: 2500, // 模擬距離
    tags: ["營業至深夜", "不限時", "插座多", "有簡餐"],
    attributes: {
      quietness: 4,
      sockets: 'Many',
      wifi: 'Strong',
      timeLimit: "Unlimited",
      food: ["簡餐"],
      closingTime: "04:00"
    }
  }
];

export const API_KEY = "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";
export const API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const MODEL_ID = "google/gemma-3n-e2b-it:free";