
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import { SensorData } from '../types';
import { mockSensorData } from '../services/mockData';
import { SensorIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR } from '../constants';


const SensorDataPage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const { getLocalizedString } = useLanguage();

  useEffect(() => {
    // In a real app, fetch this data from an API
    setSensorData(mockSensorData);
  }, []);

  const formattedData = sensorData.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <Section title={getLocalizedString('sensorDataTitle')} className="max-w-5xl mx-auto">
      <p className="text-gray-600 mb-6">
        Monitor real-time environmental conditions from your field sensors. This data can help predict disease risk and optimize irrigation.
      </p>
      
      {sensorData.length === 0 ? (
        <div className="text-center py-10">
          <SensorIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No sensor data available at the moment.</p>
          <p className="text-sm text-gray-400">Connect your IoT sensors to see live readings.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {sensorData.length > 0 && ['temperature', 'humidity', 'soilMoisture'].map((key) => {
              const latestReading = sensorData[sensorData.length - 1];
              const value = latestReading[key as keyof SensorData] as number;
              const unit = key === 'temperature' ? '°C' : '%';
              return (
                <div key={key} className={`p-6 rounded-xl shadow-lg bg-gradient-to-br from-[${BRAND_SECONDARY_COLOR}] to-teal-700 text-white`}>
                  <h3 className="text-lg font-medium text-yellow-300 capitalize">{getLocalizedString(key)}</h3>
                  <p className="text-4xl font-bold mt-1">{value.toFixed(1)}{unit}</p>
                  <p className="text-xs text-yellow-100 opacity-80 mt-1">Latest reading</p>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">Sensor Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#4A5568" />
                <YAxis yAxisId="left" stroke={BRAND_SECONDARY_COLOR} />
                <YAxis yAxisId="right" orientation="right" stroke={BRAND_PRIMARY_COLOR} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem', borderColor: BRAND_SECONDARY_COLOR }}
                    itemStyle={{ color: BRAND_SECONDARY_COLOR }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temperature" name={getLocalizedString('temperature')} stroke={BRAND_SECONDARY_COLOR} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" dataKey="humidity" name={getLocalizedString('humidity')} stroke="#38B2AC" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} /> {/* Another shade of teal */}
                <Line yAxisId="right" type="monotone" dataKey="soilMoisture" name={getLocalizedString('soilMoisture')} stroke={BRAND_PRIMARY_COLOR} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table (optional) */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-8 overflow-x-auto">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">Recent Readings</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`bg-[${BRAND_SECONDARY_COLOR}]`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">{getLocalizedString('temperature')} (°C)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">{getLocalizedString('humidity')} (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">{getLocalizedString('soilMoisture')} (%)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sensorData.slice().reverse().map((data, index) => ( // Show latest first
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(data.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.temperature.toFixed(1)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.humidity.toFixed(1)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.soilMoisture.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Section>
  );
};

export default SensorDataPage;
    