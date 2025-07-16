
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, StudyNotesDigest } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const KeywordExtractor: React.FC = () => {
    const [notes, setNotes] = usePersistentState('keywordextractor-notes', '');
    const { data, isLoading, error, execute } = useApi<StudyNotesDigest>('keywordextractor-result');

    const handleSubmit = () => {
        if (!notes.trim()) return;
        const prompt = `Analyze the following study notes. Extract the key terms and their definitions, a list of important keywords, and a bulleted list of the main highlights or summary points.\n\nNOTES:\n"""${notes}"""`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of single-word or short-phrase keywords." },
                definitions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { term: { type: Type.STRING }, definition: { type: Type.STRING } },
                        required: ["term", "definition"]
                    },
                    description: "A list of key terms and their definitions."
                },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A bulleted list of the most important points." }
            },
            required: ["keywords", "definitions", "highlights"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return `Highlights:\n${data.highlights.map(h => `- ${h}`).join('\n')}\n\nKeywords:\n${data.keywords.join(', ')}\n\nDefinitions:\n${data.definitions.map(d => `${d.term}: ${d.definition}`).join('\n')}`;
    }

    return (
        <div>
            <PageHeader title="Keyword Extractor" description="Analyze your study notes to pull out keywords, definitions, and highlights." />
            <div className="space-y-4">
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={15} placeholder="Paste your full study notes here..." />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !notes.trim()}>{isLoading ? 'Extracting...' : 'Extract Keywords'}</Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay title="Extracted Notes Digest" textToCopy={formatResultForCopy()}>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Highlights</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside space-y-1">
                                {data.highlights.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Keywords</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {data.keywords.map((kw, i) => <span key={i} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{kw}</span>)}
                            </div>
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

export default KeywordExtractor;
