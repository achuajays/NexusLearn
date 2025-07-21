

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const LessonPlanVariator: React.FC = () => {
    const [topic, setTopic] = usePersistentState('lesson-topic', '');
    const { data: lessonPlan, isLoading, error, execute } = useApi<string>('lesson-result');

    const handleSubmit = () => {
        if (!topic.trim()) return;
        const prompt = `You are a master teacher and curriculum designer. Create a 60-minute lesson plan for the topic "${topic}".
The plan should include a variety of activities to engage different learning styles. Structure it with these sections in markdown:
- **Learning Objective:** What will students be able to do?
- **Hook (5 min):** An engaging activity to capture student interest.
- **Direct Instruction (15 min):** Key points for the teacher to explain.
- **Group Activity (25 min):** A collaborative, hands-on activity.
- **Exit Ticket (10 min):** A quick assessment to check for understanding.
- **Materials Needed:** A list of required materials.`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Lesson Plan Variator" description="For Teachers: Generate diverse and engaging lesson plans for any topic." />
            <div className="flex space-x-2">
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The Water Cycle, Introduction to Python Loops" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !topic.trim()}>{isLoading ? 'Planning...' : 'Generate Lesson Plan'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {lessonPlan && (
                <ResultDisplay
                    title={`Lesson Plan for ${topic}`}
                    textToCopy={lessonPlan}
                    toolId="lesson-plan-variator"
                    resultData={lessonPlan}
                >
                    <pre className="whitespace-pre-wrap font-sans">{lessonPlan}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default LessonPlanVariator;