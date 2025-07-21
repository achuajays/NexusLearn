

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const AnalogyGenerator: React.FC = () => {
    const [concept, setConcept] = usePersistentState('analogy-concept', '');
    const [field, setField] = usePersistentState('analogy-field', 'everyday life');
    const { data: analogy, isLoading, error, execute } = useApi<string>('analogy-result');

    const handleSubmit = () => {
        if (!concept.trim()) return;
        const prompt = `Explain the concept "${concept}" using a creative and easy-to-understand analogy from the world of "${field}".`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Analogy Generator" description="Understand complex topics with simple, creative comparisons." />
            <div className="space-y-4">
                <Input 
                    value={concept} 
                    onChange={(e) => setConcept(e.target.value)} 
                    placeholder="Concept to explain, e.g., 'API Endpoints'"
                />
                <Input 
                    value={field} 
                    onChange={(e) => setField(e.target.value)} 
                    placeholder="Analogy field, e.g., 'cooking', 'sports', 'a castle'"
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !concept.trim() || !field.trim()}>
                        {isLoading ? 'Comparing...' : 'Generate Analogy'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {analogy && (
                <ResultDisplay
                    title={`Explaining "${concept}" like "${field}"`}
                    textToCopy={analogy}
                    toolId="analogy-generator"
                    resultData={analogy}
                >
                    <p className="text-lg">{analogy}</p>
                </ResultDisplay>
            )}
        </div>
    );
};

export default AnalogyGenerator;