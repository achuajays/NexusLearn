import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, TextbookDigest } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const TextbookBuddy: React.FC = () => {
    const [text, setText] = usePersistentState('textbookbuddy-text', '');
    const { data, isLoading, error, execute } = useApi<TextbookDigest>('textbookbuddy-result');

    const handleSubmit = () => {
        if (!text.trim()) return;
        const prompt = `Analyze the following textbook excerpt. Provide a concise summary, define the key terms found in the text, and list the most important points or takeaways as a bulleted list.\n\n"""${text}"""`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                definitions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            term: { type: Type.STRING },
                            definition: { type: Type.STRING }
                        },
                        required: ["term", "definition"]
                    }
                },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "definitions", "highlights"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };
    
    const formatResultForCopy = () => {
        if (!data) return "";
        return `Summary:\n${data.summary}\n\nKey Highlights:\n${data.highlights.map(h => `- ${h}`).join('\n')}\n\nDefinitions:\n${data.definitions.map(d => `${d.term}: ${d.definition}`).join('\n')}`;
    }

    return (
        <div>
            <PageHeader title="Textbook Buddy" description="Digest any textbook chapter or article instantly." />
            <div className="space-y-4">
                <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={15} placeholder="Paste a snippet from your textbook or article here..." />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !text.trim()}>{isLoading ? 'Digesting...' : 'Analyze Text'}</Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title="Your Digest"
                    textToCopy={formatResultForCopy()}
                    toolId="textbook-buddy"
                    resultData={data}
                >
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Summary</h4>
                            <p className="mt-1">{data.summary}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Key Highlights</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside space-y-1">
                                {data.highlights.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Definitions</h4>
                            <div className="mt-2 space-y-2">
                                {data.definitions.map((def, i) => (
                                    <p key={i}><span className="font-semibold">{def.term}:</span> {def.definition}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default TextbookBuddy;