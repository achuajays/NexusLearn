
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Input } from '../components/AppComponents.tsx';

const ScholarshipCoach: React.FC = () => {
    const [essayPrompt, setEssayPrompt] = usePersistentState('scholarship-prompt', '');
    const [draft, setDraft] = usePersistentState('scholarship-draft', '');
    const { data: improvedEssay, isLoading, error, execute } = useApi<string>('scholarship-result');

    const handleSubmit = () => {
        if (!essayPrompt.trim() || !draft.trim()) return;
        const prompt = `You are a scholarship essay coach. Based on the following prompt and the student's draft/key points, write an improved and compelling scholarship personal statement that is authentic and well-structured.\n\nSCHOLARSHIP PROMPT:\n"""${essayPrompt}"""\n\nSTUDENT'S DRAFT/POINTS:\n"""${draft}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Scholarship Essay Coach" description="Draft or improve your scholarship and personal statements." />
            <div className="space-y-4">
                <Input 
                    value={essayPrompt} 
                    onChange={(e) => setEssayPrompt(e.target.value)} 
                    placeholder="Paste the scholarship essay prompt here..."
                />
                <Textarea 
                    value={draft} 
                    onChange={(e) => setDraft(e.target.value)} 
                    rows={12} 
                    placeholder="Enter your key points, a rough draft, or your full essay here..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !essayPrompt.trim() || !draft.trim()}>
                        {isLoading ? 'Coaching...' : 'Improve My Essay'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {improvedEssay && (
                <ResultDisplay title="Your Improved Essay" textToCopy={improvedEssay}>
                    <pre className="whitespace-pre-wrap font-sans">{improvedEssay}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default ScholarshipCoach;
