

import React, { useState, useContext } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Tool } from '../types.ts';
import { MaterialIcon } from './Icons.tsx';
import { ProjectContext } from '../contexts/ProjectContext.tsx';
import { useProjects } from '../hooks/useProjects.ts';


// --- Reusable UI Primitives ---

export const Loader: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
);

export const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{message}</p>
    </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ className, children, variant = 'primary', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors";

    const variantClasses = {
        primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700',
        outline: 'border-gray-300 text-gray-700 bg-white/50 hover:bg-white'
    };
    
    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
    <textarea
        className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 bg-white ${className}`}
        {...props}
    />
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
    <input
        className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 bg-white ${className}`}
        {...props}
    />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...props }) => (
    <select
        className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 bg-white ${className}`}
        {...props}
    >
        {children}
    </select>
);


// --- Layout & Page Structure ---

export const PageHeader: React.FC<{ title: React.ReactNode; description: string }> = ({ title, description }) => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">{title}</h1>
        <p className="mt-2 text-lg text-gray-500">{description}</p>
    </div>
);

export const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => (
    <ReactRouterDOM.Link to={tool.path} className="group bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow flex items-center justify-between">
        <div className="flex items-center">
            <MaterialIcon iconName={tool.icon} className="text-blue-500 text-3xl" />
            <div className="ml-4">
                <h3 className="font-semibold text-gray-800">{tool.title}</h3>
                <p className="text-sm text-gray-500">{tool.description}</p>
            </div>
        </div>
        <MaterialIcon iconName="chevron_right" className="text-gray-400 group-hover:text-blue-500 transition-colors" />
    </ReactRouterDOM.Link>
);


// --- Interactive & Display Components ---

export const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            {copied ? <MaterialIcon iconName="check" className="text-green-500" /> : <MaterialIcon iconName="content_copy" />}
        </button>
    );
};

interface ResultDisplayProps {
    title: string;
    children: React.ReactNode;
    textToCopy?: string;
    toolId?: string;
    resultData?: any;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, children, textToCopy, toolId, resultData }) => {
    const { activeProject } = useContext(ProjectContext);
    const { addArtifactToProject } = useProjects();
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveToProject = () => {
        if (activeProject && toolId && resultData) {
            addArtifactToProject(activeProject.id, {
                toolId: toolId,
                toolTitle: title, // A reasonable approximation of the tool name for display
                data: resultData
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2500);
        }
    };

    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
                <div className="flex items-center space-x-2">
                    {activeProject && toolId && resultData && (
                        <Button
                            onClick={handleSaveToProject}
                            disabled={isSaved}
                            className={`px-3 py-1 text-sm ${isSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            <MaterialIcon iconName={isSaved ? 'check' : 'add'} className="mr-2 text-base" />
                            {isSaved ? 'Saved!' : 'Save to Project'}
                        </Button>
                    )}
                    {textToCopy && <CopyButton textToCopy={textToCopy} />}
                </div>
            </div>
            <div className="prose prose-gray max-w-none text-gray-600">
                {children}
            </div>
        </div>
    );
};


export const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <div className="flex items-center">
        <button
            type="button"
            className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
        >
            <span
                aria-hidden="true"
                className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
        <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </div>
);