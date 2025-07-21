import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, LabReport } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const LabHelper: React.FC = () => {
    const [title, setTitle] = usePersistentState('labhelper-title', '');
    const { data, isLoading, error, execute } = useApi<LabReport>('labhelper-result');

    const handleSubmit = () => {
        if (!title.trim()) return;
        const prompt = `For a lab experiment on "${title}", describe the standard procedure, key safety precautions, the main purpose, and two relevant viva questions with their answers.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                procedure: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of strings for each step of the procedure." },
                safety: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of strings for key safety precautions." },
                purpose: { type: Type.STRING, description: "A concise explanation of the experiment's purpose." },
                vivaQuestions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING }
                        },
                        required: ["question", "answer"]
                    },
                    description: "A list of potential viva questions and their answers."
                }
            },
            required: ["procedure", "safety", "purpose", "vivaQuestions"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return `Experiment: ${title}\n\nPurpose:\n${data.purpose}\n\nProcedure:\n${data.procedure.map(s => `- ${s}`).join('\n')}\n\nSafety Precautions:\n${data.safety.map(s => `- ${s}`).join('\n')}\n\nViva Questions:\n${data.vivaQuestions.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')}`;
    };

    return (
        <div>
            <PageHeader title="LabHelper" description="Get a breakdown of any lab experiment." />
            <div className="flex space-x-2">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Titration of HCl with NaOH" className="flex-grow" />
                <Button onClick={handleSubmit} disabled={isLoading || !title.trim()}>{isLoading ? 'Analyzing...' : 'Analyze Experiment'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title={`Report for: ${title}`}
                    textToCopy={formatResultForCopy()}
                    toolId="lab-helper"
                    resultData={data}
                >
                    <div className="space-y-4">
                        <details className="group" open>
                            <summary className="font-semibold text-lg cursor-pointer list-none group-hover:text-blue-600">Purpose</summary>
                            <p className="mt-2 pl-4">{data.purpose}</p>
                        </details>
                        <details className="group" open>
                            <summary className="font-semibold text-lg cursor-pointer list-none group-hover:text-blue-600">Procedure</summary>
                            <ul className="mt-2 pl-4 list-disc list-inside">
                                {data.procedure.map((step, i) => <li key={i}>{step}</li>)}
                            </ul>
                        </details>
                        <details className="group" open>
                            <summary className="font-semibold text-lg cursor-pointer list-none group-hover:text-blue-600">Safety Precautions</summary>
                            <ul className="mt-2 pl-4 list-disc list-inside">
                                {data.safety.map((rule, i) => <li key={i}>{rule}</li>)}
                            </ul>
                        </details>
                        <details className="group" open>
                            <summary className="font-semibold text-lg cursor-pointer list-none group-hover:text-blue-600">Viva Questions</summary>
                            <div className="mt-2 pl-4 space-y-3">
                                {data.vivaQuestions.map((viva, i) => (
                                    <div key={i}>
                                        <p className="font-medium">{viva.question}</p>
                                        <p>{viva.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default LabHelper;