

import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants.ts';
import { MaterialIcon } from './Icons.tsx';

const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const handleLinkClick = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full">
            <Link to="/dashboard" onClick={handleLinkClick} className="p-4 border-b border-gray-200 flex items-center space-x-2 h-16 flex-shrink-0">
                <MaterialIcon iconName="auto_awesome" className="text-blue-600 text-3xl" />
                <h1 className="text-xl font-bold text-gray-800">NexusLearn</h1>
            </Link>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <NavLink
                    to="/"
                    onClick={handleLinkClick}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 mb-2"
                >
                    <MaterialIcon iconName="home" className="mr-3 text-lg" />
                    <span>Home</span>
                </NavLink>

                <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</div>
                
                {TOOLS.map((tool) => (
                    <NavLink
                        key={tool.id}
                        to={tool.path}
                        onClick={handleLinkClick}
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
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export const Layout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const currentTool = TOOLS.find(tool => tool.path === location.pathname);
    const getPageTitle = () => {
        if (location.pathname === '/dashboard') return 'Dashboard';
        return currentTool?.title || 'NexusLearn';
    };

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
                         <MaterialIcon iconName={location.pathname === '/dashboard' ? 'dashboard' : currentTool?.icon || 'auto_awesome'} className="text-blue-600 text-2xl" />
                         <span className="font-bold text-lg">{getPageTitle()}</span>
                    </div>
                    {/* A spacer to help with centering the title if needed */}
                    <div className="w-6"></div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};