
import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, PresentationSlide } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, ResultDisplay } from '../components/AppComponents.tsx';

const PresentationGenerator: React.FC = () => {
    const [topic, setTopic] = usePersistentState('presentation-topic', '');
    const [slideCount, setSlideCount] = usePersistentState('presentation-slides', '5');
    const { data, isLoading, error, execute } = useApi<PresentationSlide[]>('presentation-result');

    const handleSubmit = () => {
        if (!topic.trim()) return;
        const count = parseInt(slideCount, 10) || 5;
        const prompt = `Generate content for a ${count}-slide presentation on the topic: "${topic}". For each slide, provide a concise title and 3-5 key bullet points.`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    points: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "points"]
            }
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };
    
    const formatResultForCopy = () => {
        if (!data) return "";
        return data.map((slide, i) => `Slide ${i + 1}: ${slide.title}\n${slide.points.map(p => `- ${p}`).join('\n')}`).join('\n\n');
    }

    return (
        <div>
            <PageHeader title="Presentation Generator" description="Generate content for your slides in seconds." />
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The Future of Renewable Energy" className="flex-grow" />
                <Input type="number" value={slideCount} onChange={(e) => setSlideCount(e.target.value)} min="2" max="15" className="md:w-28" />
                <Button onClick={handleSubmit} disabled={isLoading || !topic.trim()}>{isLoading ? 'Generating...' : 'Create Slides'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay title={`Presentation on: ${topic}`} textToCopy={formatResultForCopy()}>
                    <div className="space-y-6">
                        {data.map((slide, index) => (
                            <div key={index} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <h4 className="font-bold text-lg text-slate-800">Slide {index + 1}: {slide.title}</h4>
                                <ul className="mt-2 pl-5 list-disc space-y-1">
                                    {slide.points.map((point, i) => <li key={i}>{point}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default PresentationGenerator;
