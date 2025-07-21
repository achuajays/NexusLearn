

import React, { useState, useRef, useEffect } from 'react';
import { useApi } from '../hooks/useApi.ts';
import { PresentationRehearsalFeedback } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, ResultDisplay } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const PresentationRehearsalCoach: React.FC = () => {
    const [isRehearsing, setIsRehearsing] = useState(false);
    const [feedback, setFeedback] = useState<PresentationRehearsalFeedback | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [interimTranscript, setInterimTranscript] = useState('');
    const { isLoading: isAiLoading, error: aiError, execute: getAiFeedback } = useApi<string>();

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const startTimeRef = useRef<number>(0);
    const finalTranscriptRef = useRef<string>('');
    
    const fillerWordsList = ['like', 'um', 'uh', 'er', 'ah', 'so', 'you know', 'basically', 'actually', 'literally'];

    const handleToggleRehearsal = () => {
        if (isRehearsing) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setError("Speech Recognition API is not supported in this browser.");
            return;
        }

        setFeedback(null);
        setError(null);
        finalTranscriptRef.current = '';
        setInterimTranscript('');

        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
            setIsRehearsing(true);
            startTimeRef.current = Date.now();
        };

        recognitionRef.current.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            finalTranscriptRef.current += final;
            setInterimTranscript(interim);
        };

        recognitionRef.current.onend = () => {
            setIsRehearsing(false);
            processResults();
        };

        recognitionRef.current.onerror = (event) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsRehearsing(false);
        };

        recognitionRef.current.start();
    };
    
    const processResults = async () => {
        const endTime = Date.now();
        const durationSeconds = (endTime - startTimeRef.current) / 1000;
        const fullTranscript = finalTranscriptRef.current;

        if (durationSeconds < 1 || !fullTranscript.trim()) {
            setError("Not enough speech was detected to provide feedback.");
            return;
        }
        
        const words = fullTranscript.toLowerCase().split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const wordsPerMinute = Math.round((wordCount / durationSeconds) * 60);

        const foundFillers = words.reduce((acc, word) => {
            if (fillerWordsList.includes(word)) {
                const existing = acc.find(item => item.word === word);
                if (existing) {
                    existing.count++;
                } else {
                    acc.push({ word: word, count: 1 });
                }
            }
            return acc;
        }, [] as { word: string, count: number }[]);

        const prompt = `You are a public speaking coach. A student has just rehearsed a presentation. Here is the transcript. Provide constructive, encouraging feedback on its clarity, tone, and flow. Suggest specific areas for improvement.

Transcript:
"""
${fullTranscript}
"""`;
        
        try {
            const qualitativeFeedback = await getAiFeedback({ contents: prompt });
            const generatedFeedback = {
                transcript: fullTranscript,
                wordCount,
                durationSeconds: Math.round(durationSeconds),
                wordsPerMinute,
                fillerWords: foundFillers,
                qualitativeFeedback,
            };
            setFeedback(generatedFeedback);
        } catch(e) {
            console.error(e);
        }
    }
    
    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    return (
        <div>
            <PageHeader title="Presentation Rehearsal Coach" description="Practice your speech and get instant feedback on your delivery." />
            
            <div className="text-center p-6 bg-white rounded-lg border shadow-sm">
                 <Button onClick={handleToggleRehearsal} disabled={isAiLoading}
                    className={`w-64 h-20 text-xl rounded-full shadow-lg transform transition-transform hover:scale-105 ${isRehearsing ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    <MaterialIcon iconName={isRehearsing ? 'stop_circle' : 'mic'} className="mr-3 text-3xl" />
                    {isRehearsing ? 'Stop Rehearsal' : 'Start Rehearsal'}
                </Button>
                <div className="mt-4 h-8 text-gray-500">
                    {isRehearsing && `Rehearsing... ${interimTranscript}`}
                    {isAiLoading && <p>Analyzing your speech...</p>}
                </div>
            </div>

            {(error || aiError) && <ErrorDisplay message={error || aiError || 'An error occurred'} />}
            
            {feedback && (
                <ResultDisplay
                    title="Your Rehearsal Feedback"
                    textToCopy={feedback.qualitativeFeedback}
                    toolId="presentation-rehearsal-coach"
                    resultData={feedback}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
                        <div className="p-4 bg-slate-100 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">{feedback.wordsPerMinute}</p>
                            <p className="text-sm text-slate-600">Words per Minute</p>
                        </div>
                        <div className="p-4 bg-slate-100 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">{feedback.wordCount}</p>
                            <p className="text-sm text-slate-600">Total Words</p>
                        </div>
                        <div className="p-4 bg-slate-100 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">{feedback.durationSeconds}s</p>
                            <p className="text-sm text-slate-600">Duration</p>
                        </div>
                         <div className="p-4 bg-slate-100 rounded-lg">
                            <p className="text-3xl font-bold text-red-500">{feedback.fillerWords.reduce((a, b) => a + b.count, 0)}</p>
                            <p className="text-sm text-slate-600">Filler Words</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">AI Speech Coach</h4>
                            <p className="mt-1">{feedback.qualitativeFeedback}</p>
                        </div>
                         {feedback.fillerWords.length > 0 && (
                            <div>
                                <h4 className="font-bold text-lg text-slate-700">Filler Words Detected</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {feedback.fillerWords.map(fw => <span key={fw.word} className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{fw.word} ({fw.count})</span>)}
                                </div>
                            </div>
                        )}
                        <details className="pt-4 border-t">
                            <summary className="font-semibold cursor-pointer hover:text-blue-600">View Full Transcript</summary>
                            <p className="mt-2 text-gray-600 whitespace-pre-wrap">{feedback.transcript}</p>
                        </details>
                    </div>
                </ResultDisplay>
            )}

        </div>
    );
};

export default PresentationRehearsalCoach;