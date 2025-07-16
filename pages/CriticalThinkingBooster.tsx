
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const CriticalThinkingBooster: React.FC = () => {
    const [argument, setArgument] = usePersistentState('critical-argument', '');
    const { data: questions, isLoading, error, execute } = useApi<string>('critical-result');

    const handleSubmit = () => {
        if (!argument.trim()) return;
        const prompt = `You are a coach for critical thinking, using the Socratic method. A student has presented an argument or opinion. Respond by asking 3-4 insightful Socratic questions that challenge their assumptions, ask for evidence, or explore alternative viewpoints. Do not provide answers, only ask the questions.\n\nARGUMENT:\n"""${argument}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Critical Thinking Booster" description="Strengthen your essays and debates by challenging your own arguments." />
            <div className="space-y-4">
                <Textarea 
                    value={argument} 
                    onChange={(e) => setArgument(e.target.value)} 
                    rows={10} 
                    placeholder="Enter an argument, opinion, or thesis statement here..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !argument.trim()}>
                        {isLoading ? 'Analyzing...' : 'Challenge My Logic'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {questions && (
                <ResultDisplay title="Questions to Consider" textToCopy={questions}>
                    <pre className="whitespace-pre-wrap font-sans">{questions}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default CriticalThinkingBooster;
