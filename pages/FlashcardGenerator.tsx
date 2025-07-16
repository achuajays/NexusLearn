import React, { useState } from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, Flashcard as FlashcardType } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const FlippableCard: React.FC<{ card: FlashcardType }> = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="w-full h-48 [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                {/* Front */}
                <div className="absolute w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center p-4 text-center [backface-visibility:hidden]">
                    <p className="text-lg font-medium">{card.question}</p>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-blue-50 border border-blue-200 rounded-lg shadow-sm flex items-center justify-center p-4 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-md text-blue-800">{card.answer}</p>
                </div>
            </div>
        </div>
    );
}

const FlashcardGenerator: React.FC = () => {
    const [text, setText] = usePersistentState('flashcard-text', '');
    const { data: cards, isLoading, error, execute } = useApi<FlashcardType[]>('flashcard-result');

    const handleSubmit = () => {
        if (!text.trim()) return;
        const prompt = `Based on the following text, generate a set of question-and-answer flashcards. Each flashcard should have a clear, concise question and an accurate answer.\n\nTEXT:\n"""${text}"""`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
            }
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    return (
        <div>
            <PageHeader title="Flashcard Generator" description="Turn any text or notes into a set of interactive, flippable flashcards." />
            <div className="space-y-4">
                <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} placeholder="Paste any text or notes here..." />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !text.trim()}>{isLoading ? 'Generating...' : 'Create Flashcards'}</Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {cards && cards.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Flashcards ({cards.length})</h3>
                    <p className="text-gray-500 mb-6 text-sm flex items-center gap-2"><MaterialIcon iconName="touch_app" className="text-lg" />Click any card to flip it over.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card, index) => <FlippableCard key={index} card={card} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardGenerator;