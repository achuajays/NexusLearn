import React from 'react';
import { useApi } from '../hooks/useApi.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';
import { Type, Mnemonic } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, Button, Textarea, ResultDisplay } from '../components/AppComponents.tsx';

const MnemonicMaker: React.FC = () => {
    const [items, setItems] = usePersistentState('mnemonicmaker-items', '');
    const { data, isLoading, error, execute } = useApi<Mnemonic>('mnemonicmaker-result');

    const handleSubmit = () => {
        if (!items.trim()) return;
        const prompt = `Create a mnemonic to remember the following list of items or concepts. Provide one of each type if possible: a creative acronym, a short, memorable story, and a simple rhyme.\n\nItems:\n"""${items}"""`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                acronym: { type: Type.STRING, description: "An acronym mnemonic." },
                story: { type: Type.STRING, description: "A short story mnemonic." },
                rhyme: { type: Type.STRING, description: "A rhyme or poem mnemonic." }
            },
        };
        execute({ contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
    };
    
    const formatResultForCopy = () => {
        if (!data) return "";
        let output = `Mnemonics for: ${items}\n\n`;
        if(data.acronym) output += `Acronym:\n${data.acronym}\n\n`;
        if(data.rhyme) output += `Rhyme:\n${data.rhyme}\n\n`;
        if(data.story) output += `Story:\n${data.story}\n\n`;
        return output;
    }


    return (
        <div>
            <PageHeader title="Mnemonic Maker" description="Create memory aids for any list of items or concepts." />
            <div className="space-y-4">
                <Textarea value={items} onChange={(e) => setItems(e.target.value)} rows={8} placeholder="Enter items to remember, each on a new line. e.g.,\nMercury\nVenus\nEarth\nMars..." />
                <div className="text-right">
                    <Button onClick={handleSubmit} disabled={isLoading || !items.trim()}>{isLoading ? 'Creating...' : 'Generate Mnemonics'}</Button>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {data && (
                <ResultDisplay title="Your Memory Aids" textToCopy={formatResultForCopy()}>
                    <div className="space-y-4">
                        {data.acronym && (
                            <details open><summary className="font-semibold text-lg cursor-pointer list-none group-hover:text-blue-600">Acronym</summary><p className="mt-2 pl-4">{data.acronym}</p></details>
                        )}
                        {data.rhyme && (
                            <details open><summary className="font-semibold text-lg cursor-pointer list-none group-hover:text-blue-600">Rhyme</summary><p className="mt-2 pl-4">{data.rhyme}</p></details>
                        )}
                        {data.story && (
                            <details open><summary className="font-semibold text-lg cursor-pointer list-none group-hover:text-blue-600">Story</summary><p className="mt-2 pl-4">{data.story}</p></details>
                        )}
                    </div>
                </ResultDisplay>
            )}
        </div>
    );
};

export default MnemonicMaker;
