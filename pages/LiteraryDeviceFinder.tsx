

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, LiteraryDevice } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const LiteraryDeviceFinder: React.FC = () => {
    const [text, setText] = usePersistentState('literary-text', '');
    const { data, isLoading, error, execute } = useApi<LiteraryDevice[]>('literary-result');

    const handleSubmit = () => {
        if (!text.trim()) return;
        const prompt = `Analyze the following piece of literature. Identify the key literary devices used (such as metaphor, simile, personification, foreshadowing, etc.). For each device found, state what it is, explain its effect or meaning in the context, and provide the direct quote from the text.`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    device: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    quote: { type: Type.STRING }
                },
                required: ["device", "explanation", "quote"]
            }
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return data.map(d => `${d.device}:\n"${d.quote}"\nExplanation: ${d.explanation}`).join('\n\n');
    };

    return (
        <div>
            <PageHeader title="Literary Device Finder" description="Find and understand the literary devices in any piece of text." />
            <div className="space-y-4">
                <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={15} placeholder="Paste a poem, a passage from a book, or song lyrics here..." />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !text.trim()}>
                        {isLoading ? 'Analyzing...' : 'Find Devices'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title="Literary Devices Found"
                    textToCopy={formatResultForCopy()}
                    toolId="literary-device-finder"
                    resultData={data}
                >
                    <div className="space-y-6">
                        {data.map((item, index) => (
                            <div key={index} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <h4 className="font-bold text-lg text-slate-800 capitalize">{item.device}</h4>
                                <blockquote className="pl-4 border-l-4 border-slate-300 my-2 italic text-slate-600">"{item.quote}"</blockquote>
                                <p className="text-slate-700">{item.explanation}</p>
                            </div>
                        ))}
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default LiteraryDeviceFinder;