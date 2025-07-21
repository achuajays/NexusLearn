

import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, QuizQuestion, RemediationPayload } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, ResultDisplay, Textarea } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const QuizWhiz: React.FC = () => {
    const [topic, setTopic] = usePersistentState('quizwhiz-topic', '');
    const { data, isLoading, error, execute, setData } = useApi<QuizQuestion[]>('quizwhiz-result');
    const { data: remediationData, isLoading: isRemediating, error: remediationError, execute: executeRemediation, setData: setRemediationData } = useApi<RemediationPayload>();
    
    const [quizState, setQuizState] = usePersistentState<'idle' | 'playing' | 'remediating' | 'finished'>('quizwhiz-state', 'idle');
    const [currentQuestion, setCurrentQuestion] = usePersistentState('quizwhiz-currentq', 0);
    const [userAnswers, setUserAnswers] = usePersistentState<string[]>('quizwhiz-answers', []);
    const [followUpAnswered, setFollowUpAnswered] = useState<{ answered: boolean; correct: boolean; answer: string } | null>(null);

    useEffect(() => {
        if(data && data.length > 0 && quizState === 'idle') {
            setQuizState('playing');
            setCurrentQuestion(0);
            setUserAnswers([]);
        }
    }, [data, quizState, setQuizState, setCurrentQuestion, setUserAnswers]);

    const handleGenerateQuiz = () => {
        if (!topic.trim()) return;
        resetQuiz();
        const prompt = `Generate a 5-question multiple-choice quiz on the topic: "${topic}". For each question, provide the question text, 4 options, the correct answer, and a difficulty level (Easy, Medium, or Hard). Ensure the options are distinct and plausible.`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answer: { type: Type.STRING },
                    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
                },
                required: ["question", "options", "answer", "difficulty"]
            }
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const handleAnswer = (answer: string) => {
        const newAnswers = [...userAnswers, answer];
        setUserAnswers(newAnswers);
        
        const isCorrect = data && data[currentQuestion].answer === answer;

        if (isCorrect) {
            if (currentQuestion < (data?.length || 0) - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                setQuizState('finished');
            }
        } else {
            setQuizState('remediating');
            const currentQ = data![currentQuestion];
            const prompt = `You are an expert adaptive tutor. A student is taking a quiz on the topic "${topic}". They have answered a question incorrectly. Your task is to help them understand their mistake and learn the concept.

            Here is the information:
            - Original Question: "${currentQ.question}"
            - Student's Incorrect Answer: "${answer}"
            - Correct Answer: "${currentQ.answer}"

            Please generate the following in a JSON format:
            1.  "diagnosis": A gentle, encouraging explanation of the likely misconception behind the student's error. Explain *why* their answer is wrong.
            2.  "microLesson": A concise, easy-to-understand "micro-lesson" that clarifies the core concept tested in the question.
            3.  "followUpQuestion": A new, slightly different multiple-choice question to check if the student has understood the micro-lesson. This new question must include the question text, 4 options, the correct answer, and a difficulty of "Easy".

            Return only the JSON object.`;

            const schema = {
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

            executeRemediation({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
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
        return userAnswers.reduce((acc, answer, index) => {
            return data[index] && answer === data[index].answer ? acc + 1 : acc;
        }, 0);
    }, [userAnswers, data]);

    const resetQuiz = () => {
        setQuizState('idle');
        setCurrentQuestion(0);
        setUserAnswers([]);
        setData(null);
        setTopic('');
        setRemediationData(null);
        setFollowUpAnswered(null);
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
                    <div className="flex justify-between items-start mb-4 gap-4">
                        <p className="text-lg font-semibold">{q.question}</p>
                        <span className={`flex-shrink-0 px-2 py-1 text-xs font-semibold rounded-full ${q.difficulty === 'Easy' ? 'bg-blue-100 text-blue-800' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'}`}>{q.difficulty}</span>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {q.options.map(option => (
                             <button key={option} onClick={() => handleAnswer(option)}
                                 className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400">
                                 {option}
                             </button>
                         ))}
                     </div>
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
                    <div key={index} className={`p-4 rounded-lg border ${userAnswers[index] === q.answer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className="font-semibold">{q.question}</p>
                        <p className={`text-sm ${userAnswers[index] === q.answer ? 'text-green-700' : 'text-red-700'}`}>Your answer: <span className="font-medium">{userAnswers[index]}</span></p>
                        {userAnswers[index] !== q.answer && <p className="text-sm text-green-700">Correct answer: <span className="font-medium">{q.answer}</span></p>}
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
            <PageHeader title="QuizWhiz" description="Generate a multiple-choice quiz on any topic or from your notes." />
            <div className="space-y-4">
                <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={8} placeholder="Enter a topic (e.g., The Solar System) or paste a block of text from your notes here..." />
                <div className="text-right">
                    <Button onClick={handleGenerateQuiz} disabled={isLoading || !topic.trim()}>{isLoading ? 'Generating...' : 'Start Quiz'}</Button>
                </div>
            </div>
             {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
        </div>
    );
};

export default QuizWhiz;