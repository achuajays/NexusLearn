import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Switch } from '../components/AppComponents.tsx';

const SmartNotes: React.FC = () => {
    const [text, setText] = usePersistentState('smartnotes-text', '');
    const [isKidMode, setIsKidMode] = usePersistentState('smartnotes-kidmode', false);
    const { data: summary, isLoading, error, execute } = useApi<string>('smartnotes-result');

    const handleSubmit = () => {
        if (!text.trim()) return;
        const kidModeAddition = isKidMode ? " Explain it in a friendly way a 10-year-old can understand." : "";
        const prompt = `Summarize the following text into 3 clear bullet points. After the summary, provide a simple, one-paragraph explanation of the main concept.${kidModeAddition}\n\nTEXT:\n"""${text}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="SmartNotes" description="Paste any text to get a quick summary and simple explanation." />
            <div className="space-y-4">
                <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste your notes or a complex paragraph here..." />
                <div className="flex justify-between items-center">
                    <Switch checked={isKidMode} onChange={setIsKidMode} label="Explain Like I'm 10" />
                    <Button onClick={handleSubmit} disabled={isLoading || !text.trim()}>
                        {isLoading ? 'Thinking...' : 'Generate'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {summary && (
                <ResultDisplay title="Your Smart Summary" textToCopy={summary}>
                    <pre className="whitespace-pre-wrap font-sans">{summary}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default SmartNotes;
