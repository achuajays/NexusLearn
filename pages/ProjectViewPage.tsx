import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ProjectContext } from '../contexts/ProjectContext.tsx';
import { useProjects } from '../hooks/useProjects.ts';
import { Project, ProjectArtifact } from '../types.ts';
import { PageHeader, Loader, ErrorDisplay, CopyButton, Button } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';
import { TOOLS } from '../constants.ts';

const ArtifactCard: React.FC<{ artifact: ProjectArtifact }> = ({ artifact }) => {
    const toolInfo = TOOLS.find(t => t.id === artifact.toolId);
    
    // A simple way to format various data types for display
    const formattedData = typeof artifact.data === 'string' 
        ? artifact.data 
        : JSON.stringify(artifact.data, null, 2);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                    <MaterialIcon iconName={toolInfo?.icon || 'note'} className="text-blue-500 text-2xl" />
                    <div>
                        <h3 className="font-bold text-gray-800">{toolInfo?.title || artifact.toolId}</h3>
                        <p className="text-xs text-gray-500">{new Date(artifact.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <CopyButton textToCopy={formattedData} />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
                    {formattedData}
                </pre>
            </div>
        </div>
    );
};


const ProjectViewPage: React.FC = () => {
    const { projectId } = ReactRouterDOM.useParams<{ projectId: string }>();
    const { getProject } = useProjects();
    const { setActiveProject } = React.useContext(ProjectContext);
    
    const [projectData, setProjectData] = useState<(Project & { artifacts: ProjectArtifact[] }) | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (projectId) {
            const data = getProject(projectId);
            setProjectData(data);
            setActiveProject(data); // Set the active project in the context
            setIsLoading(false);
        }
        
        // Cleanup function to reset active project when leaving the page
        return () => {
            setActiveProject(null);
        };
    }, [projectId, getProject, setActiveProject]);

    if (isLoading) {
        return <Loader />;
    }

    if (!projectData) {
        return <ErrorDisplay message={`Project with ID "${projectId}" not found.`} />;
    }

    return (
        <div>
            <PageHeader 
                title={
                    <div className="flex items-center gap-3">
                        <MaterialIcon iconName="folder_open" className="text-3xl text-gray-400" />
                        <span>{projectData.name}</span>
                    </div>
                } 
                description={`A workspace to keep all your work for this project in one place.`} 
            />

            <div className="space-y-6">
                {projectData.artifacts && projectData.artifacts.length > 0 ? (
                    projectData.artifacts.map(artifact => (
                        <ArtifactCard key={artifact.id} artifact={artifact} />
                    ))
                ) : (
                    <div className="text-center py-16 px-6 bg-gray-100 rounded-lg">
                        <MaterialIcon iconName="add_to_photos" className="text-6xl text-gray-400 mb-4" />
                        <h3 className="font-semibold text-2xl text-gray-700">Your workspace is empty.</h3>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                            Navigate to any tool, generate a result, and click the "Save to Project" button to add your first item here.
                        </p>
                         <ReactRouterDOM.Link to="/dashboard" className="mt-6 inline-block">
                            <Button>
                                <MaterialIcon iconName="widgets" className="mr-2" />
                                Go to Tools
                            </Button>
                        </ReactRouterDOM.Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectViewPage;