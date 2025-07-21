

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const EthicalDilemmaExplorer: React.FC = () => {
    const [dilemma, setDilemma] = usePersistentState('ethical-dilemma', '');
    const { data: analysis, isLoading, error, execute } = useApi<string>('ethical-result');

    const handleSubmit = () => {
        if (!dilemma.trim()) return;
        const prompt = `You are a philosophy professor. A student has presented you with an ethical dilemma. Analyze this dilemma from three different major ethical frameworks:
1.  **Utilitarianism:** Focus on the greatest good for the greatest number.
2.  **Deontology:** Focus on duties, rules, and the morality of actions themselves.
3.  **Virtue Ethics:** Focus on the character of the moral agent.

Present the analysis in markdown format with clear headings for each framework.

DILEMMA:
"""${dilemma}"""`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Ethical Dilemma Explorer" description="Explore moral problems and situations from multiple philosophical viewpoints." />
            <div className="space-y-4">
                <Textarea 
                    value={dilemma} 
                    onChange={(e) => setDilemma(e.target.value)} 
                    rows={8} 
                    placeholder="Describe an ethical dilemma, e.g., 'Is it ethical for a self-driving car to sacrifice its passenger to save five pedestrians?'"
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !dilemma.trim()}>
                        {isLoading ? 'Pondering...' : 'Explore Dilemma'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {analysis && (
                <ResultDisplay
                    title="Philosophical Analysis"
                    textToCopy={analysis}
                    toolId="ethical-dilemma-explorer"
                    resultData={analysis}
                >
                    <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default EthicalDilemmaExplorer;