

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, GroupProjectFeedback } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Input } from '../components/AppComponents.tsx';

const GroupProjectCoordinator: React.FC = () => {
    const [requirements, setRequirements] = usePersistentState('gpc-reqs', '');
    const [member1, setMember1] = usePersistentState('gpc-mem1', '');
    const [member2, setMember2] = usePersistentState('gpc-mem2', '');
    const [member3, setMember3] = usePersistentState('gpc-mem3', '');
    const { data, isLoading, error, execute } = useApi<GroupProjectFeedback>('gpc-result');

    const canSubmit = member1.trim() !== '' && requirements.trim() !== '';

    const handleSubmit = () => {
        if (!canSubmit) return;
        const prompt = `You are a project management assistant and editor. Analyze the following group project contributions against the provided requirements.

Project Requirements:
"""${requirements}"""

Member 1's Contribution:
"""${member1}"""

Member 2's Contribution:
"""${member2}"""

Member 3's Contribution:
"""${member3}"""

Please provide the following analysis:
1.  "toneAnalysis": Comment on the consistency of the writing style and tone. Suggest how to unify them.
2.  "redundancyReport": List any points or ideas that are repeated across different contributions.
3.  "gapAnalysis": Identify any parts of the project requirements that have not been addressed in the contributions.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                toneAnalysis: { type: Type.STRING },
                redundancyReport: { type: Type.ARRAY, items: { type: Type.STRING } },
                gapAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["toneAnalysis", "redundancyReport", "gapAnalysis"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return `Tone Analysis:\n${data.toneAnalysis}\n\nRedundancy Report:\n- ${data.redundancyReport.join('\n- ')}\n\nGap Analysis:\n- ${data.gapAnalysis.join('\n- ')}`;
    };

    return (
        <div>
            <PageHeader title="Group Project Coordinator" description="Unify tone, find overlaps, and check for missing sections in your group work." />
            <div className="space-y-4">
                <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4} placeholder="Paste your project requirements or rubric here..." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Textarea value={member1} onChange={(e) => setMember1(e.target.value)} rows={12} placeholder="Member 1's text..." />
                    <Textarea value={member2} onChange={(e) => setMember2(e.target.value)} rows={12} placeholder="Member 2's text..." />
                    <Textarea value={member3} onChange={(e) => setMember3(e.target.value)} rows={12} placeholder="Member 3's text..." />
                </div>
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !canSubmit}>
                        {isLoading ? 'Coordinating...' : 'Analyze Project'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title="Group Project Analysis"
                    textToCopy={formatResultForCopy()}
                    toolId="group-project-coordinator"
                    resultData={data}
                >
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Tone & Style Analysis</h4>
                            <p className="mt-1">{data.toneAnalysis}</p>
                        </div>
                        {data.gapAnalysis.length > 0 && (
                            <div>
                                <h4 className="font-bold text-lg text-slate-700">Gap Analysis (Missing Requirements)</h4>
                                <ul className="mt-2 pl-4 list-disc list-inside text-red-700">
                                    {data.gapAnalysis.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        )}
                        {data.redundancyReport.length > 0 && (
                             <div>
                                <h4 className="font-bold text-lg text-slate-700">Redundancy Report (Overlapping Content)</h4>
                                <ul className="mt-2 pl-4 list-disc list-inside text-yellow-700">
                                    {data.redundancyReport.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default GroupProjectCoordinator;