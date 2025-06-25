
import { Chat } from "@google/genai";

export enum Language {
  EN = 'en',
  HI = 'hi',
  TA = 'ta',
  FR = 'fr', // Added French
}

export interface LocalizedStrings {
  tagline: string;
  imageAnalysisTitle: string;
  uploadImagePrompt: string;
  captureImagePrompt: string;
  analysing: string;
  analysisResults: string;
  diseaseName: string;
  confidenceLevel: string;
  treatmentGuide: string;
  noDiseaseDetected: string;
  errorOccurred: string;
  homeTitle: string;
  homeSubtitle: string;
  homeCTA: string;
  liveCameraTitle: string;
  startCamera: string;
  stopCamera: string;
  captureFrame: string;
  sensorDataTitle: string;
  temperature: string;
  humidity: string;
  soilMoisture: string;
  knowledgeBaseTitle: string;
  searchDisease: string;
  symptoms: string;
  causes: string;
  organicTreatment: string;
  chemicalTreatment: string;
  preventiveMeasures: string;
  chatbotTitle: string;
  chatbotWelcome: string;
  typeYourMessage: string;
  farmerDashboardTitle: string;
  analysisHistory: string;
  // Admin panel keys removed
  footerTagline: string;
  viewDetails: string;
  healthy: string;
  imageTooLarge: string;
  fileNotAnImage: string;
  errorAccessingCamera: string;
  cameraPermissionDenied: string; // New key
  cameraNotFound: string; // New key
  scientificName: string; // Was missing, needed by KnowledgeBasePage
  source: string;
  sources: string;
  groundingSources: string;
  googleSearchActive: string;
  toggleGoogleSearch: string;
  // Add more strings as needed
  [key: string]: string; 
}

export interface DiseaseInfo {
  id: string;
  name: string;
  scientificName: string;
  symptoms: string[];
  causes: string[];
  treatment: {
    organic: string[];
    chemical: string[];
    preventive: string[];
  };
  imageUrl?: string; // Example image of the disease
}

export interface SensorData {
  timestamp: Date;
  temperature: number; // Celsius
  humidity: number; // Percentage
  soilMoisture: number; // Percentage
}

export interface AnalysisResult {
  diseaseName: string | null;
  confidenceLevel: number | null; // 0 to 1
  treatmentGuide: string | null;
  isHealthy?: boolean;
  imageUrl?: string; // The image that was analyzed
  errorMessage?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  avatar?: string;
}

export interface GeminiChat extends Chat {}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}
