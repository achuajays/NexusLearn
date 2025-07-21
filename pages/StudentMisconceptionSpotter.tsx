

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const StudentMisconceptionSpotter: React.FC = () => {
    const [topic, setTopic] = usePersistentState('misconception-topic', '');
    const { data: misconceptions, isLoading, error, execute } = useApi<string[]>('misconception-result');

    const handleSubmit = () => {
        if (!topic.trim()) return;
        const prompt = `You are an experienced educator. Based on your knowledge of pedagogy and common student errors, predict and list the 3-5 most common misconceptions or "tricky points" students have when first learning about the topic: "${topic}".`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Student Misconception Spotter" description="For Teachers: Proactively identify common errors students make on a topic." />
            <div className="flex space-x-2">
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Newton's Third Law, Mitosis vs Meiosis" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !topic.trim()}>{isLoading ? 'Predicting...' : 'Spot Misconceptions'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {misconceptions && (
                <ResultDisplay
                    title={`Common Sticking Points for: ${topic}`}
                    textToCopy={misconceptions.join('\n- ')}
                    toolId="student-misconception-spotter"
                    resultData={misconceptions}
                >
                     <ul className="space-y-3">
                        {misconceptions.map((item, i) => (
                            <li key={i} className="flex items-start bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <MaterialIcon iconName="warning_amber" className="text-yellow-500 mr-3 mt-1" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </ResultDisplay>
            )}
        </div>
    );
};

export default StudentMisconceptionSpotter;