
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import { AnalysisResult } from '../types';
import { mockAnalysisHistory } from '../services/mockData';
import { DashboardIcon, LeafIcon, SparklesIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => {
  let toColorClassPart: string;

  if (color.startsWith('#')) {
    // For hex colors, we need a predefined Tailwind shade or another hex.
    // Assuming BRAND_SECONDARY_COLOR (#004040) is a dark teal.
    // Let's use 'teal-700' as a slightly different shade for the gradient end.
    if (color === BRAND_SECONDARY_COLOR) {
      toColorClassPart = 'teal-700'; 
    } else {
      // For other arbitrary hex colors, pick a generic darker shade or a fixed one.
      toColorClassPart = 'neutral-700'; // Or another suitable dark color
    }
  } else {
    // For Tailwind named colors like 'green-600', derive 'green-700'
    const colorBase = color.split('-')[0];
    toColorClassPart = `${colorBase}-700`;
  }

  return (
    <div className={`p-6 rounded-xl shadow-lg bg-gradient-to-br from-[${color}] to-${toColorClassPart} text-white`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-yellow-200">{title}</h3>
        <div className={`p-2 bg-black bg-opacity-20 rounded-full`}>{icon}</div>
      </div>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
};


const FarmerDashboardPage: React.FC = () => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const { getLocalizedString } = useLanguage();

  useEffect(() => {
    // In a real app, fetch this data for the logged-in farmer
    setAnalysisHistory(mockAnalysisHistory);
  }, []);

  const totalAnalyses = analysisHistory.length;
  const healthyCount = analysisHistory.filter(r => r.isHealthy || r.diseaseName?.toLowerCase() === 'healthy').length;
  const diseasedCount = totalAnalyses - healthyCount;

  const diseaseDistribution = analysisHistory
    .filter(r => !r.isHealthy && r.diseaseName)
    .reduce((acc, curr) => {
      acc[curr.diseaseName!] = (acc[curr.diseaseName!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(diseaseDistribution).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D']; // Colors for Pie Chart

  const barData = analysisHistory.map((item, index) => ({
    name: `Analysis ${index + 1}`,
    confidence: item.confidenceLevel ? item.confidenceLevel * 100 : 0,
    isHealthy: item.isHealthy ? 1 : 0, // 1 for healthy, 0 for diseased for stacking/coloring
  }));


  return (
    <div className="space-y-8">
      <Section title={getLocalizedString('farmerDashboardTitle')} className="!pb-0">
        <p className="text-gray-600 mb-6">
          View your crop health summary, analysis history, and trends to make informed decisions for your farm.
        </p>
      </Section>

      {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Analyses" value={totalAnalyses} icon={<SparklesIcon className="w-6 h-6 text-yellow-300"/>} color={BRAND_SECONDARY_COLOR} />
          <StatCard title="Healthy Detections" value={healthyCount} icon={<LeafIcon className="w-6 h-6 text-green-300"/>} color="green-600" />
          <StatCard title="Disease Detections" value={diseasedCount} icon={<LeafIcon className="w-6 h-6 text-red-300"/>} color="red-600" />
        </div>


      {analysisHistory.length === 0 ? (
        <Section>
          <div className="text-center py-10">
            <DashboardIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No analysis history available.</p>
            <p className="text-sm text-gray-400">Perform some crop image analyses to see your dashboard populate.</p>
          </div>
        </Section>
      ) : (
        <>
          {/* Charts Section */}
          <Section title="Visual Trends">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-teal-700 mb-3">Disease Distribution (Diseased Plants)</h3>
                {diseasedCount > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fill="#8884d8">
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center py-10">No diseased plants recorded for distribution chart.</p>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-teal-700 mb-3">Analysis Confidence Levels</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="confidence" name="Confidence Level" >
                             {barData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.isHealthy ? '#22c55e' /* green-500 */ : '#ef4444' /* red-500 */} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Section>

          {/* Analysis History Table */}
          <Section title={getLocalizedString('analysisHistory')}>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`bg-[${BRAND_SECONDARY_COLOR}]`}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Disease</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider hidden md:table-cell">Treatment Snippet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analysisHistory.map((result, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.imageUrl && <img src={result.imageUrl} alt="Analyzed crop" className="w-12 h-12 object-cover rounded-md"/>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{result.diseaseName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.confidenceLevel !== null && result.confidenceLevel !== undefined ? `${(result.confidenceLevel * 100).toFixed(0)}%` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell max-w-xs truncate">
                        {result.treatmentGuide ? `${result.treatmentGuide.substring(0, 50)}...` : (result.isHealthy ? 'No treatment needed' : 'N/A')}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            result.isHealthy || result.diseaseName?.toLowerCase() === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.isHealthy || result.diseaseName?.toLowerCase() === 'healthy' ? getLocalizedString('healthy') : 'Disease Detected'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Future: Add downloadable reports button */}
          </Section>
        </>
      )}
    </div>
  );
};

export default FarmerDashboardPage;
