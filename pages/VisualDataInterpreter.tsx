

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const VisualDataInterpreter: React.FC = () => {
    const [description, setDescription] = usePersistentState('dataviz-desc', '');
    const { data: interpretation, isLoading, error, execute } = useApi<string>('dataviz-result');

    const handleSubmit = () => {
        if (!description.trim()) return;
        const prompt = `A student has a visual chart or graph. Based on their description of it below, provide a simple interpretation. Explain what the data likely shows, identify the main trends, and summarize the key takeaway.

Description:
"""${description}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Visual Data Interpreter" description="Describe a graph or chart to get a plain-language explanation of what it means." />
            <div className="space-y-4">
                <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={10} 
                    placeholder="Describe the graph. For example: 'It's a bar chart showing website traffic over 7 days. The X-axis is the day, the Y-axis is the number of visitors. Monday is low, it goes up until Friday, and then drops on the weekend.'"
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !description.trim()}>
                        {isLoading ? 'Interpreting...' : 'Interpret Data'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {interpretation && (
                <ResultDisplay
                    title="Data Interpretation"
                    textToCopy={interpretation}
                    toolId="visual-data-interpreter"
                    resultData={interpretation}
                >
                    <pre className="whitespace-pre-wrap font-sans">{interpretation}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default VisualDataInterpreter;