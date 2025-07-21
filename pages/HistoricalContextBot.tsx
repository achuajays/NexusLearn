

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, HistoricalContext } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const HistoricalContextBot: React.FC = () => {
    const [event, setEvent] = usePersistentState('histcontext-event', '');
    const { data, isLoading, error, execute } = useApi<HistoricalContext>('histcontext-result');

    const handleSubmit = () => {
        if (!event.trim()) return;
        const prompt = `For the historical event "${event}", provide context by listing key world events happening around the same time, the key figures involved in the event itself, and the primary events that led up to it.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                worldEvents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What else was happening in the world at that time?" },
                keyFigures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Who were the most important people involved?" },
                precedingEvents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What events led directly to this one?" },
            },
            required: ["worldEvents", "keyFigures", "precedingEvents"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };
    
    const formatResultForCopy = () => {
        if (!data) return "";
        return `Context for: ${event}\n\nWhat led to it:\n- ${data.precedingEvents.join('\n- ')}\n\nKey Figures:\n- ${data.keyFigures.join('\n- ')}\n\nWhat else was happening:\n- ${data.worldEvents.join('\n- ')}`;
    }

    return (
        <div>
            <PageHeader title="Historical Context Bot" description="Understand the 'big picture' behind any historical event." />
            <div className="flex space-x-2">
                <Input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="e.g., The fall of the Berlin Wall, The Moon Landing" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !event.trim()}>{isLoading ? 'Researching...' : 'Get Context'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title={`Context for: ${event}`}
                    textToCopy={formatResultForCopy()}
                    toolId="historical-context-bot"
                    resultData={data}
                >
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">What Led To It? (Preceding Events)</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside">
                                {data.precedingEvents.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Key Figures</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside">
                                {data.keyFigures.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-bold text-lg text-slate-700">What Else Was Happening in the World?</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside">
                                {data.worldEvents.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default HistoricalContextBot;