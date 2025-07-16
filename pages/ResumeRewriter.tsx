
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Select } from '../components/AppComponents.tsx';

const ResumeRewriter: React.FC = () => {
    const [content, setContent] = usePersistentState('resumerewriter-content', '');
    const [goal, setGoal] = usePersistentState('resumerewriter-goal', 'Impact');
    const { data: rewritten, isLoading, error, execute } = useApi<string>('resumerewriter-result');

    const handleSubmit = () => {
        if (!content.trim()) return;
        const prompt = `You are a professional resume writer for students. Rewrite the following resume content to optimize it for "${goal}". Focus on using action verbs, quantifiable achievements, and clear, professional language.\n\nRESUME CONTENT:\n"""${content}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Resume Rewriter" description="Improve your resume bullet points for clarity, impact, or ATS optimization." />
            <div className="space-y-4">
                 <Select value={goal} onChange={(e) => setGoal(e.target.value)}>
                    <option>Impact</option>
                    <option>Clarity</option>
                    <option>ATS Optimization</option>
                </Select>
                <Textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    rows={15} 
                    placeholder="Paste your resume draft or bullet points here..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !content.trim()}>
                        {isLoading ? 'Rewriting...' : 'Rewrite My Resume'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {rewritten && (
                <ResultDisplay title={`Resume Rewritten for ${goal}`} textToCopy={rewritten}>
                    <pre className="whitespace-pre-wrap font-sans">{rewritten}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default ResumeRewriter;
