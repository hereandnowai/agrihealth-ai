
import { DiseaseInfo, SensorData, AnalysisResult } from '../types';

export const mockDiseases: DiseaseInfo[] = [
  {
    id: '1',
    name: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    symptoms: ['Dark lesions on leaves and stems', 'White mold on undersides of leaves', 'Tubers rot'],
    causes: ['High humidity', 'Cool temperatures', 'Infected plant debris'],
    treatment: {
      organic: ['Copper-based fungicides', 'Remove infected plants promptly'],
      chemical: ['Mancozeb', 'Chlorothalonil'],
      preventive: ['Crop rotation', 'Use resistant varieties', 'Ensure good air circulation'],
    },
    imageUrl: 'https://picsum.photos/seed/lateblight/400/300',
  },
  {
    id: '2',
    name: 'Powdery Mildew',
    scientificName: 'Erysiphe cichoracearum',
    symptoms: ['White powdery spots on leaves and stems', 'Distorted shoot growth'],
    causes: ['High humidity at night, dry days', 'Poor air circulation'],
    treatment: {
      organic: ['Neem oil', 'Potassium bicarbonate spray', 'Milk spray (diluted)'],
      chemical: ['Sulfur-based fungicides', 'Myclobutanil'],
      preventive: ['Prune for air circulation', 'Avoid over-fertilizing with nitrogen', 'Plant in sunny locations'],
    },
    imageUrl: 'https://picsum.photos/seed/powderymildew/400/300',
  },
  {
    id: '3',
    name: 'Tomato Mosaic Virus',
    scientificName: 'Tobamovirus TMV',
    symptoms: ['Mottled light and dark green patterns on leaves', 'Stunted growth', 'Leaf curling'],
    causes: ['Mechanical transmission (hands, tools)', 'Infected seeds'],
    treatment: {
      organic: ['No cure, remove and destroy infected plants'],
      chemical: ['No chemical cure'],
      preventive: ['Use certified virus-free seeds', 'Disinfect tools regularly', 'Control aphid populations (vectors)'],
    },
    imageUrl: 'https://picsum.photos/seed/tomatovirus/400/300',
  },
];

export const mockSensorData: SensorData[] = [
  { timestamp: new Date(Date.now() - 3600000 * 3), temperature: 22, humidity: 65, soilMoisture: 55 },
  { timestamp: new Date(Date.now() - 3600000 * 2), temperature: 23, humidity: 68, soilMoisture: 52 },
  { timestamp: new Date(Date.now() - 3600000 * 1), temperature: 24, humidity: 70, soilMoisture: 50 },
  { timestamp: new Date(), temperature: 25, humidity: 72, soilMoisture: 48 },
];

export const mockAnalysisHistory: AnalysisResult[] = [
  { 
    diseaseName: 'Late Blight', 
    confidenceLevel: 0.88, 
    treatmentGuide: 'Apply copper fungicide. Improve air circulation.', 
    imageUrl: 'https://picsum.photos/seed/history1/100/100',
    isHealthy: false,
  },
  { 
    diseaseName: 'Healthy', 
    confidenceLevel: 0.95, 
    treatmentGuide: 'Plant is healthy. Monitor regularly.', 
    imageUrl: 'https://picsum.photos/seed/history2/100/100',
    isHealthy: true,
  },
  { 
    diseaseName: 'Powdery Mildew', 
    confidenceLevel: 0.75, 
    treatmentGuide: 'Use neem oil. Prune affected leaves.', 
    imageUrl: 'https://picsum.photos/seed/history3/100/100',
    isHealthy: false,
  },
];
    