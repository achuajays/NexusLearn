

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Input } from '../components/AppComponents.tsx';

const RubricBuilder: React.FC = () => {
    const [assignment, setAssignment] = usePersistentState('rubric-assignment', 'Persuasive Essay');
    const [objectives, setObjectives] = usePersistentState('rubric-objectives', '');
    const { data: rubric, isLoading, error, execute } = useApi<string>('rubric-result');

    const handleSubmit = () => {
        if (!assignment.trim() || !objectives.trim()) return;
        const prompt = `You are a curriculum design expert. Create a detailed grading rubric for a "${assignment}" assignment.
The key learning objectives are:
"""
${objectives}
"""
The rubric should have clear criteria and performance levels (e.g., Exemplary, Proficient, Developing, Beginning). Return the complete rubric in a clean, easy-to-read markdown table format.`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Rubric Builder" description="For Teachers: Generate detailed grading rubrics for any assignment." />
            <div className="space-y-4">
                <Input 
                    value={assignment} 
                    onChange={(e) => setAssignment(e.target.value)} 
                    placeholder="Assignment Type, e.g., Lab Report, Research Paper"
                />
                <Textarea 
                    value={objectives} 
                    onChange={(e) => setObjectives(e.target.value)} 
                    rows={8} 
                    placeholder="List the key skills or learning objectives for this assignment. e.g.,\n- Clear thesis statement\n- Use of 3 primary sources\n- Proper APA citation"
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !assignment.trim() || !objectives.trim()}>
                        {isLoading ? 'Building...' : 'Build Rubric'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {rubric && (
                <ResultDisplay
                    title="Generated Grading Rubric"
                    textToCopy={rubric}
                    toolId="rubric-builder"
                    resultData={rubric}
                >
                    <pre className="whitespace-pre-wrap font-sans">{rubric}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default RubricBuilder;