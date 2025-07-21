import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, EssayOutline } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay, Select } from '../components/AppComponents.tsx';

const EssayBuddy: React.FC = () => {
    const [topic, setTopic] = usePersistentState('essaybuddy-topic', '');
    const [essayType, setEssayType] = usePersistentState('essaybuddy-type', 'Argumentative');
    const { data, isLoading, error, execute } = useApi<EssayOutline>('essaybuddy-result');

    const handleSubmit = () => {
        if (!topic.trim()) return;
        const prompt = `You are an expert academic planner. For an '${essayType}' essay on the topic "${topic}", provide a potential thesis statement, a detailed hierarchical outline of key points and sub-points, and a compelling introductory paragraph.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                thesis: { type: Type.STRING, description: "A single, clear thesis statement." },
                structure: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of strings for the outline, using indentation for hierarchy." },
                introParagraph: { type: Type.STRING, description: "A well-crafted introductory paragraph." }
            },
            required: ["thesis", "structure", "introParagraph"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return `Topic: ${topic}\nType: ${essayType}\n\nThesis Statement:\n${data.thesis}\n\nIntroductory Paragraph:\n${data.introParagraph}\n\nOutline:\n${data.structure.join('\n')}`;
    }

    return (
        <div>
            <PageHeader title="Essay Buddy" description="Get a head start on your essay with an AI-generated plan." />
            <div className="space-y-4">
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your essay topic, e.g., 'The Impact of AI on Society'" />
                <Select value={essayType} onChange={(e) => setEssayType(e.target.value)}>
                    <option>Argumentative</option>
                    <option>Expository</option>
                    <option>Narrative</option>
                    <option>Descriptive</option>
                    <option>Reflective</option>
                </Select>
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !topic.trim()}>{isLoading ? 'Planning...' : 'Generate Plan'}</Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title={`Essay Plan: ${topic}`}
                    textToCopy={formatResultForCopy()}
                    toolId="essay-buddy"
                    resultData={data}
                >
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Thesis Statement</h4>
                            <p className="mt-1">{data.thesis}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Introductory Paragraph</h4>
                            <p className="mt-1">{data.introParagraph}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Proposed Outline</h4>
                            <ul className="mt-2 list-none space-y-1">
                                {data.structure.map((item, index) => <li key={index} className="pl-4">{item.replace(/^(\s*)/, '$1- ')}</li>)}
                            </ul>
                        </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default EssayBuddy;