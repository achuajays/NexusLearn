import React, { createContext, useState, ReactNode } from 'react';
import { Project } from '../types.ts';

interface ProjectContextType {
    activeProject: Project | null;
    setActiveProject: (project: Project | null) => void;
}

export const ProjectContext = createContext<ProjectContextType>({
    activeProject: null,
    setActiveProject: () => {},
});

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeProject, setActiveProject] = useState<Project | null>(null);

    return (
        <ProjectContext.Provider value={{ activeProject, setActiveProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
