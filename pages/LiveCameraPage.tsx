
import React, { useState, useRef, useCallback } from 'react';
import Section from '../components/Section';
import LoadingSpinner from '../components/LoadingSpinner';
import { AnalysisResult } from '../types';
import { analyzeCropImage } from '../services/geminiService';
import DiseaseResultCard from '../components/image-analysis/DiseaseResultCard';
import { CameraIcon, SparklesIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR } from '../constants';

// IMPORTANT FOR LOCAL NETWORK ACCESS (e.g., from your phone to dev server):
// 1. Your development server must be configured to be accessible on your local network (e.g., host '0.0.0.0').
// 2. To use the camera from a non-localhost origin (like http://<your-ip>:<port>),
//    the page MUST be served over HTTPS. Browsers block camera access on insecure HTTP origins (except localhost).
//    Consider using tools like mkcert to set up local HTTPS for development.

const LiveCameraPage: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { getLocalizedString } = useLanguage();

  const startCamera = async () => {
    try {
      setError(null);
      setAnalysisResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Ensure video plays
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      let specificError = getLocalizedString('errorAccessingCamera');
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          specificError = getLocalizedString('cameraPermissionDenied');
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") { // DevicesNotFoundError is for Firefox
          specificError = getLocalizedString('cameraNotFound');
        }
      }
      setError(specificError);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    streamRef.current = null;
  };

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !isCameraActive) {
      setError("Camera is not active.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError("Failed to get canvas context.");
      setIsLoading(false);
      return;
    }
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    const base64Data = imageDataUrl.split(',')[1];

    try {
      const result = await analyzeCropImage(base64Data);
      setAnalysisResult({ ...result, imageUrl: imageDataUrl });
      if(result.errorMessage){
        setError(result.errorMessage);
      }
    } catch (err) {
      console.error("Error analyzing camera frame:", err);
      const errorMessage = err instanceof Error ? err.message : getLocalizedString('errorOccurred');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isCameraActive, getLocalizedString]);

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []); // Empty dependency array ensures this runs on mount and unmount


  return (
    <Section title={getLocalizedString('liveCameraTitle')} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Camera View and Controls */}
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg shadow">
          <div className="aspect-video bg-black rounded-md overflow-hidden border border-gray-300">
            {isCameraActive ? (
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <CameraIcon className="w-16 h-16 mb-2" />
                <p>Camera feed will appear here.</p>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className={`w-full flex items-center justify-center px-4 py-3 bg-[${BRAND_SECONDARY_COLOR}] text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors`}
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                {getLocalizedString('startCamera')}
              </button>
            ) : (
              <>
                <button
                  onClick={stopCamera}
                  className="w-full sm:w-1/2 flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  {getLocalizedString('stopCamera')}
                </button>
                <button
                  onClick={captureAndAnalyze}
                  disabled={isLoading}
                  className={`w-full sm:w-1/2 flex items-center justify-center px-4 py-3 bg-[${BRAND_PRIMARY_COLOR}] text-[${BRAND_SECONDARY_COLOR}] rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50`}
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  {isLoading ? getLocalizedString('analysing') : getLocalizedString('captureFrame')}
                </button>
              </>
            )}
          </div>
           {/* Display general errors related to analysis or other issues not related to initial camera start */}
          {error && !isCameraActive && ( // Show error here only if it's not a camera start error (already shown above)
             <div className="mt-2 p-3 bg-red-100 text-red-700 border border-red-200 rounded-lg text-sm">
                {error}
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
          {/* Display analysis-specific errors or other errors if camera is active */}
          {error && isCameraActive && ( 
            <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
              <p><strong>{getLocalizedString('errorOccurred')}:</strong> {error}</p>
            </div>
          )}
          {analysisResult && !isLoading && (
            <DiseaseResultCard result={analysisResult} />
          )}
          {!isLoading && !analysisResult && !error && !isCameraActive && ( // Initial state before camera started or if stopped
             <div className="p-6 bg-gray-50 rounded-lg shadow text-center text-gray-500">
                <p>Start the camera to capture and analyze live video frames for disease detection.</p>
             </div>
          )}
           {!isLoading && !analysisResult && isCameraActive && !error && ( // Camera active, but no analysis yet / no error
             <div className="p-6 bg-gray-50 rounded-lg shadow text-center text-gray-500">
                <p>Camera is active. Position the plant in view and click "Capture & Analyze Frame".</p>
             </div>
          )}
        </div>
      </div>
    </Section>
  );
};

// The component is default exported, which should be recognized by the module system if the file is correctly parsed.
export default LiveCameraPage;
