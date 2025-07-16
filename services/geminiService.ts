
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants.ts';

interface GeminiRequestParams {
    contents: string;
    config?: {
        responseMimeType?: string;
        responseSchema?: any;
    };
}

export const callGeminiApi = async (params: GeminiRequestParams): Promise<any> => {
    const functionName = 'gemini';
    
    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Request failed with status ' + response.status }));
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (params.config?.responseMimeType === 'application/json') {
            try {
                // The AI's JSON output is stringified in the 'text' property
                return JSON.parse(data.text);
            } catch (e) {
                console.error("Failed to parse JSON response:", data.text, e);
                throw new Error("The AI returned an invalid format. Please try again.");
            }
        }
        
        return data.text; // Return plain text if not expecting JSON
    } catch (error: any) {
        console.error('Error calling Supabase function:', error);
        throw new Error(error.message || 'An unknown error occurred.');
    }
};