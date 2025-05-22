import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MainContent from "../components/MainContent";

const Home = () => {
  const [selectedView, setSelectedView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
   
      <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-0 -ml-56' : 'w-56'}`}>
        <Sidebar onSelect={setSelectedView} selectedView={selectedView} />
      </div>
      
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <MainContent view={selectedView} />
      </div>
      
      
      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-2 left-2 z-40 p-1 rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}

    
      {!sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-2 z-40 p-1 rounded-full bg-gray-600 bg-opacity-50 text-white shadow-md hover:bg-opacity-70 focus:outline-none"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Home;