

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, DifferentiatedText } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const DifferentiatedTextGenerator: React.FC = () => {
    const [text, setText] = usePersistentState('difftext-text', '');
    const { data, isLoading, error, execute } = useApi<DifferentiatedText>('difftext-result');
    const [activeTab, setActiveTab] = usePersistentState<'levelA2' | 'levelB1' | 'levelB2'>('difftext-tab', 'levelB1');

    const handleSubmit = () => {
        if (!text.trim()) return;
        const prompt = `You are an ESL curriculum specialist. Rewrite the following text for three different English proficiency levels based on the CEFR scale: A2 (Beginner), B1 (Intermediate), and B2 (Upper-Intermediate).

Original Text:
"""${text}"""`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                levelA2: { type: Type.STRING, description: "Text simplified for A2 level." },
                levelB1: { type: Type.STRING, description: "Text simplified for B1 level." },
                levelB2: { type: Type.STRING, description: "Text simplified for B2 level." }
            },
            required: ["levelA2", "levelB1", "levelB2"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const tabLabels = {
        levelA2: 'A2 (Beginner)',
        levelB1: 'B1 (Intermediate)',
        levelB2: 'B2 (Upper-Intermediate)'
    };

    return (
        <div>
            <PageHeader title="Differentiated Text Generator" description="For Teachers: Adapt any text for different student reading levels." />
            <div className="space-y-4">
                <Textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    rows={12} 
                    placeholder="Paste the original, complex text here..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !text.trim()}>
                        {isLoading ? 'Adapting...' : 'Generate Versions'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <div className="mt-8">
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {(Object.keys(data) as Array<keyof DifferentiatedText>).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    {tabLabels[tab]}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <ResultDisplay
                        title={`Simplified Version (${tabLabels[activeTab]})`}
                        textToCopy={data[activeTab]}
                        toolId="differentiated-text-generator"
                        resultData={{ level: activeTab, text: data[activeTab] }}
                    >
                       <p className="whitespace-pre-wrap font-sans">{data[activeTab]}</p>
                   </ResultDisplay>
                </div>
            )}
        </div>
    );
};

export default DifferentiatedTextGenerator;