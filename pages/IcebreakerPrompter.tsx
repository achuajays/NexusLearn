
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay, Select } from '../components/AppComponents.tsx';

const IcebreakerPrompter: React.FC = () => {
    const [topic, setTopic] = usePersistentState('icebreaker-topic', '');
    const [ageGroup, setAgeGroup] = usePersistentState('icebreaker-age', '12-15');
    const { data: prompt, isLoading, error, execute } = useApi<string>('icebreaker-result');

    const handleSubmit = () => {
        if (!topic.trim()) return;
        const apiPrompt = `You are a creative teacher's assistant. Generate 3-4 fun and engaging classroom icebreaker questions or short activities related to the topic "${topic}" for students in the ${ageGroup} age group.`;
        execute({ contents: apiPrompt });
    };

    return (
        <div>
            <PageHeader title="Classroom Icebreaker Prompter" description="A tool for teachers to generate fun questions or activities to start a class." />
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Class Topic, e.g., Shakespeare" />
                    <Select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                        <option value="5-7">5-7 years old</option>
                        <option value="8-11">8-11 years old</option>
                        <option value="12-15">12-15 years old</option>
                        <option value="16-18">16-18 years old</option>
                        <option value="University">University</option>
                    </Select>
                </div>
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !topic.trim()}>
                        {isLoading ? 'Thinking...' : 'Get Icebreakers'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {prompt && (
                <ResultDisplay title={`Icebreakers for ${topic}`} textToCopy={prompt}>
                    <pre className="whitespace-pre-wrap font-sans">{prompt}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default IcebreakerPrompter;
