"use client";

import { Bell, Menu, MoreHorizontal, PenSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function OttoDashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value); // Update state with input value
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }), // Send input text as JSON
      });
      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error:", error);
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
              <button className="w-full py-2 mb-6 bg-gray-200 text-gray-700 rounded-md">
                Start a new chat
              </button>
              <nav className="space-y-4">
                <Link href="/workstreams">
                  <SidebarItem
                    icon={WorkstreamsIcon}
                    label="Workstreams"
                    count={4}
                  />
                </Link>

                <Link href="/workstreams">
                  <SidebarItem
                    icon={KnowledgeIcon}
                    label="Knowledge"
                    count={2}
                  />
                </Link>

                <Link href="/workstreams">
                  <SidebarItem icon={PeopleIcon} label="People" />
                </Link>

                <Link href="/workstreams">
                  <SidebarItem icon={ToolsIcon} label="Tools" />
                </Link>

                <Link href="/workstreams">
                  <SidebarItem icon={LibraryIcon} label="Library" />
                </Link>
              </nav>
              <div className="mt-4 text-sm text-gray-600 space-y-2">
                <p>Find flights to San Jose</p>
                <p>Analyze Q2 results</p>
                <p>Schedule Sales Meetings</p>
                <p>Reconnect with Mentors</p>
              </div>
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
          <h2 className="text-3xl font-bold">Good Morning, Harvin</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">Oct 8</p>
              <p className="text-gray-600">72°</p>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                6
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center text-gray-600">
            <PenSquare className="w-5 h-5 mr-2" />
            <input
              type="text"
              className="text-lg border-none outline-none"
              placeholder="Ask Otto for anything!"
              value={inputText} // Bind input value to state
              onChange={handleInputChange} // Handle input change
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Upcoming Tasks:</h3>
          <Link href="#" className="text-blue-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaskCard
            icon={CalendarIcon}
            title="Daily Sprint Meeting"
            time="10AM - 11AM"
            editable
          />
          <TaskCard
            icon={DocumentIcon}
            title="Read Q4 Report"
            description="Estimated 2 hrs"
            deadline="by 2PM"
          />
          <TaskCard
            icon={CalendarIcon}
            title="Sales Leads Connect"
            time="2PM - 3PM"
            editable
          />
          <TaskCard
            icon={MeetingIcon}
            title="Prep Client Meeting"
            description="Estimated 6 hrs"
            deadline="by EOD"
          />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, count }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        <span>{label}</span>
      </div>
      {count && (
        <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </div>
  );
}

function TaskCard({
  icon: Icon,
  title,
  time,
  description,
  deadline,
  editable,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-2 text-gray-600" />
          <h4 className="font-semibold">{title}</h4>
        </div>
        {editable && <PenSquare className="w-4 h-4 text-gray-400" />}
      </div>
      {time && <p className="text-gray-600 mt-1">{time}</p>}
      {description && <p className="text-gray-600 mt-1">{description}</p>}
      {deadline && (
        <p className="text-gray-600 mt-1">
          <span className="font-semibold">{deadline}</span>
        </p>
      )}
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

function CalendarIcon(props) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function DocumentIcon(props) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function MeetingIcon(props) {
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
      <path d="M7 21h10" />
      <rect x="2" y="3" width="20" height="14" rx="2" />
    </svg>
  );
}
