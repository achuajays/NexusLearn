

import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay, Input, Select } from '../components/AppComponents.tsx';

const InternshipEmailAssistant: React.FC = () => {
    const [emailType, setEmailType] = usePersistentState('email-type', 'Application');
    const [details, setDetails] = usePersistentState('email-details', '');
    const { data: email, isLoading, error, execute } = useApi<string>('email-result');
    
    const placeholders = {
        'Application': "Job Title: Software Engineer Intern\nCompany: ExampleTech\nMy Key Skills: Java, Python, Team Projects",
        'Follow-up': "Interviewer Name: Jane Doe\nJob Title: Marketing Intern\nSomething We Discussed: The new social media campaign",
        'Informational Interview': "Person's Name: John Smith\nTheir Company: Innovate Inc.\nTheir Role: Senior Data Analyst\nHow I found them: University Alumni Network",
    }

    const handleSubmit = () => {
        if (!details.trim()) return;
        let prompt;
        switch(emailType) {
            case 'Application':
                prompt = `You are a career coach. Write a professional and enthusiastic cover letter email for an internship application. Use the following details. Keep it concise.
Details:
${details}`;
                break;
            case 'Follow-up':
                prompt = `You are a career coach. Write a polite and professional follow-up email after an interview. Mention a specific point from the conversation to make it memorable.
Details:
${details}`;
                break;
            case 'Informational Interview':
                 prompt = `You are a career coach. Write a polite and concise email requesting a brief informational interview (15-20 minutes) with a professional.
Details:
${details}`;
                break;
            default: return;
        }
        execute({ contents: prompt });
    };

    return (
        <div>
            <PageHeader title="Internship Email Assistant" description="Draft professional emails for applications, follow-ups, and networking." />
            <div className="space-y-4">
                 <Select value={emailType} onChange={(e) => setEmailType(e.target.value)}>
                    <option value="Application">Internship Application</option>
                    <option value="Follow-up">Interview Follow-up</option>
                    <option value="Informational Interview">Informational Interview Request</option>
                </Select>
                <Textarea 
                    value={details} 
                    onChange={(e) => setDetails(e.target.value)} 
                    rows={8} 
                    placeholder={placeholders[emailType as keyof typeof placeholders]}
                />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !details.trim()}>
                        {isLoading ? 'Drafting...' : 'Draft Email'}
                    </Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {email && (
                <ResultDisplay
                    title={`Draft: ${emailType} Email`}
                    textToCopy={email}
                    toolId="internship-email-assistant"
                    resultData={email}
                >
                    <pre className="whitespace-pre-wrap font-sans">{email}</pre>
                </ResultDisplay>
            )}
        </div>
    );
};

export default InternshipEmailAssistant;