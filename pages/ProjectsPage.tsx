import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useProjects } from '../hooks/useProjects.ts';
import { PageHeader, Button, Input } from '../components/AppComponents.tsx';
import { MaterialIcon } from '../components/Icons.tsx';

const ProjectsPage: React.FC = () => {
    const { projects, createProject } = useProjects();
    const [newProjectName, setNewProjectName] = useState('');
    const navigate = ReactRouterDOM.useNavigate();

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        const newProject = createProject(newProjectName);
        setNewProjectName('');
        navigate(`/projects/${newProject.id}`);
    };

    return (
        <div>
            <PageHeader title="Your Projects" description="Organize your work into separate projects to keep everything tidy." />
            
            <form onSubmit={handleCreateProject} className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Create a New Project</h3>
                <div className="flex space-x-2">
                    <Input 
                        value={newProjectName} 
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="e.g., History Research Paper, Biology Exam Prep" 
                        className="flex-grow"
                        required
                    />
                    <Button type="submit">
                        <MaterialIcon iconName="add" className="mr-2"/>
                        Create
                    </Button>
                </div>
            </form>

            <div className="space-y-4">
                {projects.length > 0 ? (
                    projects.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(project => (
                        <ReactRouterDOM.Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="group bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between"
                        >
                            <div>
                                <h4 className="font-semibold text-lg text-gray-800">{project.name}</h4>
                                <p className="text-sm text-gray-500">
                                    Created on: {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <MaterialIcon iconName="chevron_right" className="text-gray-400 group-hover:text-blue-500" />
                        </ReactRouterDOM.Link>
                    ))
                ) : (
                    <div className="text-center py-10 px-6 bg-gray-100 rounded-lg">
                        <MaterialIcon iconName="create_new_folder" className="text-5xl text-gray-400 mb-2" />
                        <h3 className="font-semibold text-xl text-gray-700">No projects yet!</h3>
                        <p className="text-gray-500">Create your first project above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;
