
import React, { useEffect, useMemo } from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, QuizQuestion } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, ResultDisplay, Textarea } from '../components/AppComponents.tsx';

const QuizWhiz: React.FC = () => {
    const [topic, setTopic] = usePersistentState('quizwhiz-topic', '');
    const { data, isLoading, error, execute, setData } = useApi<QuizQuestion[]>('quizwhiz-result');
    const [quizState, setQuizState] = usePersistentState<'idle' | 'playing' | 'finished'>('quizwhiz-state', 'idle');
    const [currentQuestion, setCurrentQuestion] = usePersistentState('quizwhiz-currentq', 0);
    const [userAnswers, setUserAnswers] = usePersistentState<string[]>('quizwhiz-answers', []);
    
    useEffect(() => {
        // This effect triggers when a new quiz is successfully generated.
        if(data && data.length > 0 && quizState === 'idle') {
            setQuizState('playing');
            setCurrentQuestion(0);
            setUserAnswers([]);
        }
    }, [data, quizState, setQuizState, setCurrentQuestion, setUserAnswers]);

    const handleGenerateQuiz = () => {
        if (!topic.trim()) return;
        setQuizState('idle'); // Set state to idle to trigger the effect above upon success
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
        if (currentQuestion < (data?.length || 0) - 1) {
            setCurrentQuestion(currentQuestion + 1);
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