
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const DailyLearner: React.FC = () => {
    const [subject, setSubject] = usePersistentState('dailylearner-subject', '');
    const { data: lesson, isLoading, error, execute } = useApi<string>('dailylearner-result');

    const handleSubmit = () => {
        if (!subject.trim()) return;
        const prompt = `Create one engaging, bite-sized microlesson (about 150-200 words) on the subject of "${subject}". The lesson should be interesting, easy to digest in 5 minutes, and contain a fun fact or a thought-provoking question at the end to encourage curiosity.`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Daily 5-Minute Learner" description="Get one engaging, bite-sized microlesson each day on a subject of your choice." />
            <div className="flex space-x-2">
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Ancient Rome, Black Holes, The Art of Storytelling" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !subject.trim()}>{isLoading ? 'Teaching...' : 'Give Me a Lesson'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {lesson && (
                <ResultDisplay title={`Today's Lesson: ${subject}`} textToCopy={lesson}>
                    <pre className="whitespace-pre-wrap font-sans">{lesson}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default DailyLearner;
