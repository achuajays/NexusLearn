

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const ReportCardGenerator: React.FC = () => {
    const [notes, setNotes] = usePersistentState('reportcard-notes', '');
    const { data: comment, isLoading, error, execute } = useApi<string>('reportcard-result');

    const handleSubmit = () => {
        if (!notes.trim()) return;
        const prompt = `You are a helpful teaching assistant. Based on the following brief notes about a student's traits and performance, generate a formal, constructive, and encouraging feedback paragraph suitable for a report card. The tone should be professional and supportive.\n\nTEACHER'S NOTES:\n"""${notes}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Report Card Comment Generator" description="A tool for teachers to automate progress reporting with AI." />
            <div className="space-y-4">
                <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    rows={8} 
                    placeholder="Enter student traits and performance notes, e.g., 'Works hard, good at math, but sometimes quiet in class. Needs to participate more.'"
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !notes.trim()}>
                        {isLoading ? 'Writing...' : 'Generate Comment'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {comment && (
                <ResultDisplay
                    title="Generated Report Card Comment"
                    textToCopy={comment}
                    toolId="report-card-generator"
                    resultData={comment}
                >
                    <pre className="whitespace-pre-wrap font-sans">{comment}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default ReportCardGenerator;