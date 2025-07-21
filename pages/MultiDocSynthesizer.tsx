

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, SynthesizerPayload } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const MultiDocSynthesizer: React.FC = () => {
    const [source1, setSource1] = usePersistentState('synth-source1', '');
    const [source2, setSource2] = usePersistentState('synth-source2', '');
    const [source3, setSource3] = usePersistentState('synth-source3', '');
    const { data, isLoading, error, execute } = useApi<SynthesizerPayload>('synth-result');

    const canSubmit = [source1, source2, source3].some(s => s.trim() !== '');

    const handleSubmit = () => {
        if (!canSubmit) return;
        const prompt = `You are a research synthesis expert. Analyze the following sources, then provide a unified summary of the core topic, a list of connections where the sources agree, and a list of contradictions where they disagree.

Source 1:
"""${source1}"""

Source 2:
"""${source2}"""

Source 3:
"""${source3}"""`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                unifiedSummary: { type: Type.STRING },
                connections: { type: Type.ARRAY, items: { type: Type.STRING } },
                contradictions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["unifiedSummary", "connections", "contradictions"]
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const formatResultForCopy = () => {
        if (!data) return "";
        return `Unified Summary:\n${data.unifiedSummary}\n\nConnections:\n${data.connections.join('\n- ')}\n\nContradictions:\n${data.contradictions.join('\n- ')}`;
    };

    return (
        <div>
            <PageHeader title="The Synthesizer" description="Combine and analyze notes from multiple sources to find the bigger picture." />
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Textarea value={source1} onChange={(e) => setSource1(e.target.value)} rows={10} placeholder="Paste text from Source 1..." />
                    <Textarea value={source2} onChange={(e) => setSource2(e.target.value)} rows={10} placeholder="Paste text from Source 2..." />
                    <Textarea value={source3} onChange={(e) => setSource3(e.target.value)} rows={10} placeholder="Paste text from Source 3..." />
                </div>
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !canSubmit}>
                        {isLoading ? 'Synthesizing...' : 'Synthesize Sources'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay
                    title="Synthesized Report"
                    textToCopy={formatResultForCopy()}
                    toolId="multi-doc-synthesizer"
                    resultData={data}
                >
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Unified Summary</h4>
                            <p className="mt-1">{data.unifiedSummary}</p>
                        </div>
                        {data.connections.length > 0 && (
                            <div>
                                <h4 className="font-bold text-lg text-slate-700">Connections (Points of Agreement)</h4>
                                <ul className="mt-2 pl-4 list-disc list-inside text-green-700">
                                    {data.connections.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        )}
                        {data.contradictions.length > 0 && (
                             <div>
                                <h4 className="font-bold text-lg text-slate-700">Contradictions (Points of Disagreement)</h4>
                                <ul className="mt-2 pl-4 list-disc list-inside text-red-700">
                                    {data.contradictions.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default MultiDocSynthesizer;