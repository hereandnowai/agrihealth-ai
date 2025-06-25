
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageAnalysisPage from './pages/ImageAnalysisPage';
import LiveCameraPage from './pages/LiveCameraPage';
import SensorDataPage from './pages/SensorDataPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import ChatbotPage from './pages/ChatbotPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
// AdminPanelPage import removed
import HomePage from './pages/HomePage';
import { MenuIcon, CloseIcon, LeafIcon, CameraIcon, SensorIcon, KnowledgeIcon, ChatIcon, DashboardIcon, SettingsIcon } from './components/icons'; // Assuming icons are in ./components/icons/
import { BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR } from './constants';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: "/image-analysis", label: "Image Analysis", icon: <LeafIcon className="w-5 h-5" /> },
    { path: "/live-camera", label: "Live Camera", icon: <CameraIcon className="w-5 h-5" /> },
    { path: "/sensor-data", label: "Sensor Data", icon: <SensorIcon className="w-5 h-5" /> },
    { path: "/knowledge-base", label: "Knowledge Base", icon: <KnowledgeIcon className="w-5 h-5" /> },
    { path: "/chatbot", label: "Caramel AI Chat", icon: <ChatIcon className="w-5 h-5" /> },
    { path: "/dashboard", label: "Farmer Dashboard", icon: <DashboardIcon className="w-5 h-5" /> },
    // Admin Panel item removed
  ];

  const activeLinkStyle = {
    backgroundColor: BRAND_PRIMARY_COLOR,
    color: BRAND_SECONDARY_COLOR,
    fontWeight: '600',
  };

  const inactiveLinkStyle = {
    color: '#E0E0E0', // Lighter text for inactive links in dark sidebar
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="flex flex-1 pt-16"> {/* Adjust pt to match header height */}
          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-30 w-64 bg-[${BRAND_SECONDARY_COLOR}] text-white transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex flex-col pt-16 shadow-lg`}
          >
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
              <NavLink
                to="/"
                onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-md hover:bg-yellow-400 hover:text-teal-800 transition-colors"
                style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
              >
                 <DashboardIcon className="w-5 h-5 mr-3" /> Home
              </NavLink>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-md hover:bg-yellow-400 hover:text-teal-800 transition-colors"
                  style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
                >
                  {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/image-analysis" element={<ImageAnalysisPage />} />
              <Route path="/live-camera" element={<LiveCameraPage />} />
              <Route path="/sensor-data" element={<SensorDataPage />} />
              <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/dashboard" element={<FarmerDashboardPage />} />
              {/* Admin Panel Route removed */}
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
