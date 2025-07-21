

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, DebatePrep } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const DebateAssistant: React.FC = () => {
    const [motion, setMotion] = usePersistentState('debate-motion', '');
    const { data, isLoading, error, execute } = useApi<DebatePrep>('debate-result');

    const handleSubmit = () => {
        if (!motion.trim()) return;
        const prompt = `You are a debate prep assistant. For the motion "${motion}", generate 3 strong arguments for the 'Pro' side and 3 strong arguments for the 'Con' side. For each argument, also provide a potential rebuttal.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                pro: {
                    type: Type.ARRAY,
                    description: "Arguments for the motion.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            argument: { type: Type.STRING },
                            rebuttal: { type: Type.STRING }
                        },
                        required: ["argument", "rebuttal"]
                    }
                },
                con: {
                    type: Type.ARRAY,
                    description: "Arguments against the motion.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            argument: { type: Type.STRING },
                            rebuttal: { type: Type.STRING }
                        },
                        required: ["argument", "rebuttal"]
                    }
                }
            },
            required: ["pro", "con"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };
    
    const formatResultForCopy = () => {
        if (!data) return "";
        let text = `Debate Points for: ${motion}\n\n`;
        text += '--- PRO ---\n';
        text += data.pro.map(p => `Argument: ${p.argument}\nRebuttal: ${p.rebuttal}`).join('\n\n');
        text += '\n\n--- CON ---\n';
        text += data.con.map(p => `Argument: ${p.argument}\nRebuttal: ${p.rebuttal}`).join('\n\n');
        return text;
    }

    return (
        <div>
            <PageHeader title="Debate Prep Assistant" description="Get pro and con arguments, with rebuttals, for any debate topic." />
            <div className="flex space-x-2">
                <Input value={motion} onChange={(e) => setMotion(e.target.value)} placeholder="e.g., This house believes that social media has done more harm than good." className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !motion.trim()}>{isLoading ? 'Prepping...' : 'Get Arguments'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title={`Debate on: ${motion}`}
                    textToCopy={formatResultForCopy()}
                    toolId="debate-assistant"
                    resultData={data}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Pro Column */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-green-700 border-b-2 border-green-200 pb-2">Pro</h3>
                            {data.pro.map((point, i) => (
                                <div key={`pro-${i}`} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                    <p className="font-semibold">{point.argument}</p>
                                    <p className="text-sm mt-2 text-gray-600"><span className="font-bold text-gray-800">Rebuttal:</span> {point.rebuttal}</p>
                                </div>
                            ))}
                        </div>
                        {/* Con Column */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-red-700 border-b-2 border-red-200 pb-2">Con</h3>
                            {data.con.map((point, i) => (
                                <div key={`con-${i}`} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                    <p className="font-semibold">{point.argument}</p>
                                    <p className="text-sm mt-2 text-gray-600"><span className="font-bold text-gray-800">Rebuttal:</span> {point.rebuttal}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default DebateAssistant;