

import React from 'react';
import { PageHeader, ToolCard } from '../components/AppComponents.tsx';
import { TOOLS } from '../constants.ts';

const Dashboard: React.FC = () => (
    <div>
        <PageHeader title="NexusLearn Dashboard" description="Choose from over 30 AI-powered tools to get started." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOOLS.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
            ))}
        </div>
    </div>
);

export default Dashboard;