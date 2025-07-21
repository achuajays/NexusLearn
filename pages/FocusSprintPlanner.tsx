

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, FocusPlan } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const FocusSprintPlanner: React.FC = () => {
    const [task, setTask] = usePersistentState('focus-task', '');
    const [duration, setDuration] = usePersistentState('focus-duration', '90');
    const { data, isLoading, error, execute } = useApi<FocusPlan>('focus-result');

    const handleSubmit = () => {
        if (!task.trim() || !duration) return;
        const prompt = `Create a study sprint plan based on the Pomodoro Technique for the task "${task}" over a total period of ${duration} minutes. The plan should alternate between focused work periods and short breaks.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                sprints: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            duration: { type: Type.NUMBER },
                            activity: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ["work", "break"] }
                        },
                        required: ["duration", "activity", "type"]
                    }
                }
            },
            required: ["sprints"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return data.sprints.map(s => `${s.type.toUpperCase()} (${s.duration} mins): ${s.activity}`).join('\n');
    }

    return (
        <div>
            <PageHeader title="Focus Sprint Planner" description="Structure your study time to stay focused and avoid burnout." />
            <div className="space-y-4">
                <Input value={task} onChange={(e) => setTask(e.target.value)} placeholder="What's your main task? e.g., 'Study Chapter 5'" />
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="How many minutes total?" />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !task.trim() || !duration}>
                        {isLoading ? 'Planning...' : 'Create Focus Plan'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title="Your Focus Sprint Plan"
                    textToCopy={formatResultForCopy()}
                    toolId="focus-sprint-planner"
                    resultData={data}
                >
                    <ul className="space-y-3">
                        {data.sprints.map((sprint, index) => (
                            <li key={index} className="flex items-start p-3 rounded-lg bg-gray-50">
                                <MaterialIcon iconName={sprint.type === 'work' ? 'work' : 'free_breakfast'} className={`mr-4 mt-1 ${sprint.type === 'work' ? 'text-blue-500' : 'text-green-500'}`} />
                                <div>
                                    <p className="font-bold">{sprint.activity}</p>
                                    <p className="text-sm text-gray-500">{sprint.duration} minutes</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ResultDisplay>
            )}
        </div>
    );
};

export default FocusSprintPlanner;