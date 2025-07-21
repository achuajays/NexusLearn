

import React, { useState, useEffect, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { TOOLS } from '../constants.ts';
import { MaterialIcon } from './Icons.tsx';
import { Input } from './AppComponents.tsx';

const RECENT_TOOLS_KEY = 'nexuslearn-recent-tools';
const MAX_RECENT_TOOLS = 5;

const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleLinkClick = (toolId: string) => {
        // Save to recent tools
        try {
            const recent = JSON.parse(localStorage.getItem(RECENT_TOOLS_KEY) || '[]');
            const updatedRecent = [toolId, ...recent.filter((id: string) => id !== toolId)];
            localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updatedRecent.slice(0, MAX_RECENT_TOOLS)));
        } catch (e) {
            console.error("Failed to update recent tools:", e);
        }

        if (onClose) {
            onClose();
        }
    };

    const filteredTools = useMemo(() => {
        if (!searchTerm) {
            return TOOLS;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return TOOLS.filter(
            (tool) =>
                tool.title.toLowerCase().includes(lowercasedTerm) ||
                tool.description.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm]);

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full">
            <ReactRouterDOM.Link to="/dashboard" onClick={() => handleLinkClick('dashboard')} className="p-4 border-b border-gray-200 flex items-center space-x-2 h-16 flex-shrink-0">
                <MaterialIcon iconName="auto_awesome" className="text-blue-600 text-3xl" />
                <h1 className="text-xl font-bold text-gray-800">NexusLearn</h1>
            </ReactRouterDOM.Link>
            
            <div className="p-4 border-b border-gray-200">
                <Input 
                    type="search"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-sm"
                />
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <ReactRouterDOM.NavLink
                    to="/dashboard"
                    onClick={() => handleLinkClick('dashboard')}
                    className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} mb-2`}
                >
                    <MaterialIcon iconName="dashboard" className="mr-3 text-lg" />
                    <span>Dashboard</span>
                </ReactRouterDOM.NavLink>
                <ReactRouterDOM.NavLink
                    to="/projects"
                    onClick={() => handleLinkClick('projects')}
                    className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} mb-2`}
                >
                    <MaterialIcon iconName="folder" className="mr-3 text-lg" />
                    <span>Projects</span>
                </ReactRouterDOM.NavLink>

                <div className="px-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</div>
                
                {filteredTools.map((tool) => (
                    <ReactRouterDOM.NavLink
                        key={tool.id}
                        to={tool.path}
                        onClick={() => handleLinkClick(tool.id)}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                        }
                    >
                        <MaterialIcon iconName={tool.icon} className="mr-3 text-lg" />
                        <span>{tool.title}</span>
                    </ReactRouterDOM.NavLink>
                ))}
            </nav>
        </aside>
    );
};

export const Layout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = ReactRouterDOM.useLocation();

    const getPageTitle = () => {
        if (location.pathname === '/dashboard') return 'Dashboard';
        if (location.pathname.startsWith('/projects')) return 'Projects';
        const currentTool = TOOLS.find(tool => tool.path === location.pathname);
        return currentTool?.title || 'NexusLearn';
    };
    
    const getPageIcon = () => {
         if (location.pathname === '/dashboard') return 'dashboard';
        if (location.pathname.startsWith('/projects')) return 'folder';
        const currentTool = TOOLS.find(tool => tool.path === location.pathname);
        return currentTool?.icon || 'auto_awesome';
    }


    return (
        <div className="h-screen bg-gray-50 flex">
            {/* --- Desktop Sidebar --- */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* --- Mobile Sidebar --- */}
            <div className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative w-64 h-full bg-white shadow-xl">
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </div>
            </div>

            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* --- Mobile Header --- */}
                <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-between p-4 border-b border-gray-200 h-16">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
                        <MaterialIcon iconName="menu" className="text-2xl text-gray-600" />
                    </button>
                    <div className="flex items-center space-x-2">
                         <MaterialIcon iconName={getPageIcon()} className="text-blue-600 text-2xl" />
                         <span className="font-bold text-lg">{getPageTitle()}</span>
                    </div>
                    {/* A spacer to help with centering the title if needed */}
                    <div className="w-6"></div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto">
                    <ReactRouterDOM.Outlet />
                </div>
            </main>
        </div>
    );
};