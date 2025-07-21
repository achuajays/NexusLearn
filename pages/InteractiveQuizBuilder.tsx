

import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, InteractiveQuizItem, MCQQuizItem, RemediationPayload, QuizQuestion } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const InteractiveQuizBuilder: React.FC = () => {
    const [concept, setConcept] = usePersistentState('interactivequiz-concept', '');
    const { data, isLoading, error, execute, setData } = useApi<InteractiveQuizItem[]>('interactivequiz-result');
    const { data: remediationData, isLoading: isRemediating, error: remediationError, execute: executeRemediation, setData: setRemediationData } = useApi<RemediationPayload>();

    const [quizState, setQuizState] = usePersistentState<'idle' | 'playing' | 'remediating' | 'finished'>('interactivequiz-state', 'idle');
    const [currentQuestion, setCurrentQuestion] = usePersistentState('interactivequiz-currentq', 0);
    const [userAnswers, setUserAnswers] = usePersistentState<string[]>('interactivequiz-answers', []);
    const [followUpAnswered, setFollowUpAnswered] = useState<{ answered: boolean; correct: boolean; answer: string; } | null>(null);
    
    useEffect(() => {
        if (data && data.length > 0 && quizState === 'idle') {
            setQuizState('playing');
            setCurrentQuestion(0);
            setUserAnswers([]);
        }
    }, [data, quizState, setQuizState, setCurrentQuestion, setUserAnswers]);

    const handleGenerateQuiz = () => {
        if (!concept.trim()) return;
        resetQuiz();
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
        
        const q = data![currentQuestion];
        const isCorrect = q.answer.toLowerCase() === answer.toLowerCase();

        if (isCorrect) {
            if (currentQuestion < (data?.length || 0) - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                setQuizState('finished');
            }
        } else {
            setQuizState('remediating');
            const prompt = `You are an expert adaptive tutor. A student is taking a quiz on the topic "${concept}". They have answered a question incorrectly. Your task is to help them understand their mistake and learn the concept.

            Here is the information:
            - Question Type: "${q.type}"
            - Original Question: "${q.question}"
            - Student's Incorrect Answer: "${answer}"
            - Correct Answer: "${q.answer}"

            Please generate the following in a JSON format:
            1.  "diagnosis": A gentle, encouraging explanation of the likely misconception behind the student's error. Explain *why* their answer is wrong.
            2.  "microLesson": A concise, easy-to-understand "micro-lesson" that clarifies the core concept tested in the question.
            3.  "followUpQuestion": A new, slightly different **multiple-choice question** to check if the student has understood the micro-lesson. This new question must include the question text, 4 options, the correct answer, and a difficulty of "Easy".

            Return only the JSON object.`;
            
            const remediationSchema = {
                type: Type.OBJECT,
                properties: {
                    diagnosis: { type: Type.STRING },
                    microLesson: { type: Type.STRING },
                    followUpQuestion: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            answer: { type: Type.STRING },
                            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
                        },
                        required: ["question", "options", "answer", "difficulty"]
                    }
                },
                required: ["diagnosis", "microLesson", "followUpQuestion"]
            };
            executeRemediation({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: remediationSchema } });
        }
    };
    
    const handleFollowUpAnswer = (answer: string) => {
        if (!remediationData) return;
        const isCorrect = remediationData.followUpQuestion.answer === answer;
        setFollowUpAnswered({ answered: true, correct: isCorrect, answer });
    };

    const handleProceedAfterRemediation = () => {
        setRemediationData(null);
        setFollowUpAnswered(null);

        if (currentQuestion < (data?.length || 0) - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setQuizState('playing');
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
        setRemediationData(null);
        setFollowUpAnswered(null);
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
    
    // --- RENDER LOGIC ---

    if (quizState === 'remediating') {
        return (
            <div>
                <PageHeader title="Adaptive Tutor" description="Let's take a moment to review this concept." />
                {isRemediating && <Loader />}
                {remediationError && <ErrorDisplay message={remediationError} />}
                {remediationData && (
                    <div className="space-y-6">
                        {/* Diagnosis */}
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                            <h3 className="font-bold text-lg text-yellow-800 flex items-center"><MaterialIcon iconName="lightbulb" className="mr-2" />Let's see...</h3>
                            <p className="mt-2 text-yellow-700">{remediationData.diagnosis}</p>
                        </div>
                        {/* MicroLesson */}
                        <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                            <h3 className="font-bold text-lg text-blue-800 flex items-center"><MaterialIcon iconName="menu_book" className="mr-2" />Quick Lesson</h3>
                            <p className="mt-2 text-blue-700">{remediationData.microLesson}</p>
                        </div>
                         {/* Follow-up Question */}
                        <div className="p-4 bg-green-50 border-l-4 border-green-400">
                            <h3 className="font-bold text-lg text-green-800 flex items-center"><MaterialIcon iconName="quiz" className="mr-2" />Try this one!</h3>
                            <p className="mt-4 mb-4 text-green-900 font-semibold">{remediationData.followUpQuestion.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {remediationData.followUpQuestion.options.map(option => {
                                    const isCorrectAnswer = option === remediationData.followUpQuestion.answer;
                                    const isSelectedAnswer = followUpAnswered?.answer === option;
                                    let buttonClass = 'w-full text-left p-3 rounded-lg bg-white hover:bg-green-100 border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-green-400';
                                    if(followUpAnswered?.answered) {
                                        if(isCorrectAnswer) buttonClass = 'w-full text-left p-3 rounded-lg bg-green-200 border-green-400 text-green-900 font-bold';
                                        else if (isSelectedAnswer) buttonClass = 'w-full text-left p-3 rounded-lg bg-red-200 border-red-400 text-red-900';
                                        else buttonClass += ' opacity-60';
                                    }

                                    return (
                                        <button key={option} onClick={() => handleFollowUpAnswer(option)} disabled={followUpAnswered?.answered} className={buttonClass}>
                                            {option}
                                        </button>
                                    )
                                })}
                            </div>
                            {followUpAnswered?.answered && (
                                <div className="mt-6 text-center">
                                    <Button onClick={handleProceedAfterRemediation}>Continue Quiz</Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
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