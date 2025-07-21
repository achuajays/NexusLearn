

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, BrainstormResult } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const ProjectBrainstormer: React.FC = () => {
    const [topic, setTopic] = usePersistentState('brainstorm-topic', '');
    const { data, isLoading, error, execute } = useApi<BrainstormResult>('brainstorm-result');

    const handleSubmit = () => {
        if (!topic.trim()) return;
        const prompt = `A student needs to start a project on the broad topic of "${topic}". Brainstorm a list of 5 specific and interesting research questions they could investigate, and a list of 3 creative project ideas (e.g., a documentary, a website, a physical model).`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                researchQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                projectIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["researchQuestions", "projectIdeas"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return `Topic: ${topic}\n\nPotential Research Questions:\n- ${data.researchQuestions.join('\n- ')}\n\nCreative Project Ideas:\n- ${data.projectIdeas.join('\n- ')}`;
    };

    return (
        <div>
            <PageHeader title="Project Brainstormer" description="Never stare at a blank page again. Get unique ideas for any project." />
            <div className="flex space-x-2">
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter a broad topic, e.g., Climate Change, Renaissance Art" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !topic.trim()}>{isLoading ? 'Brainstorming...' : 'Get Ideas'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title={`Ideas for: ${topic}`}
                    textToCopy={formatResultForCopy()}
                    toolId="project-brainstormer"
                    resultData={data}
                >
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Potential Research Questions</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside">
                                {data.researchQuestions.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Creative Project Ideas</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside">
                                {data.projectIdeas.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default ProjectBrainstormer;