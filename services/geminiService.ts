import { GoogleGenAI, GenerateContentResponse, Chat, Part } from '@google/genai';
import { AnalysisResult, GroundingChunk } from '../types'; 
import { GEMINI_TEXT_MODEL } from '../constants';


const MODEL_NAME = GEMINI_TEXT_MODEL; 

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY for Gemini is not set in environment variables. AgriHealth AI features requiring AI will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey! }); 

export const analyzeCropImage = async (base64Image: string, customPrompt?: string): Promise<AnalysisResult> => {
  if (!apiKey) return { diseaseName: null, confidenceLevel: null, treatmentGuide: "API Key not configured.", errorMessage: "API Key not configured." };
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg', 
      data: base64Image,
    },
  };

  const defaultPrompt = `Analyze this image of a plant. Identify any visible diseases. 
  Provide the disease name, a confidence level (0.0 to 1.0), and a brief treatment guide. 
  If the plant appears healthy, state "Healthy" as the disease name with confidence 1.0 and no treatment guide.
  Return the response as a JSON object with keys: "diseaseName", "confidenceLevel", "treatmentGuide", "isHealthy" (boolean). Example: {"diseaseName": "Powdery Mildew", "confidenceLevel": 0.85, "treatmentGuide": "Use fungicides and improve air circulation.", "isHealthy": false }`;
  
  const textPart = { text: customPrompt || defaultPrompt };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME, 
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json", 
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsed = JSON.parse(jsonStr) as Partial<AnalysisResult>;
    return {
        diseaseName: parsed.diseaseName || "Unknown",
        confidenceLevel: typeof parsed.confidenceLevel === 'number' ? parsed.confidenceLevel : null,
        treatmentGuide: parsed.treatmentGuide || (parsed.isHealthy ? "No treatment needed." : "No specific treatment guide available."),
        isHealthy: parsed.isHealthy || false,
    };

  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during image analysis.";
    return { 
        diseaseName: null, 
        confidenceLevel: null, 
        treatmentGuide: null, 
        errorMessage: `Failed to analyze image: ${errorMessage}` 
    };
  }
};


export const startChatSession = (systemInstruction?: string): Chat => {
  if (!apiKey) {
    console.error("Attempted to start chat session without API Key.");
    // This will lead to an error if ai is not initialized or apiKey is truly missing and not handled by GoogleGenAI constructor
  }
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: systemInstruction || "You are a helpful assistant.",
    },
  });
};

export const sendMessageToChat = async (chat: Chat, message: string, useGoogleSearch: boolean = false): Promise<{text: string, groundingChunks?: GroundingChunk[]}> => {
  if (!apiKey) return { text: "API Key not configured." };
  try {
    const chatParams: { message: string; tools?: { googleSearch: {} }[] } = {
      message: message,
    };

    if (useGoogleSearch) {
      chatParams.tools = [{ googleSearch: {} }];
    }

    const response: GenerateContentResponse = await chat.sendMessage(chatParams);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    return { text: response.text, groundingChunks };
  } catch (error) {
    console.error("Error sending message to Gemini Chat:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { text: `Error: ${errorMessage}` };
  }
};

export const sendMessageToChatStream = async (chat: Chat, message: string, useGoogleSearch: boolean = false): Promise<AsyncIterableIterator<GenerateContentResponse>> => {
    if (!apiKey) {
        async function* dummyStream() {
            yield {
                text: "API Key not configured.",
                candidates: [],
                usageMetadata: { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 },
            } as unknown as GenerateContentResponse; 
            return;
        }
        return dummyStream();
    }

    const chatStreamParams: { message: string; tools?: { googleSearch: {} }[] } = {
      message: message,
    };

    if (useGoogleSearch) {
      chatStreamParams.tools = [{ googleSearch: {} }];
    }
    
    return chat.sendMessageStream(chatStreamParams); 
};