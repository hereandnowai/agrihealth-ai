
import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR, ORGANISATION_LOGO_URL } from '../constants';
import { LeafIcon, CameraIcon, SensorIcon, KnowledgeIcon, ChatIcon } from '../components/icons';

const HomePage: React.FC = () => {
  const { getLocalizedString } = useLanguage();

  const features = [
    { name: "Image Analysis", icon: <LeafIcon className="w-8 h-8"/>, link: "/image-analysis", description: "Upload or capture crop images for AI-powered disease detection." },
    { name: "Live Camera Monitoring", icon: <CameraIcon className="w-8 h-8"/>, link: "/live-camera", description: "Connect cameras for real-time field monitoring and alerts." },
    { name: "Sensor Data Insights", icon: <SensorIcon className="w-8 h-8"/>, link: "/sensor-data", description: "Track environmental data to predict disease risks." },
    { name: "Disease Knowledge Base", icon: <KnowledgeIcon className="w-8 h-8"/>, link: "/knowledge-base", description: "Explore a comprehensive database of plant diseases." },
    { name: "Caramel AI Chat", icon: <ChatIcon className="w-8 h-8"/>, link: "/chatbot", description: "Get expert advice from our agricultural AI assistant." },
  ];

  return (
    <div className="space-y-8">
      <Section className={`bg-gradient-to-br from-[${BRAND_SECONDARY_COLOR}] to-teal-700 text-white rounded-xl shadow-2xl`}>
        <div className="flex flex-col md:flex-row items-center justify-between p-6">
          <div className="md:w-2/3 mb-6 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-yellow-300">{getLocalizedString('homeTitle')}</h1>
            <p className="text-lg lg:text-xl mb-6 text-yellow-100 opacity-90">
              {getLocalizedString('homeSubtitle')}
            </p>
            <Link
              to="/image-analysis"
              className={`inline-block bg-[${BRAND_PRIMARY_COLOR}] text-[${BRAND_SECONDARY_COLOR}] font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-300 hover:text-teal-800 transition-transform transform hover:scale-105`}
            >
              {getLocalizedString('homeCTA')}
            </Link>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <img src={ORGANISATION_LOGO_URL} alt="AgriHealth AI Illustration" className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-full bg-white p-2 shadow-lg" />
          </div>
        </div>
      </Section>

      <Section title="Key Features" titleClassName="text-3xl text-center !border-b-4 !border-yellow-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {features.map((feature) => (
            <Link key={feature.name} to={feature.link} className={`block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[${BRAND_SECONDARY_COLOR}] hover:border-yellow-500`}>
              <div className={`flex items-center text-[${BRAND_SECONDARY_COLOR}] mb-3`}>
                {React.cloneElement(feature.icon, { className: `w-10 h-10 mr-4 text-[${BRAND_SECONDARY_COLOR}]` })}
                <h3 className="text-xl font-semibold ">{feature.name}</h3>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Our Mission">
        <p className="text-gray-700 leading-relaxed">
          At AgriHealth AI, part of {`${"HERE AND NOW AI - Artificial Intelligence Research Institute"}`}, our mission is to empower farmers, agronomists, and researchers with advanced AI tools for sustainable and productive agriculture. We believe in leveraging technology to address critical challenges in food production, starting with early and accurate plant disease detection.
        </p>
      </Section>
    </div>
  );
};

export default HomePage;
    