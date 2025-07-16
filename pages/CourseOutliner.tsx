import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, CourseOutline } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const CourseOutliner: React.FC = () => {
    const [topic, setTopic] = usePersistentState('courseoutliner-topic', '');
    const { data, isLoading, error, execute } = useApi<CourseOutline>('courseoutliner-result');

    const handleSubmit = () => {
        if (!topic.trim()) return;
        const prompt = `Break down the topic "${topic}" into a 4-week learning curriculum. For each week, provide a list of daily learning tasks or topics.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                week1: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tasks for week 1." },
                week2: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tasks for week 2." },
                week3: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tasks for week 3." },
                week4: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tasks for week 4." },
            },
            required: ["week1", "week2", "week3", "week4"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };
    
    const formatResultForCopy = () => {
        if (!data) return "";
        let output = `Course Outline: ${topic}\n\n`;
        Object.entries(data).forEach(([week, tasks]) => {
            const weekNum = week.replace('week', '');
            output += `Week ${weekNum}:\n${tasks.map(t => `- ${t}`).join('\n')}\n\n`;
        });
        return output;
    }

    return (
        <div>
            <PageHeader title="Course Outliner" description="Generate a 4-week curriculum for any subject." />
            <div className="flex space-x-2">
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Learn SQL, Introduction to Psychology" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !topic.trim()}>{isLoading ? 'Generating...' : 'Create Outline'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay title={`Curriculum for ${topic}`} textToCopy={formatResultForCopy()}>
                    <div className="space-y-6">
                        {Object.entries(data).map(([week, tasks]) => (
                            <div key={week}>
                                <h4 className="font-bold text-lg text-slate-700 capitalize">Week {week.replace('week', '')}</h4>
                                <ul className="mt-2 pl-4 list-disc list-inside space-y-1">
                                    {tasks.map((task, i) => <li key={i}>{task}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default CourseOutliner;