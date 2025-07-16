
import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, InteractiveQuizItem, MCQQuizItem, TFQuizItem, FIBQuizItem } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, ResultDisplay, Input } from '../components/AppComponents.tsx';

const InteractiveQuizBuilder: React.FC = () => {
    const [concept, setConcept] = usePersistentState('interactivequiz-concept', '');
    const { data, isLoading, error, execute, setData } = useApi<InteractiveQuizItem[]>('interactivequiz-result');
    
    const [quizState, setQuizState] = usePersistentState<'idle' | 'playing' | 'finished'>('interactivequiz-state', 'idle');
    const [currentQuestion, setCurrentQuestion] = usePersistentState('interactivequiz-currentq', 0);
    const [userAnswers, setUserAnswers] = usePersistentState<string[]>('interactivequiz-answers', []);
    
    useEffect(() => {
        if (data && data.length > 0 && quizState === 'idle') {
            setQuizState('playing');
            setCurrentQuestion(0);
            setUserAnswers([]);
        }
    }, [data, quizState, setQuizState, setCurrentQuestion, setUserAnswers]);

    const handleGenerateQuiz = () => {
        if (!concept.trim()) return;
        setQuizState('idle');
        const prompt = `Generate a 5-item interactive quiz about "${concept}". The quiz should be a mix of question types: Multiple Choice (MCQ), True/False (TF), and Fill-in-the-Blank (FIB).`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, enum: ["MCQ", "TF", "FIB"] },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answer: { type: Type.STRING }
                },
                required: ["type", "question", "answer"]
            }
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const handleAnswer = (answer: string) => {
        const newAnswers = [...userAnswers, answer];
        setUserAnswers(newAnswers);
        if (currentQuestion < (data?.length || 0) - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setQuizState('finished');
        }
    };
    
    const score = useMemo(() => {
        if (!data) return 0;
        return userAnswers.reduce((acc, answer, index) => (
            data[index] && answer.toLowerCase() === data[index].answer.toLowerCase() ? acc + 1 : acc
        ), 0);
    }, [userAnswers, data]);

    const resetQuiz = () => {
        setQuizState('idle');
        setCurrentQuestion(0);
        setUserAnswers([]);
        setData(null);
        setConcept('');
    }

    const renderQuestion = (q: InteractiveQuizItem) => {
        switch (q.type) {
            case 'MCQ':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(q as MCQQuizItem).options.map(option => (
                            <button key={option} onClick={() => handleAnswer(option)}
                                className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 transition-all">
                                {option}
                            </button>
                        ))}
                    </div>
                );
            case 'TF':
                return (
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => handleAnswer('True')} className="w-32 bg-green-600 hover:bg-green-700">True</Button>
                        <Button onClick={() => handleAnswer('False')} className="w-32 bg-red-600 hover:bg-red-700">False</Button>
                    </div>
                );
            case 'FIB':
                return (
                    <form onSubmit={(e) => { e.preventDefault(); handleAnswer(e.currentTarget.fib_answer.value); }} className="flex gap-2">
                        <Input name="fib_answer" placeholder="Type your answer" className="flex-grow" required />
                        <Button type="submit">Submit</Button>
                    </form>
                );
            default:
                return <p>Unknown question type</p>;
        }
    }

    if (quizState === 'playing' && data && data[currentQuestion]) {
        const q = data[currentQuestion];
        return (
            <div>
                 <PageHeader title="Quiz Time!" description={`Question ${currentQuestion + 1} of ${data.length}`} />
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-center text-lg font-semibold mb-6">{q.question}</p>
                    {renderQuestion(q)}
                 </div>
            </div>
        )
    }
    
    if (quizState === 'finished' && data) {
        return (
            <div>
                <PageHeader title="Quiz Finished!" description={`You scored ${score} out of ${data.length}`} />
                <div className="space-y-4">
                {data.map((q, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${userAnswers[index]?.toLowerCase() === q.answer.toLowerCase() ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className="font-semibold">{q.question}</p>
                        <p className={`text-sm ${userAnswers[index]?.toLowerCase() === q.answer.toLowerCase() ? 'text-green-700' : 'text-red-700'}`}>Your answer: <span className="font-medium">{userAnswers[index]}</span></p>
                        {userAnswers[index]?.toLowerCase() !== q.answer.toLowerCase() && <p className="text-sm text-green-700">Correct answer: <span className="font-medium">{q.answer}</span></p>}
                    </div>
                ))}
                </div>
                 <div className="mt-8 text-center">
                    <Button onClick={resetQuiz}>Create Another Quiz</Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <PageHeader title="Interactive Quiz Builder" description="Create a quiz on any concept with multiple question types." />
            <div className="flex space-x-2">
                <Input value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="e.g., Photosynthesis, The American Revolution" className="flex-grow" />
                <Button onClick={handleGenerateQuiz} disabled={isLoading || !concept.trim()}>{isLoading ? 'Building...' : 'Build Quiz'}</Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
        </div>
    );
};

export default InteractiveQuizBuilder;
