

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, DiscussionStarters } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const DiscussionAssistant: React.FC = () => {
    const [question, setQuestion] = usePersistentState('discussion-question', '');
    const { data, isLoading, error, execute } = useApi<DiscussionStarters>('discussion-result');

    const handleSubmit = () => {
        if (!question.trim()) return;
        const prompt = `A student needs help responding to an online discussion board. Based on the question, generate a thoughtful starter reply (about 100-150 words) and then suggest two different follow-up questions or angles they could use to advance the conversation.\n\nDiscussion Question:\n"""${question}"""`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                starterReply: { type: Type.STRING, description: "A well-structured starter reply." },
                followUpAngles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two distinct follow-up questions or angles." }
            },
            required: ["starterReply", "followUpAngles"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };
    
    const formatResultForCopy = () => {
        if (!data) return "";
        return `Starter Reply:\n${data.starterReply}\n\nFollow-Up Angles:\n1. ${data.followUpAngles[0]}\n2. ${data.followUpAngles[1]}`;
    }

    return (
        <div>
            <PageHeader title="Discussion Board Assistant" description="Generate a starter reply and follow-up ideas for class discussion forums." />
            <div className="space-y-4">
                <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={8} placeholder="Paste the discussion question here..." />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !question.trim()}>{isLoading ? 'Drafting...' : 'Get Assistance'}</Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title="Your Discussion Starters"
                    textToCopy={formatResultForCopy()}
                    toolId="discussion-assistant"
                    resultData={data}
                >
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Starter Reply</h4>
                            <p className="mt-1">{data.starterReply}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Follow-Up Angles</h4>
                            <ul className="mt-2 pl-4 list-decimal list-inside space-y-1">
                                {data.followUpAngles.map((angle, i) => <li key={i}>{angle}</li>)}
                            </ul>
                        </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default DiscussionAssistant;