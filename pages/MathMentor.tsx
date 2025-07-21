

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const MathMentor: React.FC = () => {
    const [problem, setProblem] = usePersistentState('mathmentor-problem', '');
    const { data: solution, isLoading, error, execute } = useApi<string>('mathmentor-result');

    const handleSubmit = () => {
        if (!problem.trim()) return;
        const prompt = `You are an expert math and science tutor. A student is stuck on the following problem. Provide a detailed, step-by-step walkthrough of the solution. For each step, explain the rule, formula, or concept being used. Do not just give the final answer.

Problem:
"""
${problem}
"""

Return the output in markdown format, with clear headings for each step.`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Math Mentor" description="Get unstuck with step-by-step solutions for math and science problems." />
            <div className="space-y-4">
                <Textarea 
                    value={problem} 
                    onChange={(e) => setProblem(e.target.value)} 
                    rows={8} 
                    placeholder="Enter a math or science problem, e.g., 'Solve for x: 2x^2 - 5x + 3 = 0' or 'Balance the chemical equation: H2 + O2 -> H2O'"
                    className="font-mono text-lg"
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !problem.trim()}>
                        {isLoading ? 'Solving...' : 'Show Me the Steps'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {solution && (
                <ResultDisplay
                    title="Step-by-Step Solution"
                    textToCopy={solution}
                    toolId="math-mentor"
                    resultData={solution}
                >
                    <pre className="whitespace-pre-wrap font-sans">{solution}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default MathMentor;