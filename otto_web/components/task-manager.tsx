"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Linkedin,
  Users,
  FileText,
  Github,
  Menu,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export function TaskManagerComponent() {
  const [todos, setTodos] = useState(["Find flights", "Dinner res", "Leads"]);
  const [newTodo, setNewTodo] = useState("");
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [middleWidth, setMiddleWidth] = useState(55);
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo("");
    }
  };

  const navItems = [
    { name: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
    { name: "Contacts", icon: <Users className="h-4 w-4" /> },
    { name: "Resume", icon: <FileText className="h-4 w-4" /> },
    { name: "Github", icon: <Github className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const divider = dividerRef.current;
    if (!container || !divider) return;

    let isDragging = false;
    let startX: number;
    let startWidth: number;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      startWidth =
        container.getBoundingClientRect().width * (middleWidth / 100);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const containerWidth = container.getBoundingClientRect().width;
      const newWidth = startWidth + (e.clientX - startX);
      const newPercentage = (newWidth / containerWidth) * 100;
      setMiddleWidth(Math.max(20, Math.min(80, newPercentage)));
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    divider.addEventListener("mousedown", onMouseDown);

    return () => {
      divider.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [middleWidth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-teal-200 p-4 md:p-8">
      <div
        ref={containerRef}
        className="mx-auto max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
          {/* Left Column */}
          <div
            className={`${
              isNavCollapsed ? "w-16" : "w-full md:w-1/5"
            } bg-gradient-to-t from-blue-100 to-teal-50 p-4 transition-all duration-300 ease-in-out flex-shrink-0`}
          >
            <div className="flex justify-between items-center mb-2">
              {!isNavCollapsed && (
                <h2 className="text-xl font-bold">Navigation</h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
              >
                {isNavCollapsed ? (
                  <Menu className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            {!isNavCollapsed && <Separator className="my-4" />}
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="cursor-pointer hover:bg-white/50 p-2 rounded flex items-center space-x-2"
                >
                  {item.icon}
                  {!isNavCollapsed && <span>{item.name}</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Middle Column */}
          <div
            className="flex-grow p-4 transition-all duration-300 ease-in-out overflow-auto"
            style={{ width: `${middleWidth}%` }}
          >
            <h1 className="text-2xl font-bold mb-2">Tasks</h1>
            <Separator className="my-4" />
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Todos</h3>
              <ul className="space-y-2">
                {todos.map((todo, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Checkbox id={`todo-${index}`} />
                    <label htmlFor={`todo-${index}`}>{todo}</label>
                  </li>
                ))}
              </ul>
              <div className="flex mt-2">
                <Input
                  type="text"
                  placeholder="New todo"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={addTodo} className="ml-2">
                  Add
                </Button>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">
                MIT Reunion @ Viale's
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Find flights</li>
                <li>Dinner res</li>
                <li>Leads</li>
                <li>People going</li>
                <li>Talking points</li>
              </ul>
            </div>
          </div>

          {/* Draggable Divider */}
          <div
            ref={dividerRef}
            className="w-1 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors"
          />

          {/* Right Column */}
          <div className="w-full md:w-1/4 p-4 bg-white flex-shrink-0">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-bold">Ask Otto</h2>
              <svg
                className="ml-2 h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <path d="M9 9h.01" />
                <path d="M15 9h.01" />
                <path d="M12 16v3" />
                <path d="M8 16l-2 3" />
                <path d="M16 16l2 3" />
                <path d="M12 7v2" />
              </svg>
            </div>
            <Separator className="my-4" />
            <Input
              type="text"
              placeholder="Ask a question..."
              className="mb-2"
            />
            <div className="space-y-2">
              {["Model thought", "Actions", "help contact"].map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  className="w-full justify-between"
                >
                  {item}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
