import { API_KEY, API_URL, MODEL_ID } from '../constants';
import { Shop, UserPreferences, AIAnalysisResponse, SearchResult } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates the specific AI response format required by the spec.
 */
export const generateAIAnalysis = async (
  result: SearchResult,
  preferences: UserPreferences
): Promise<AIAnalysisResponse> => {
  
  // Construct the prompt to simulate the "Backend Engine" persona
  const prompt = `
    你現在是「Coffinding 尋咖」網站的智慧後端引擎。
    
    使用者需求：
    - 目前位置/區域：${preferences.location}
    - 絕對匹配 (Must-have)：${preferences.mustHaveTags.join(', ') || '無'}
    - 加分匹配 (Nice-to-have)：${preferences.niceToHaveTags.join(', ') || '無'}
    
    候選店家資訊：
    - 店名：${result.shop.name}
    - 距離：${result.shop.distance}m
    - 標籤：${result.shop.tags.join(', ')}
    - 契合度星等：${result.score.toFixed(1)} / 5
    - 屬性細節：${JSON.stringify(result.shop.attributes)}

    請根據上述資訊，產出一段JSON格式的回應。
    
    回應必須嚴格遵守以下JSON結構，不要包含Markdown代碼區塊，只要純JSON字串：
    {
      "recommendation": "推薦理由：(說明為何符合標籤，或缺少了什麼，若距離<500m且星等>=4請加入「距離極近」字眼)",
      "atmosphere": "AI 氛圍快照：(模擬一段充滿畫面感的評論摘要)",
      "actionGuide": "行為引導：(詢問是否要查看菜單或導航)"
    }
    
    保持專業、直覺、資訊導向的口吻。
  `;

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter for free models
          'X-Title': 'Coffinding App'
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
        })
      });

      if (response.status === 429) {
        console.warn(`Rate limit 429 encountered. Attempt ${attempt + 1} of ${maxRetries}`);
        if (attempt < maxRetries - 1) {
           const waitTime = 2000 * (attempt + 1); // Exponential backoff: 2s, 4s...
           await sleep(waitTime);
           attempt++;
           continue;
        } else {
            throw new Error(`API Rate Limit Exceeded (429)`);
        }
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      // Parse JSON from the AI response
      // Sometimes local/free models wrap JSON in markdown blocks, we need to clean it
      const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        return JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse AI JSON", cleanJson);
        // Fallback if JSON parsing fails
        return {
          recommendation: `推薦理由：這家店有 ${result.shop.tags.join(', ')}，符合您的部分需求。`,
          atmosphere: "AI 氛圍快照：資料解析中...",
          actionGuide: "行為引導：查看詳情？"
        };
      }

    } catch (error) {
      console.error(`AI Service Attempt ${attempt+1} Error:`, error);
      
      if (attempt === maxRetries - 1) {
          return {
            recommendation: "推薦理由：系統暫時無法連線至 AI 引擎，但根據數據，此店家符合您的硬體需求。",
            atmosphere: "AI 氛圍快照：(離線模式)",
            actionGuide: "行為引導：是否直接導航？"
          };
      }
      attempt++;
      await sleep(1000); // Wait a bit before retrying generic errors
    }
  }
  
  return {
    recommendation: "推薦理由：系統忙碌中。",
    atmosphere: "AI 氛圍快照：(無法取得)",
    actionGuide: "行為引導：導航前往"
  };
};