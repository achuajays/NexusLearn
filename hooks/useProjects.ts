import { useState, useEffect } from 'react';
import { Project, ProjectArtifact } from '../types.ts';

const PROJECTS_KEY = 'nexuslearn-projects';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        try {
            const storedProjects = localStorage.getItem(PROJECTS_KEY);
            setProjects(storedProjects ? JSON.parse(storedProjects) : []);
        } catch (e) {
            console.error("Failed to load projects:", e);
            setProjects([]);
        }
    }, []);

    const saveProjects = (updatedProjects: Project[]) => {
        setProjects(updatedProjects);
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    };

    const getProject = (projectId: string): (Project & { artifacts: ProjectArtifact[] }) | null => {
        const projectMeta = projects.find(p => p.id === projectId);
        if (!projectMeta) return null;

        try {
            const artifacts = localStorage.getItem(`nexuslearn-project-${projectId}`);
            return {
                ...projectMeta,
                artifacts: artifacts ? JSON.parse(artifacts) : [],
            };
        } catch (e) {
            console.error(`Failed to load project ${projectId}:`, e);
            return { ...projectMeta, artifacts: [] };
        }
    };

    const createProject = (name: string) => {
        const newProject: Project = {
            id: `proj_${new Date().getTime()}`,
            name,
            createdAt: new Date().toISOString(),
        };
        const updatedProjects = [...projects, newProject];
        saveProjects(updatedProjects);
        // Initialize an empty artifacts array for the new project
        localStorage.setItem(`nexuslearn-project-${newProject.id}`, JSON.stringify([]));
        return newProject;
    };
    
    const addArtifactToProject = (projectId: string, artifactData: Omit<ProjectArtifact, 'id' | 'createdAt'>) => {
        const project = getProject(projectId);
        if (!project) return;
        
        const newArtifact: ProjectArtifact = {
            ...artifactData,
            id: `art_${new Date().getTime()}`,
            createdAt: new Date().toISOString(),
        };

        const updatedArtifacts = [newArtifact, ...project.artifacts];
        localStorage.setItem(`nexuslearn-project-${projectId}`, JSON.stringify(updatedArtifacts));
    };

    return {
        projects,
        getProject,
        createProject,
        addArtifactToProject
    };
};
