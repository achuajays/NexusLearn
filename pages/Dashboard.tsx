

import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader, ToolCard } from '../components/AppComponents.tsx';
import { TOOLS } from '../constants.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Tool } from '../types.ts';

const RECENT_TOOLS_KEY = 'nexuslearn-recent-tools';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = usePersistentState<'all' | 'student' | 'teacher'>('dashboard-role', 'all');
    const [recentTools, setRecentTools] = useState<Tool[]>([]);

    useEffect(() => {
        try {
            const recentIds = JSON.parse(localStorage.getItem(RECENT_TOOLS_KEY) || '[]');
            const toolsMap = new Map(TOOLS.map(t => [t.id, t]));
            const recent = recentIds.map((id: string) => toolsMap.get(id)).filter(Boolean);
            setRecentTools(recent as Tool[]);
        } catch (e) {
            console.error("Failed to load recent tools:", e);
        }
    }, []);

    const filteredTools = useMemo(() => {
        const toolsWithoutRecent = TOOLS.filter(tool => !recentTools.some(rt => rt.id === tool.id));
        if (activeTab === 'all') {
            return toolsWithoutRecent;
        }
        if (activeTab === 'student') {
            return toolsWithoutRecent.filter(tool => tool.role !== 'teacher');
        }
        if (activeTab === 'teacher') {
            return toolsWithoutRecent.filter(tool => tool.role === 'teacher');
        }
        return toolsWithoutRecent;
    }, [activeTab, recentTools]);

    const tabs = [
        { id: 'all', label: 'All Tools' },
        { id: 'student', label: 'For Students' },
        { id: 'teacher', label: 'For Teachers' }
    ];

    return (
        <div>
            <PageHeader title="NexusLearn Dashboard" description="Choose a tool to get started, or create a project to organize your work." />
            
            {recentTools.length > 0 && (
                 <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Recently Used</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentTools.map((tool) => (
                            <ToolCard key={`recent-${tool.id}`} tool={tool} />
                        ))}
                    </div>
                </div>
            )}
            
            <div>
                 <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;