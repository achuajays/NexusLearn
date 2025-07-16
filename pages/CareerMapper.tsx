
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const CareerMapper: React.FC = () => {
    const [interests, setInterests] = usePersistentState('careermapper-interests', '');
    const { data: careerMap, isLoading, error, execute } = useApi<string>('careermapper-result');

    const handleSubmit = () => {
        if (!interests.trim()) return;
        const prompt = `Based on a student's interest in "${interests}", map out 3-5 potential career paths. For each path, list the key skills needed and suggest some relevant university courses or online certifications. Return the output in markdown format with clear headings for each career path.`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Career Path Mapper" description="Map possible career paths based on your interests or major." />
            <div className="flex space-x-2">
                <Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., Computer Science and Art, Environmental Science, History" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !interests.trim()}>{isLoading ? 'Mapping...' : 'Map My Future'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {careerMap && (
                <ResultDisplay title="Potential Career Paths" textToCopy={careerMap}>
                    <pre className="whitespace-pre-wrap font-sans">{careerMap}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default CareerMapper;
