import React, { useState, useCallback, useRef } from 'react';
import Section from '../components/Section';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeCropImage } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { UploadIcon, CameraIcon, SparklesIcon, LeafIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR } from '../constants';
import DiseaseResultCard from '../components/image-analysis/DiseaseResultCard';

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ImageAnalysisPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getLocalizedString } = useLanguage();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(getLocalizedString('imageTooLarge', `Image is too large. Max ${MAX_FILE_SIZE_MB}MB.`));
        setSelectedImage(null);
        setAnalysisResult(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError(getLocalizedString('fileNotAnImage', 'Selected file is not an image.'));
        setSelectedImage(null);
        setAnalysisResult(null);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = useCallback(async (imageData: string, source: 'upload' | 'camera') => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const base64Data = imageData.split(',')[1]; // Remove "data:image/...;base64," prefix
      const result = await analyzeCropImage(base64Data);
      setAnalysisResult({ ...result, imageUrl: imageData }); // Add original image to result for display
       if(result.errorMessage){
        setError(result.errorMessage)
      }
    } catch (err) {
      console.error("Error in processImage:", err);
      const errorMessage = err instanceof Error ? err.message : getLocalizedString('errorOccurred');
      setError(errorMessage);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [getLocalizedString]);

  const handleAnalyzeClick = () => {
    if (selectedImage) {
      processImage(selectedImage, 'upload');
    } else {
      setError("Please select an image first.");
    }
  };
  
  // Placeholder for camera capture functionality if expanding from LiveCameraPage
  // For now, focusing on upload within this page.

  return (
    <Section title={getLocalizedString('imageAnalysisTitle')} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Image Upload Area */}
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-teal-700 mb-3">{getLocalizedString('uploadImagePrompt')}</h3>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-[${BRAND_SECONDARY_COLOR}] rounded-lg text-[${BRAND_SECONDARY_COLOR}] hover:bg-teal-50 transition-colors`}
          >
            <UploadIcon className="w-6 h-6 mr-2" />
            {getLocalizedString('uploadImagePrompt')}
          </button>
          
          {selectedImage && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600">Preview:</p>
              <img src={selectedImage} alt="Selected crop" className="max-w-full h-auto max-h-64 rounded-md object-contain border border-gray-300" />
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading}
                className={`w-full flex items-center justify-center px-4 py-3 bg-[${BRAND_SECONDARY_COLOR}] text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50`}
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isLoading ? getLocalizedString('analysing') : 'Analyze Image'}
              </button>
            </div>
          )}
        </div>

        {/* Analysis Result Area */}
        <div className="space-y-4">
          {isLoading && (
            <div className="flex justify-center items-center h-full p-6">
              <LoadingSpinner text={getLocalizedString('analysing')} size="lg" />
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
              <p><strong>{getLocalizedString('errorOccurred')}:</strong> {error}</p>
            </div>
          )}
          {analysisResult && !isLoading && (
             <DiseaseResultCard result={analysisResult} />
          )}
          {!isLoading && !analysisResult && !error && !selectedImage && (
            <div className="p-6 bg-gray-50 rounded-lg shadow text-center text-gray-500">
              <LeafIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Upload an image of a crop or leaf to begin analysis.</p>
              <p className="text-sm mt-1">The AI will identify potential diseases and provide guidance.</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default ImageAnalysisPage;