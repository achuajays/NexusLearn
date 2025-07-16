
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Input } from '../components/AppComponents.tsx';

const CodeExplainer: React.FC = () => {
    const [code, setCode] = usePersistentState('codeexplainer-code', '');
    const [language, setLanguage] = usePersistentState('codeexplainer-lang', 'JavaScript');
    const { data: explanation, isLoading, error, execute } = useApi<string>('codeexplainer-result');

    const handleSubmit = () => {
        if (!code.trim()) return;
        const prompt = `Explain the following ${language} code snippet line by line in simple terms. If possible, also provide debugging hints or simulate the potential output.\n\nCODE:\n\`\`\`${language}\n${code}\n\`\`\``;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Code Explainer" description="Get a simple, line-by-line explanation for any code snippet." />
            <div className="space-y-4">
                <Input 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    placeholder="e.g., Python, JavaScript, Java" 
                />
                <Textarea 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    rows={12} 
                    placeholder="Paste your code snippet here..." 
                    className="font-mono"
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !code.trim()}>
                        {isLoading ? 'Explaining...' : 'Explain Code'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {explanation && (
                <ResultDisplay title="Code Explanation" textToCopy={explanation}>
                    <pre className="whitespace-pre-wrap font-sans">{explanation}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default CodeExplainer;
