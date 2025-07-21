

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Select } from '../components/AppComponents.tsx';

const ParentCommunicationAssistant: React.FC = () => {
    const [emailType, setEmailType] = usePersistentState('parentemail-type', 'Positive Update');
    const [notes, setNotes] = usePersistentState('parentemail-notes', '');
    const { data: email, isLoading, error, execute } = useApi<string>('parentemail-result');
    
    const placeholders: { [key: string]: string } = {
        'Positive Update': "Student: Alex\nClass: Science\nAchievement: Scored 95% on the recent exam, shows great curiosity.",
        'Behavioral Concern': "Student: Sam\nIssue: Has been consistently late to class this week.\nAction Taken: Spoke with Sam about the importance of punctuality.",
        'Missing Assignments': "Student: Jessica\nAssignments: Lab Report 3, Homework Week 5\nImpact: Grade has dropped by 10%.",
        'Upcoming Event': "Event: Parent-Teacher Conferences\nDate: November 15th\nTime: 4pm - 7pm\nLocation: School Gymnasium",
    };

    const handleSubmit = () => {
        if (!notes.trim()) return;
        const prompt = `You are a helpful teaching assistant. Draft a professional, clear, and supportive email to a student's parent/guardian. The goal of the email is: "${emailType}".
Use the following notes to personalize the email. Ensure the tone is appropriate for the situation.

Notes:
"""
${notes}
"""

Sign off as "The Teacher".`;
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Parent Communication Assistant" description="For Teachers: Draft professional emails to parents in seconds." />
            <div className="space-y-4">
                 <Select value={emailType} onChange={(e) => setEmailType(e.target.value)}>
                    <option>Positive Update</option>
                    <option>Behavioral Concern</option>
                    <option>Missing Assignments</option>
                    <option>Upcoming Event</option>
                </Select>
                <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    rows={8} 
                    placeholder={placeholders[emailType]}
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !notes.trim()}>
                        {isLoading ? 'Drafting...' : 'Draft Email'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {email && (
                <ResultDisplay
                    title={`Draft Email: ${emailType}`}
                    textToCopy={email}
                    toolId="parent-communication-assistant"
                    resultData={email}
                >
                    <pre className="whitespace-pre-wrap font-sans">{email}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default ParentCommunicationAssistant;