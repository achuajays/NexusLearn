
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const DataStoryteller: React.FC = () => {
    const [data, setData] = usePersistentState('datastory-data', '');
    const { data: story, isLoading, error, execute } = useApi<string>('datastory-result');

    const handleSubmit = () => {
        if (!data.trim()) return;
        const prompt = `You are an AI data analyst for students. Based on the following raw data or data description, write a simple, easy-to-understand narrative interpretation (a "data story") of what the data shows. Focus on the main trends, key insights, and a concluding summary.\n\nDATA/DESCRIPTION:\n"""${data}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Data Storyteller" description="Get a simple, narrative interpretation of what your data shows." />
            <div className="space-y-4">
                <Textarea 
                    value={data} 
                    onChange={(e) => setData(e.target.value)} 
                    rows={12} 
                    placeholder="Paste CSV data, a data table, or a description of your data here..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !data.trim()}>
                        {isLoading ? 'Interpreting...' : 'Tell Me the Story'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {story && (
                <ResultDisplay title="The Story in Your Data" textToCopy={story}>
                    <pre className="whitespace-pre-wrap font-sans">{story}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default DataStoryteller;
