import React, { useState, useEffect, useMemo } from 'react';
import Section from '../components/Section';
import Modal from '../components/Modal';
import { DiseaseInfo, LocalizedStrings } from '../types';
import { mockDiseases } from '../services/mockData';
import { KnowledgeIcon, SearchIcon, LeafIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_SECONDARY_COLOR, BRAND_PRIMARY_COLOR } from '../constants';

const DiseaseDetailCard: React.FC<{ disease: DiseaseInfo }> = ({ disease }) => {
  const { getLocalizedString } = useLanguage();
  
  const renderList = (titleKey: keyof LocalizedStrings, items: string[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div>
        <h4 className="font-semibold text-md text-teal-600 mt-3 mb-1">{getLocalizedString(titleKey)}:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {disease.imageUrl && (
        <img 
          src={disease.imageUrl} 
          alt={disease.name} 
          className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-200"
        />
      )}
      <p><strong className="text-teal-700">{getLocalizedString('scientificName')}:</strong> <em className="text-gray-600">{disease.scientificName}</em></p>
      
      {renderList('symptoms', disease.symptoms)}
      {renderList('causes', disease.causes)}
      
      <div>
        <h4 className="font-bold text-lg text-teal-700 mt-4 mb-2 border-b pb-1 border-yellow-400">{getLocalizedString('treatmentGuide')}</h4>
        {renderList('organicTreatment', disease.treatment.organic)}
        {renderList('chemicalTreatment', disease.treatment.chemical)}
        {renderList('preventiveMeasures', disease.treatment.preventive)}
      </div>
    </div>
  );
};


const KnowledgeBasePage: React.FC = () => {
  const [diseases, setDiseases] = useState<DiseaseInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);
  const { getLocalizedString } = useLanguage();

  useEffect(() => {
    // In a real app, fetch this data from an API
    setDiseases(mockDiseases);
  }, []);

  const filteredDiseases = useMemo(() => {
    if (!searchTerm) return diseases;
    return diseases.filter(disease =>
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [diseases, searchTerm]);

  return (
    <Section title={getLocalizedString('knowledgeBaseTitle')} className="max-w-5xl mx-auto">
      <p className="text-gray-600 mb-6">
        Browse and search for information about various plant diseases, their symptoms, causes, and treatment options.
      </p>
      
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder={getLocalizedString('searchDisease')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[${BRAND_PRIMARY_COLOR}] focus:border-[${BRAND_PRIMARY_COLOR}] transition-shadow`}
        />
        <SearchIcon className={`w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2`} />
      </div>

      {filteredDiseases.length === 0 ? (
        <div className="text-center py-10">
          <LeafIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No diseases found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map(disease => (
            <div 
              key={disease.id} 
              className={`p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-[${BRAND_SECONDARY_COLOR}] cursor-pointer`}
              onClick={() => setSelectedDisease(disease)}
            >
              {disease.imageUrl && (
                 <img src={disease.imageUrl} alt={disease.name} className="w-full h-40 object-cover rounded-md mb-3" />
              )}
              <h3 className={`text-xl font-semibold text-[${BRAND_SECONDARY_COLOR}] mb-1`}>{disease.name}</h3>
              <p className="text-xs text-gray-500 italic mb-2">{disease.scientificName}</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {disease.symptoms.join(', ')}
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedDisease(disease); }}
                className={`mt-4 text-sm text-[${BRAND_PRIMARY_COLOR}] font-semibold hover:underline`}
              >
                {getLocalizedString('viewDetails')} &rarr;
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDisease && (
        <Modal 
          isOpen={!!selectedDisease} 
          onClose={() => setSelectedDisease(null)}
          title={selectedDisease.name}
          size="lg"
        >
          <DiseaseDetailCard disease={selectedDisease} />
        </Modal>
      )}
    </Section>
  );
};

export default KnowledgeBasePage;