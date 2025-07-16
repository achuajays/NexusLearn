
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, ConceptStyles } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const ConceptCracker: React.FC = () => {
    const [topic, setTopic] = usePersistentState('conceptcracker-topic', '');
    const { data, isLoading, error, execute } = useApi<ConceptStyles>('conceptcracker-result');
    const [activeTab, setActiveTab] = usePersistentState<'simple' | 'visual' | 'analogy'>('conceptcracker-tab', 'simple');
    
    const handleSubmit = () => {
        if (!topic.trim()) return;
        const prompt = `Explain the concept "${topic}" in three distinct styles: 1. A simple, direct explanation. 2. A vivid, visual description of what it looks or feels like. 3. A real-world analogy to make it relatable.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                simple: { type: Type.STRING, description: "A simple, direct explanation." },
                visual: { type: Type.STRING, description: "A vivid, visual description." },
                analogy: { type: Type.STRING, description: "A real-world analogy." }
            },
            required: ["simple", "visual", "analogy"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    return (
        <div>
            <PageHeader title="Concept Cracker" description="Break down any topic into simple, visual, and analogous explanations." />
            <div className="flex space-x-2">
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Quantum Entanglement, Photosynthesis" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !topic.trim()}>{isLoading ? 'Cracking...' : 'Explain'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <div className="mt-8">
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {(Object.keys(data) as Array<keyof ConceptStyles>).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors focus:outline-none ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <ResultDisplay title={`${topic || 'Concept'} - ${activeTab}`} textToCopy={data[activeTab]}>
                       <p>{data[activeTab]}</p>
                   </ResultDisplay>
                </div>
            )}
        </div>
    );
};

export default ConceptCracker;
