
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Select } from '../components/AppComponents.tsx';

const TextSimplifier: React.FC = () => {
    const [text, setText] = usePersistentState('simplifier-text', '');
    const [level, setLevel] = usePersistentState('simplifier-level', 'A2 (Beginner)');
    const { data: simplifiedText, isLoading, error, execute } = useApi<string>('simplifier-result');

    const handleSubmit = () => {
        if (!text.trim()) return;
        const prompt = `You are a language learning support tool. Rewrite the following academic text to make it much simpler and easier to understand for an English language learner at the ${level} CEFR level. Use simple vocabulary and sentence structures.\n\nORIGINAL TEXT:\n"""${text}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Text Simplifier" description="Rewrite complex academic paragraphs into simple English for ESL students." />
            <div className="space-y-4">
                 <Select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option>A2 (Beginner)</option>
                    <option>B1 (Intermediate)</option>
                    <option>B2 (Upper-Intermediate)</option>
                </Select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Textarea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        rows={12} 
                        placeholder="Paste the complex academic text here..."
                    />
                    <div className="bg-white p-4 border border-gray-200 rounded-md">
                        {isLoading && <Loader />}
                        {error && <ErrorDisplay message={error} />}
                        {simplifiedText && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Simplified Version</h3>
                                <pre className="whitespace-pre-wrap font-sans text-gray-700">{simplifiedText}</pre>
                            </div>
                        )}
                         {!isLoading && !error && !simplifiedText && <p className="text-gray-500 text-center mt-10">Your simplified text will appear here...</p>}
                    </div>
                </div>
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !text.trim()}>
                        {isLoading ? 'Simplifying...' : 'Simplify Text'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TextSimplifier;
