
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, TimeEstimate } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const TimeEstimator: React.FC = () => {
    const [task, setTask] = usePersistentState('timeestimator-task', '');
    const { data, isLoading, error, execute } = useApi<TimeEstimate>('timeestimator-result');

    const handleSubmit = () => {
        if (!task.trim()) return;
        const prompt = `A student needs to complete the following task: "${task}". Estimate the total time required to complete it, and break it down into a simple, step-by-step plan.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                estimatedTime: { type: Type.STRING, description: "A concise estimation of the total time required (e.g., '3-4 hours')." },
                plan: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of strings for each step in the plan." }
            },
            required: ["estimatedTime", "plan"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return `Task: ${task}\n\nEstimated Time: ${data.estimatedTime}\n\nPlan:\n${data.plan.map(s => `- ${s}`).join('\n')}`;
    };

    return (
        <div>
            <PageHeader title="Time Estimator" description="Get an AI-powered time estimate and a simple plan for any assignment." />
            <div className="flex space-x-2">
                <Input value={task} onChange={(e) => setTask(e.target.value)} placeholder="e.g., Write a 5-page research paper on the Cold War" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !task.trim()}>{isLoading ? 'Estimating...' : 'Estimate Time'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay title={`Plan for: ${task}`} textToCopy={formatResultForCopy()}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Estimated Time</h4>
                            <p className="mt-1 text-2xl font-semibold text-blue-600">{data.estimatedTime}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Suggested Plan</h4>
                            <ul className="mt-2 pl-4 list-decimal list-inside">
                                {data.plan.map((step, i) => <li key={i} className="mb-1">{step}</li>)}
                            </ul>
                        </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default TimeEstimator;
