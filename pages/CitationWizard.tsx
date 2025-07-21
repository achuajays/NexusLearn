

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Select } from '../components/AppComponents.tsx';

const CitationWizard: React.FC = () => {
    const [text, setText] = usePersistentState('citation-text', '');
    const [style, setStyle] = usePersistentState('citation-style', 'APA');
    const { data: bibliography, isLoading, error, execute } = useApi<string>('citation-result');

    const handleSubmit = () => {
        if (!text.trim()) return;
        const prompt = `You are an expert academic librarian. Analyze the following text, identify any potential sources mentioned or cited, and generate a properly formatted bibliography or works cited page in ${style} 7th edition format. If no clear sources are found, state that.

Text:
"""${text}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Citation Wizard" description="Automatically generate a bibliography from your essay text." />
            <div className="space-y-4">
                 <Select value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option>APA</option>
                    <option>MLA</option>
                    <option>Chicago</option>
                </Select>
                <Textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    rows={15} 
                    placeholder="Paste your full essay or text with citations here..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !text.trim()}>
                        {isLoading ? 'Scanning...' : 'Generate Bibliography'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {bibliography && (
                <ResultDisplay
                    title={`Bibliography (${style} Style)`}
                    textToCopy={bibliography}
                    toolId="citation-wizard"
                    resultData={bibliography}
                >
                    <pre className="whitespace-pre-wrap font-sans">{bibliography}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default CitationWizard;