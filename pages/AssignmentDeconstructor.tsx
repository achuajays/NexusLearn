

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, AssignmentDeconstruction } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const AssignmentDeconstructor: React.FC = () => {
    const [prompt, setPrompt] = usePersistentState('decon-prompt', '');
    const { data, isLoading, error, execute } = useApi<AssignmentDeconstruction>('decon-result');

    const handleSubmit = () => {
        if (!prompt.trim()) return;
        const apiPrompt = `Analyze the following assignment prompt and deconstruct it into its core components.
1. "mainVerb": What is the primary action the student must take (e.g., "Analyze", "Compare", "Argue")?
2. "coreSubject": What is the main topic or subject of the assignment?
3. "constraints": List all constraints, requirements, or limitations (e.g., page count, number of sources, formatting style).

Prompt:
"""${prompt}"""`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                mainVerb: { type: Type.STRING },
                coreSubject: { type: Type.STRING },
                constraints: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["mainVerb", "coreSubject", "constraints"]
        };
        execute({ contents: apiPrompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return `Main Task: ${data.mainVerb}\nCore Subject: ${data.coreSubject}\n\nConstraints:\n- ${data.constraints.join('\n- ')}`;
    };

    return (
        <div>
            <PageHeader title="Assignment Deconstructor" description="Never misinterpret a prompt again. Break it down to its core parts." />
            <div className="space-y-4">
                <Textarea 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    rows={10} 
                    placeholder="Paste your full assignment prompt here..."
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()}>
                        {isLoading ? 'Deconstructing...' : 'Break Down Prompt'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title="Prompt Breakdown"
                    textToCopy={formatResultForCopy()}
                    toolId="assignment-deconstructor"
                    resultData={data}
                >
                    <div className="space-y-4">
                        <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                             <MaterialIcon iconName="drive_file_rename_outline" className="text-3xl text-blue-500 mr-4" />
                             <div>
                                <p className="text-sm font-semibold text-blue-800">YOUR MAIN TASK (VERB)</p>
                                <p className="text-xl font-bold text-blue-900">{data.mainVerb}</p>
                            </div>
                        </div>
                         <div className="flex items-center bg-green-50 p-4 rounded-lg">
                             <MaterialIcon iconName="topic" className="text-3xl text-green-500 mr-4" />
                             <div>
                                <p className="text-sm font-semibold text-green-800">CORE SUBJECT</p>
                                <p className="text-xl font-bold text-green-900">{data.coreSubject}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700 flex items-center"><MaterialIcon iconName="rule" className="mr-2" />Constraints & Requirements</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside">
                                {data.constraints.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default AssignmentDeconstructor;