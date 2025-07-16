import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

interface DoubtBotResponse {
    answer: string;
    readingLink: string;
}

const DoubtBot: React.FC = () => {
    const [question, setQuestion] = usePersistentState('doubtbot-question', '');
    const { data, isLoading, error, execute } = useApi<DoubtBotResponse>('doubtbot-result');

    const handleSubmit = () => {
        if (!question.trim()) return;
        const prompt = `Answer this student's question conceptually. Then, suggest one high-quality online resource (like an article or video) for further reading and provide its full URL.\n\nQuestion: "${question}"`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                answer: { type: Type.STRING, description: "A conceptual answer to the question." },
                readingLink: { type: Type.STRING, description: "A valid URL for further reading." },
            },
            required: ["answer", "readingLink"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    return (
        <div>
            <PageHeader title="DoubtBot" description="Have a question? Get an instant, clear explanation." />
            <div className="flex space-x-2">
                <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g., Why is the sky blue?" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !question.trim()}>{isLoading ? 'Thinking...' : 'Ask'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay title="Answer" textToCopy={`${data.answer}\n\nFurther Reading: ${data.readingLink}`}>
                    <p>{data.answer}</p>
                    {data.readingLink && (
                        <div className="mt-4">
                            <h5 className="font-semibold">Further Reading</h5>
                            <a href={data.readingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{data.readingLink}</a>
                        </div>
                    )}
                </ResultDisplay>
            )}
        </div>
    );
};

export default DoubtBot;