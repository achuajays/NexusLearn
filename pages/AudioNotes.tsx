
import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, AudioNotes as AudioNotesType } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, ResultDisplay, CopyButton } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const AudioNotes: React.FC = () => {
    const { data: notes, isLoading: isApiLoading, error: apiError, execute: executeSummarize, setData: setNotesData } = useApi<AudioNotesType>('audionotes-result');
    
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = usePersistentState('audionotes-transcript', '');
    const [processingState, setProcessingState] = useState<'idle' | 'transcribing' | 'summarizing'>('idle');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const TRANSCRIPTION_API_URL = 'https://aiapi-production-e072.up.railway.app/speechtotext/speechtotext/transcribe-audio/';

    const resetState = () => {
        setNotesData(null);
        setTranscript('');
        setError(null);
        setSelectedFile(null);
        audioChunksRef.current = [];
    }

    const transcribeAudio = async (audioFile: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', audioFile, audioFile.name);

        const response = await fetch(TRANSCRIPTION_API_URL, {
            method: 'POST',
            body: formData,
            headers: { 'accept': 'application/json' },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Transcription API Error:', errorBody);
            throw new Error('Failed to transcribe audio. The server returned an error.');
        }

        const result = await response.json();
        if (!result.text) {
             throw new Error('Transcription successful, but no text was returned.');
        }
        return result.text;
    };

    const summarizeTranscript = async (finalTranscript: string) => {
        if (!finalTranscript.trim()) return;
        
        const prompt = `Analyze the following transcript from an audio recording. Provide a concise summary, a bulleted list of key points, and a list of any action items mentioned. If no action items are found, return an empty array for actionItems.\n\nTRANSCRIPT:\n"""${finalTranscript}"""`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: "A concise summary of the transcript." },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the main points or topics discussed." },
                actionItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of specific tasks or actions to be taken." }
            },
            required: ["summary", "keyPoints", "actionItems"]
        };
        await executeSummarize({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };

    const processAudioFile = async (file: File) => {
        resetState();
        try {
            setProcessingState('transcribing');
            const fullTranscript = await transcribeAudio(file);
            setTranscript(fullTranscript);

            setProcessingState('summarizing');
            await summarizeTranscript(fullTranscript);

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during processing.');
        } finally {
            setProcessingState('idle');
            setSelectedFile(null);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            processAudioFile(file);
            // Reset the input value to allow uploading the same file again
            event.target.value = '';
        }
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    resetState();
                    setIsRecording(true);
                    
                    const options = { mimeType: 'video/webm' };
                    mediaRecorderRef.current = new MediaRecorder(stream, options);
                    
                    mediaRecorderRef.current.ondataavailable = (event) => {
                        audioChunksRef.current.push(event.data);
                    };

                    mediaRecorderRef.current.onstop = () => {
                        setIsRecording(false);
                        const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
                        const audioFile = new File([audioBlob], "recording.webm", { type: options.mimeType });
                        processAudioFile(audioFile);
                        stream.getTracks().forEach(track => track.stop()); // Release microphone
                    };
                    
                    mediaRecorderRef.current.start();
                })
                .catch(err => {
                    console.error("Error accessing microphone:", err);
                    setError("Could not access the microphone. Please grant permission and try again.");
                });
        }
    };
    
    useEffect(() => {
        return () => { mediaRecorderRef.current?.stop(); };
    }, []);
    
    const isLoading = processingState !== 'idle';

    const formatResultForCopy = () => {
        if (!notes) return "";
        let output = `Summary:\n${notes.summary}\n\n`;
        output += `Key Points:\n${notes.keyPoints.map(p => `- ${p}`).join('\n')}\n\n`;
        if (notes.actionItems && notes.actionItems.length > 0) {
            output += `Action Items:\n${notes.actionItems.map(a => `- ${a}`).join('\n')}\n\n`;
        }
        return output;
    };
    
    const getLoadingMessage = () => {
        if (processingState === 'transcribing') return 'Transcribing audio...';
        if (processingState === 'summarizing') return 'Generating notes...';
        return 'Processing...';
    }

    return (
        <div>
            <PageHeader title="Audio Notes" description="Record audio or upload a file to get an AI-generated transcript and summary." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {/* Recording Section */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center border-r-0 md:border-r md:pr-8 border-gray-200">
                    <h3 className="text-xl font-semibold">Record Audio</h3>
                    <p className="text-gray-500 text-sm h-10">Click the button below to start and stop recording.</p>
                    <Button 
                        onClick={handleToggleRecording} 
                        disabled={isLoading}
                        className={`flex items-center justify-center w-52 h-16 rounded-full text-lg shadow-lg transform transition-transform hover:scale-105 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        <MaterialIcon iconName={isRecording ? 'stop' : 'mic'} className="mr-2 text-2xl" />
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                    {isRecording && (
                        <div className="flex items-center text-blue-500 h-6">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                            Listening...
                        </div>
                    )}
                     {!isRecording && <div className="h-6"></div>}
                </div>

                {/* Upload Section */}
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <h3 className="text-xl font-semibold">Upload a File</h3>
                    <p className="text-gray-500 text-sm h-10">Or, upload an existing audio or video file to be transcribed.</p>
                    <label htmlFor="audio-upload" className={`inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-52 h-16 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                         <MaterialIcon iconName="upload_file" className="mr-2" />
                         Choose File
                    </label>
                    <input id="audio-upload" type="file" className="hidden" onChange={handleFileChange} accept="audio/*,video/*" disabled={isLoading}/>
                    <div className="text-sm text-gray-500 h-6 truncate max-w-full px-4">
                        {selectedFile && `Processing: ${selectedFile.name}`}
                    </div>
                 </div>
            </div>

            {isLoading && <div className="text-center py-8"><Loader /><p className="mt-2 text-gray-600">{getLoadingMessage()}</p></div>}
            
            {(error || apiError) && <ErrorDisplay message={error || apiError || 'An unknown error occurred.'} />}

            {transcript && !notes && !isLoading && !error && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Transcript</h3>
                        <CopyButton textToCopy={transcript} />
                    </div>
                    <p>{transcript}</p>
                </div>
            )}
            
            {notes && (
                 <ResultDisplay title="Your AI-Generated Notes" textToCopy={formatResultForCopy()}>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Summary</h4>
                            <p className="mt-1">{notes.summary}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-700">Key Points</h4>
                            <ul className="mt-2 pl-4 list-disc list-inside space-y-1">
                                {notes.keyPoints.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        {notes.actionItems && notes.actionItems.length > 0 && (
                            <div>
                                <h4 className="font-bold text-lg text-slate-700">Action Items</h4>
                                <ul className="mt-2 pl-4 list-disc list-inside space-y-1">
                                    {notes.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        )}
                         <div className="pt-4 mt-4 border-t">
                            <details>
                                <summary className="font-semibold cursor-pointer hover:text-blue-600">View Full Transcript</summary>
                                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{transcript}</p>
                            </details>
                         </div>
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default AudioNotes;
