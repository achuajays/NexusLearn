

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Select } from '../components/AppComponents.tsx';

const AssignmentFormatter: React.FC = () => {
    const [content, setContent] = usePersistentState('formatter-content', '');
    const [style, setStyle] = usePersistentState('formatter-style', 'APA');
    const { data: formatted, isLoading, error, execute } = useApi<string>('formatter-result');

    const handleSubmit = () => {
        if (!content.trim()) return;
        const prompt = `You are an expert academic writing assistant. Format the following raw text according to the ${style} 7th Edition style guidelines. Also, perform a thorough grammar and spelling check and fix any errors. Return only the fully formatted and corrected text, ready to be copied and pasted.\n\nRAW CONTENT:\n"""${content}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Assignment Formatter" description="Format your raw content into APA, MLA, or Chicago style." />
            <div className="space-y-4">
                <Select value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option>APA</option>
                    <option>MLA</option>
                    <option>Chicago</option>
                </Select>
                <Textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    rows={15} 
                    placeholder="Paste your raw, unformatted assignment content here..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !content.trim()}>
                        {isLoading ? 'Formatting...' : 'Format My Paper'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {formatted && (
                <ResultDisplay
                    title={`Formatted in ${style} Style`}
                    textToCopy={formatted}
                    toolId="assignment-formatter"
                    resultData={formatted}
                >
                    <pre className="whitespace-pre-wrap font-sans">{formatted}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default AssignmentFormatter;