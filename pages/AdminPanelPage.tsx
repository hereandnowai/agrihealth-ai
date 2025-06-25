
import React from 'react';
import Section from '../components/Section';
import { SettingsIcon, KnowledgeIcon, ChatIcon, DashboardIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_SECONDARY_COLOR } from '../constants';

const AdminPanelPage: React.FC = () => {
  const { getLocalizedString } = useLanguage();

  const adminSections = [
    { title: getLocalizedString('adminManageData'), description: "Upload, edit, and manage disease information in the knowledge base.", icon: <KnowledgeIcon className="w-8 h-8"/> },
    { title: getLocalizedString('adminUserInsights'), description: "View analytics on user activity, popular features, and common queries.", icon: <DashboardIcon className="w-8 h-8"/> },
    { title: getLocalizedString('adminChatbotTraining'), description: "Review chatbot conversations, identify areas for improvement, and manage training data.", icon: <ChatIcon className="w-8 h-8"/> },
    { title: "System Configuration", description: "Manage application settings, API integrations, and other system parameters.", icon: <SettingsIcon className="w-8 h-8"/> },
  ];

  return (
    <Section title={getLocalizedString('adminPanelTitle')} className="max-w-4xl mx-auto">
      <p className="text-gray-600 mb-8">
        This is the central hub for managing AgriHealth AI. Access various administrative functions below.
        (Note: This is a placeholder UI. Full admin functionality would require backend integration.)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((item, index) => (
          <div key={index} className={`p-6 bg-white rounded-lg shadow-lg border-l-4 border-[${BRAND_SECONDARY_COLOR}]`}>
            <div className={`flex items-center text-[${BRAND_SECONDARY_COLOR}] mb-3`}>
              {React.cloneElement(item.icon, { className: `w-8 h-8 mr-3 text-[${BRAND_SECONDARY_COLOR}]` })}
              <h3 className="text-xl font-semibold">{item.title}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            <button 
              className={`px-4 py-2 bg-[${BRAND_SECONDARY_COLOR}] text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50`}
              disabled // Placeholder button
            >
              Access Section (Coming Soon)
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-sm text-yellow-700">
          <strong>Admin Note:</strong> Full implementation of these features requires robust backend services and authentication.
          This panel currently serves as a visual representation of administrative capabilities.
        </p>
      </div>
    </Section>
  );
};

export default AdminPanelPage;
    