"use client";

import { useState } from "react";
import { Bell, Menu, MoreHorizontal } from "lucide-react";
import Link from "next/link";

function ToolsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleConnect = async (platformName) => {
    if (platformName === 'Gmail') {
      try {
        console.log('Starting Gmail scraper...');
        const result = await window.electron.ipcRenderer.invoke('start-scraper', {
          company: 'Google',
          name: 'gmail',
          id: 'gmail-' + Date.now(),
          platformId: 'gmail',
          filename: 'gmail',
        });
        console.log('Scraper result:', result);
        // Handle the result as needed (e.g., show a success message)
      } catch (error) {
        console.error('Error starting scraper:', error);
        // Handle the error (e.g., show an error message)
      }it 
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-md transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {isSidebarOpen && <h1 className="text-2xl font-bold">OTTO</h1>}
            <button onClick={toggleSidebar}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
          {isSidebarOpen && (
            <>
              <nav className="space-y-4">
                <Link href="/workstreams">
                  <SidebarItem icon={WorkstreamsIcon} label="Workstreams" />
                </Link>

                <Link href="/knowledge">
                  <SidebarItem icon={KnowledgeIcon} label="Knowledge" />
                </Link>

                <Link href="/people">
                  <SidebarItem icon={PeopleIcon} label="People" />
                </Link>

                <Link href="/tools">
                  <SidebarItem icon={ToolsIcon} label="Tools" />
                </Link>

                <Link href="/library">
                  <SidebarItem icon={LibraryIcon} label="Library" />
                </Link>
              </nav>
            </>
          )}
        </div>

        <div className="mt-auto p-4">
          <div
            className={`flex items-center bg-gray-800 text-white rounded-full p-2 ${
              isSidebarOpen ? "" : "justify-center"
            }`}
          >
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            {isSidebarOpen && (
              <>
                <div className="ml-2 flex-grow overflow-hidden">
                  <p className="font-semibold truncate">Harvin Park</p>
                  <p className="text-xs text-gray-400 truncate">harv@cmu.edu</p>
                </div>
                <MoreHorizontal className="w-5 h-5 flex-shrink-0" />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Integrations</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                6
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm">
          <IntegrationItem
            icon="/gmail-icon.png"
            name="Gmail"
            description="Enable the reading and sending of emails"
            onConnect={() => handleConnect('Gmail')}
          />
          <IntegrationItem
            icon="/gcalendar-icon.png"
            name="Google Calendar"
            description="Enable the reading and creating of calendar invites"
          />
          <IntegrationItem
            icon="/linkedin-icon.png"
            name="LinkedIn"
            description="Enable communication and search on LinkedIn"
          />
          <IntegrationItem
            icon="/github-icon.png"
            name="GitHub"
            description="Enable codebase understanding and updates to pull requests"
          />
          <IntegrationItem
            icon="/notion-icon.png"
            name="Notion"
            description="Make productive blah blah blah"
          />
          <IntegrationItem
            icon="/twitter-icon.png"
            name="Twitter"
            description="Twitter blah blah blah maybe X"
          />
          <IntegrationItem
            icon="/hubspot-icon.png"
            name="HubSpot"
            description="HubSpot blah blah"
          />
          <IntegrationItem
            icon="/salesforce-icon.png"
            name="Salesforce"
            description="Salesforce blah blah blah"
          />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center">
      <Icon className="w-5 h-5 mr-2" />
      <span>{label}</span>
    </div>
  );
}

function IntegrationItem({ icon, name, description, onConnect }) {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center space-x-4">
        <img src={icon} alt={`${name} icon`} className="w-8 h-8" />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${
            isConnected ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"
          }`}
          onClick={() => setIsConnected(!isConnected)}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
        <span className={`text-sm ${isConnected ? "text-green-600" : "text-gray-400"}`}>
          {isConnected ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}

function WorkstreamsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

function KnowledgeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function PeopleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ToolsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function LibraryIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}

export default ToolsPage;
