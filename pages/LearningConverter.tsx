

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay, Select } from '../components/AppComponents.tsx';

const LearningConverter: React.FC = () => {
    const [concept, setConcept] = usePersistentState('learningconverter-concept', '');
    const [style, setStyle] = usePersistentState('learningconverter-style', 'Visual');
    const { data: explanation, isLoading, error, execute } = useApi<string>('learningconverter-result');

    const handleSubmit = () => {
        if (!concept.trim()) return;
        const prompt = `Explain the concept "${concept}" adapted for a "${style}" learning style.
- For a Visual style, describe imagery, diagrams, or spatial relationships.
- For an Auditory style, describe it as if you were explaining it in a podcast, using rhythm and sound cues.
- For a Reading/Writing style, provide a clear, structured textual explanation with definitions.
- For a Kinesthetic style, suggest a hands-on activity or a real-world interaction to understand it.
Please provide the explanation now.`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Learning Style Converter" description="Get explanations for concepts adapted to your personal learning style." />
            <div className="space-y-4">
                <Input value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Enter a concept, e.g., Supply and Demand" />
                 <Select value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option>Visual</option>
                    <option>Auditory</option>
                    <option>Reading/Writing</option>
                    <option>Kinesthetic</option>
                </Select>
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !concept.trim()}>{isLoading ? 'Adapting...' : 'Explain My Way'}</Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {explanation && (
                <ResultDisplay
                    title={`Explanation for "${concept}" (${style} Style)`}
                    textToCopy={explanation}
                    toolId="learning-converter"
                    resultData={explanation}
                >
                    <pre className="whitespace-pre-wrap font-sans">{explanation}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default LearningConverter;