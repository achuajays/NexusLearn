
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const AnxietyCoach: React.FC = () => {
    const [feelings, setFeelings] = usePersistentState('anxietycoach-feelings', '');
    const { data: advice, isLoading, error, execute } = useApi<string>('anxietycoach-result');

    const handleSubmit = () => {
        if (!feelings.trim()) return;
        const prompt = `You are a caring and supportive AI coach trained in Cognitive Behavioral Therapy (CBT) techniques. A student is feeling anxious before a test and has written down their feelings. Respond with gentle, encouraging advice. Include calming techniques (like a simple breathing exercise), help reframe their fearful thoughts, and offer one small, actionable prep step they can take right now to feel more in control.\n\nSTUDENT'S FEELINGS:\n"""${feelings}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Exam Anxiety Coach" description="Feeling stressed about a test? Share your thoughts and get some support." />
            <div className="space-y-4">
                <Textarea 
                    value={feelings} 
                    onChange={(e) => setFeelings(e.target.value)} 
                    rows={8} 
                    placeholder="Tell me what's on your mind... For example: 'I'm so scared I'll forget everything during my math final tomorrow.'"
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !feelings.trim()}>
                        {isLoading ? 'Listening...' : 'Get Support'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {advice && (
                <ResultDisplay title="A Little Advice For You" textToCopy={advice}>
                    <pre className="whitespace-pre-wrap font-sans">{advice}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default AnxietyCoach;
