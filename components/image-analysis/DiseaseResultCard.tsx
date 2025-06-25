
import React from 'react';
import { AnalysisResult } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR } from '../../constants';
import { LeafIcon, SparklesIcon } from '../icons';

interface DiseaseResultCardProps {
  result: AnalysisResult;
}

const DiseaseResultCard: React.FC<DiseaseResultCardProps> = ({ result }) => {
  const { getLocalizedString } = useLanguage();

  if (result.errorMessage && !result.diseaseName) { // Primarily show error if analysis completely failed
    return (
      <div className={`p-6 bg-red-50 border border-red-300 rounded-lg shadow-md`}>
        <h3 className="text-xl font-semibold text-red-700 mb-2">{getLocalizedString('errorOccurred')}</h3>
        <p className="text-red-600">{result.errorMessage}</p>
      </div>
    );
  }
  
  const isActuallyHealthy = result.isHealthy || (result.diseaseName?.toLowerCase() === 'healthy' && (result.confidenceLevel || 0) > 0.8);


  return (
    <div className={`p-6 rounded-lg shadow-xl border-l-4 ${isActuallyHealthy ? 'border-green-500 bg-green-50' : `border-[${BRAND_PRIMARY_COLOR}] bg-yellow-50`}`}>
      <div className="flex items-center mb-4">
        <SparklesIcon className={`w-8 h-8 mr-3 ${isActuallyHealthy ? 'text-green-600' : `text-[${BRAND_SECONDARY_COLOR}]`}`} />
        <h3 className="text-2xl font-semibold text-teal-800">{getLocalizedString('analysisResults')}</h3>
      </div>

      {result.imageUrl && (
        <div className="mb-4">
          <img src={result.imageUrl} alt="Analyzed crop" className="max-w-full h-auto max-h-60 rounded-md object-contain border border-gray-300 mx-auto" />
        </div>
      )}
      
      {result.errorMessage && ( // Show non-fatal errors or warnings from API
         <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md mb-3">{`Note: ${result.errorMessage}`}</p>
      )}

      <div className="space-y-3">
        <div>
          <span className="font-semibold text-teal-700">{getLocalizedString('diseaseName')}:</span>
          <span className={`ml-2 font-medium ${isActuallyHealthy ? 'text-green-700' : `text-[${BRAND_SECONDARY_COLOR}]`}`}>
            {result.diseaseName || getLocalizedString('noDiseaseDetected')}
          </span>
        </div>
        
        {result.confidenceLevel !== null && result.confidenceLevel !== undefined && (
          <div>
            <span className="font-semibold text-teal-700">{getLocalizedString('confidenceLevel')}:</span>
            <span className={`ml-2 font-medium ${isActuallyHealthy ? 'text-green-700' : `text-[${BRAND_SECONDARY_COLOR}]`}`}>
              {(result.confidenceLevel * 100).toFixed(1)}%
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className={`h-2.5 rounded-full ${isActuallyHealthy ? 'bg-green-500' : `bg-[${BRAND_PRIMARY_COLOR}]`}`}
                style={{ width: `${result.confidenceLevel * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {!isActuallyHealthy && result.treatmentGuide && (
          <div>
            <h4 className="font-semibold text-teal-700 mt-3 mb-1">{getLocalizedString('treatmentGuide')}:</h4>
            <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md whitespace-pre-wrap">{result.treatmentGuide}</p>
          </div>
        )}

        {isActuallyHealthy && (
             <p className="text-green-700 font-medium mt-3 bg-green-100 p-3 rounded-md">
                <LeafIcon className="w-5 h-5 inline mr-2" />
                {getLocalizedString('noDiseaseDetected')}
            </p>
        )}
      </div>
    </div>
  );
};

export default DiseaseResultCard;
    