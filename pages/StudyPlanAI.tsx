import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Input, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const StudyPlanAI: React.FC = () => {
    const [examDate, setExamDate] = usePersistentState('studyplan-date', '');
    const [subjects, setSubjects] = usePersistentState('studyplan-subjects', '');
    const [weakTopics, setWeakTopics] = usePersistentState('studyplan-weattopics', '');
    const { data, isLoading, error, execute } = useApi<string>('studyplan-result');

    const handleSubmit = () => {
        if (!examDate || !subjects) return;
        const prompt = `Create a detailed study plan from today until the exam date, ${examDate}.
        Subjects to cover: ${subjects}.
        Prioritize these weak topics: ${weakTopics || 'None specified'}.
        Provide a weekly summary and a daily breakdown of tasks. The output should be in markdown format, with clear headings for weeks and days.`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="StudyPlan AI" description="Generate a personalized study schedule to ace your exams." />
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="exam-date" className="block text-sm font-medium text-slate-700 mb-1">Exam Date</label>
                        <Input id="exam-date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="subjects" className="block text-sm font-medium text-slate-700 mb-1">Subjects (comma-separated)</label>
                        <Input id="subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="e.g., Math, Physics, Chemistry" />
                    </div>
                </div>
                <div>
                    <label htmlFor="weak-topics" className="block text-sm font-medium text-slate-700 mb-1">Weak Topics (optional)</label>
                    <Textarea id="weak-topics" value={weakTopics} onChange={(e) => setWeakTopics(e.target.value)} placeholder="e.g., Calculus, Thermodynamics" rows={3} />
                </div>
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !examDate || !subjects}>{isLoading ? 'Building Plan...' : 'Generate Study Plan'}</Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay title="Your Personalized Study Plan" textToCopy={data}>
                     <pre className="whitespace-pre-wrap font-sans">{data}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default StudyPlanAI;
