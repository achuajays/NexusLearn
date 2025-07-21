

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const SourceCredibilityChecker: React.FC = () => {
    const [sourceText, setSourceText] = usePersistentState('credibility-text', '');
    const { data: analysis, isLoading, error, execute } = useApi<string>('credibility-result');

    const handleSubmit = () => {
        if (!sourceText.trim()) return;
        const prompt = `You are a media literacy expert. Analyze the following text from an article for a student. Provide a brief analysis covering these points in markdown format:
- **Overall Credibility Assessment:** A summary of your findings.
- **Potential Bias:** Does the text show a particular bias (political, commercial, etc.)? Explain why.
- **Use of Evidence:** Does the author support their claims with facts, data, or expert sources? Or is it mostly opinion?
- **Tone and Language:** Is the language neutral and objective, or is it emotional and persuasive?

ARTICLE TEXT:
"""${sourceText}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Source Credibility Checker" description="Analyze an article's bias, use of evidence, and overall reliability." />
            <div className="space-y-4">
                <Textarea 
                    value={sourceText} 
                    onChange={(e) => setSourceText(e.target.value)} 
                    rows={15} 
                    placeholder="Paste the full text of an article here to check its credibility..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !sourceText.trim()}>
                        {isLoading ? 'Analyzing...' : 'Check Credibility'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {analysis && (
                <ResultDisplay
                    title="Credibility Analysis"
                    textToCopy={analysis}
                    toolId="source-credibility-checker"
                    resultData={analysis}
                >
                    <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default SourceCredibilityChecker;