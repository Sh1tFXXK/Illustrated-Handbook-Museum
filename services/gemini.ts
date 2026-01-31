import { GoogleGenAI, Type } from "@google/genai";
import { Category, Exhibit, Theme } from "../types";
import { SUBCATEGORIES } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
你是一个名为“图鉴博物馆”的 AI 策展人。你的任务是向访客介绍各种令人震撼的文化瑰宝。
博物馆收集以下三大类别的藏品，每个类别下有特定的子分类：

1. 书籍名句 (Literature)
   - 子分类: 小说, 诗歌, 哲学, 散文
   - 描述: 深刻、优美或发人深省的书籍摘录。

2. 音乐 (Music)
   - 子分类: 古典, 爵士, 原声, 民谣
   - 描述: 震撼人心的音乐作品。

3. 建筑 (Architecture)
   - 子分类: 博物馆, 住宅, 地标, 宗教
   - 描述: 具有视觉冲击力或历史意义的建筑设计。**注意：博物馆现在属于建筑的一个子分类。**

你的语气应该是博学、优雅且富有启发性的。请用中文回答。
`;

// Helper to fetch music preview from iTunes
const fetchMusicPreview = async (query: string): Promise<string | undefined> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const res = await fetch(`https://itunes.apple.com/search?term=${encodedQuery}&media=music&limit=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].previewUrl;
    }
  } catch (e) {
    console.warn("Failed to fetch music preview", e);
  }
  return undefined;
};

export const generateExhibit = async (category: Category, theme?: Theme, subcategory?: string): Promise<Exhibit | null> => {
  try {
    const promptCategory = category === Category.ALL ? '任意一个类别(书籍、音乐、建筑)' : category;
    
    let subcategoryContext = '';
    if (subcategory) {
      subcategoryContext = `请生成属于“${subcategory}”子分类的藏品。`;
    } else if (category !== Category.ALL) {
       // Ask for a random subcategory from the list if not specified
       const validSubs = SUBCATEGORIES[category].join(', ');
       subcategoryContext = `请从以下子分类中选择一个最合适的: ${validSubs}。`;
    }

    const themeContext = theme && theme.id !== 'default' 
      ? `请特别注意，本次策展的主题是“${theme.name}” (${theme.description})。生成的藏品必须紧扣这一主题。` 
      : '';

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `请生成一个关于“${promptCategory}”的详细藏品介绍。${subcategoryContext} ${themeContext}
      我们需要一个令人震撼的例子。
      
      请严格按照以下 JSON 格式返回数据。确保不要包含 JSON 代码块标记，只返回 JSON 对象。
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "藏品名称，例如书名、曲名、建筑名" },
            description: { type: Type.STRING, description: "一段引人入胜的简短描述（100字以内）" },
            details: { type: Type.STRING, description: "作者、建筑师或相关人物/地点" },
            year: { type: Type.STRING, description: "创作或建造年份" },
            category: { type: Type.STRING, description: "类别，必须是 'literature', 'music', 'architecture' 之一" },
            subcategory: { type: Type.STRING, description: "子分类名称，例如 '博物馆', '小说', '古典' 等" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3个相关的标签，其中必须包含一个与当前主题相关的标签" },
            imagePrompt: { type: Type.STRING, description: "用于生成或搜索图片的简短英文关键词" }
          },
          required: ["title", "description", "details", "category", "subcategory", "tags", "imagePrompt"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    // Convert string category to Enum
    let mappedCategory = Category.LITERATURE;
    if (data.category === 'music') mappedCategory = Category.MUSIC;
    if (data.category === 'architecture') mappedCategory = Category.ARCHITECTURE;
    
    // Fallback if AI hallucinates 'museum' as top level
    if (data.category === 'museum') {
        mappedCategory = Category.ARCHITECTURE;
        data.subcategory = '博物馆';
    }

    // Use picsum with a deterministic seed
    const seed = (data.title + (theme?.id || '')).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const imageUrl = `https://picsum.photos/seed/${seed}/600/800`;

    let audioUrl: string | undefined = undefined;
    if (mappedCategory === Category.MUSIC) {
      // Use title and details (composer) for better search
      audioUrl = await fetchMusicPreview(`${data.title} ${data.details}`);
    }

    return {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      details: data.details,
      year: data.year,
      tags: data.tags,
      category: mappedCategory,
      subcategory: data.subcategory,
      imageUrl: imageUrl,
      audioUrl: audioUrl
    };

  } catch (error) {
    console.error("Failed to generate exhibit:", error);
    return null;
  }
};

export const chatWithCurator = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};