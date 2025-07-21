

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import SmartNotes from './pages/SmartNotes.tsx';
import AudioNotes from './pages/AudioNotes.tsx';
import EssayBuddy from './pages/EssayBuddy.tsx';
import ConceptCracker from './pages/ConceptCracker.tsx';
import LabHelper from './pages/LabHelper.tsx';
import CourseOutliner from './pages/CourseOutliner.tsx';
import DoubtBot from './pages/DoubtBot.tsx';
import QuizWhiz from './pages/QuizWhiz.tsx';
import StudyPlanAI from './pages/StudyPlanAI.tsx';
import TextbookBuddy from './pages/TextbookBuddy.tsx';
import MnemonicMaker from './pages/MnemonicMaker.tsx';
import CodeExplainer from './pages/CodeExplainer.tsx';
import ResumeRewriter from './pages/ResumeRewriter.tsx';
import ScholarshipCoach from './pages/ScholarshipCoach.tsx';
import PresentationGenerator from './pages/PresentationGenerator.tsx';
import LearningConverter from './pages/LearningConverter.tsx';
import AnxietyCoach from './pages/AnxietyCoach.tsx';
import AssignmentFormatter from './pages/AssignmentFormatter.tsx';
import DailyLearner from './pages/DailyLearner.tsx';
import CareerMapper from './pages/CareerMapper.tsx';
import DebateAssistant from './pages/DebateAssistant.tsx';
import KeywordExtractor from './pages/KeywordExtractor.tsx';
import TimeEstimator from './pages/TimeEstimator.tsx';
import FlashcardGenerator from './pages/FlashcardGenerator.tsx';
import IcebreakerPrompter from './pages/IcebreakerPrompter.tsx';
import DiscussionAssistant from './pages/DiscussionAssistant.tsx';
import TextSimplifier from './pages/TextSimplifier.tsx';
import CriticalThinkingBooster from './pages/CriticalThinkingBooster.tsx';
import ReportCardGenerator from './pages/ReportCardGenerator.tsx';
import InteractiveQuizBuilder from './pages/InteractiveQuizBuilder.tsx';
import DataStoryteller from './pages/DataStoryteller.tsx';
import MultiDocSynthesizer from './pages/MultiDocSynthesizer.tsx';
import GroupProjectCoordinator from './pages/GroupProjectCoordinator.tsx';
import MathMentor from './pages/MathMentor.tsx';
import HistoricalContextBot from './pages/HistoricalContextBot.tsx';
import SourceCredibilityChecker from './pages/SourceCredibilityChecker.tsx';
import AnalogyGenerator from './pages/AnalogyGenerator.tsx';
import EthicalDilemmaExplorer from './pages/EthicalDilemmaExplorer.tsx';
import ProjectBrainstormer from './pages/ProjectBrainstormer.tsx';
import LiteraryDeviceFinder from './pages/LiteraryDeviceFinder.tsx';
import InternshipEmailAssistant from './pages/InternshipEmailAssistant.tsx';
import CitationWizard from './pages/CitationWizard.tsx';
import FocusSprintPlanner from './pages/FocusSprintPlanner.tsx';
import VisualDataInterpreter from './pages/VisualDataInterpreter.tsx';
import PresentationRehearsalCoach from './pages/PresentationRehearsalCoach.tsx';
import AssignmentDeconstructor from './pages/AssignmentDeconstructor.tsx';
import RubricBuilder from './pages/RubricBuilder.tsx';
import LessonPlanVariator from './pages/LessonPlanVariator.tsx';
import StudentMisconceptionSpotter from './pages/StudentMisconceptionSpotter.tsx';
import DifferentiatedTextGenerator from './pages/DifferentiatedTextGenerator.tsx';
import ParentCommunicationAssistant from './pages/ParentCommunicationAssistant.tsx';

// --- New Project Features ---
import { ProjectProvider } from './contexts/ProjectContext.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import ProjectViewPage from './pages/ProjectViewPage.tsx';


const App: React.FC = () => {
    return (
        <ProjectProvider>
            <ReactRouterDOM.HashRouter>
                <ReactRouterDOM.Routes>
                    <ReactRouterDOM.Route path="/" element={<HomePage />} />
                    <ReactRouterDOM.Route path="/" element={<Layout />}>
                        <ReactRouterDOM.Route path="dashboard" element={<Dashboard />} />
                        <ReactRouterDOM.Route path="projects" element={<ProjectsPage />} />
                        <ReactRouterDOM.Route path="projects/:projectId" element={<ProjectViewPage />} />

                        {/* --- Tool Routes --- */}
                        <ReactRouterDOM.Route path="smart-notes" element={<SmartNotes />} />
                        <ReactRouterDOM.Route path="audio-notes" element={<AudioNotes />} />
                        <ReactRouterDOM.Route path="essay-buddy" element={<EssayBuddy />} />
                        <ReactRouterDOM.Route path="concept-cracker" element={<ConceptCracker />} />
                        <ReactRouterDOM.Route path="lab-helper" element={<LabHelper />} />
                        <ReactRouterDOM.Route path="course-outliner" element={<CourseOutliner />} />
                        <ReactRouterDOM.Route path="doubt-bot" element={<DoubtBot />} />
                        <ReactRouterDOM.Route path="quiz-whiz" element={<QuizWhiz />} />
                        <ReactRouterDOM.Route path="study-plan-ai" element={<StudyPlanAI />} />
                        <ReactRouterDOM.Route path="textbook-buddy" element={<TextbookBuddy />} />
                        <ReactRouterDOM.Route path="mnemonic-maker" element={<MnemonicMaker />} />
                        <ReactRouterDOM.Route path="code-explainer" element={<CodeExplainer />} />
                        <ReactRouterDOM.Route path="resume-rewriter" element={<ResumeRewriter />} />
                        <ReactRouterDOM.Route path="scholarship-coach" element={<ScholarshipCoach />} />
                        <ReactRouterDOM.Route path="presentation-generator" element={<PresentationGenerator />} />
                        <ReactRouterDOM.Route path="learning-converter" element={<LearningConverter />} />
                        <ReactRouterDOM.Route path="anxiety-coach" element={<AnxietyCoach />} />
                        <ReactRouterDOM.Route path="assignment-formatter" element={<AssignmentFormatter />} />
                        <ReactRouterDOM.Route path="daily-learner" element={<DailyLearner />} />
                        <ReactRouterDOM.Route path="career-mapper" element={<CareerMapper />} />
                        <ReactRouterDOM.Route path="debate-assistant" element={<DebateAssistant />} />
                        <ReactRouterDOM.Route path="keyword-extractor" element={<KeywordExtractor />} />
                        <ReactRouterDOM.Route path="time-estimator" element={<TimeEstimator />} />
                        <ReactRouterDOM.Route path="flashcard-generator" element={<FlashcardGenerator />} />
                        <ReactRouterDOM.Route path="icebreaker-prompter" element={<IcebreakerPrompter />} />
                        <ReactRouterDOM.Route path="discussion-assistant" element={<DiscussionAssistant />} />
                        <ReactRouterDOM.Route path="text-simplifier" element={<TextSimplifier />} />
                        <ReactRouterDOM.Route path="critical-thinking-booster" element={<CriticalThinkingBooster />} />
                        <ReactRouterDOM.Route path="report-card-generator" element={<ReportCardGenerator />} />
                        <ReactRouterDOM.Route path="interactive-quiz-builder" element={<InteractiveQuizBuilder />} />
                        <ReactRouterDOM.Route path="data-storyteller" element={<DataStoryteller />} />
                        <ReactRouterDOM.Route path="multi-doc-synthesizer" element={<MultiDocSynthesizer />} />
                        <ReactRouterDOM.Route path="group-project-coordinator" element={<GroupProjectCoordinator />} />
                        <ReactRouterDOM.Route path="math-mentor" element={<MathMentor />} />
                        <ReactRouterDOM.Route path="historical-context-bot" element={<HistoricalContextBot />} />
                        <ReactRouterDOM.Route path="source-credibility-checker" element={<SourceCredibilityChecker />} />
                        <ReactRouterDOM.Route path="analogy-generator" element={<AnalogyGenerator />} />
                        <ReactRouterDOM.Route path="ethical-dilemma-explorer" element={<EthicalDilemmaExplorer />} />
                        <ReactRouterDOM.Route path="project-brainstormer" element={<ProjectBrainstormer />} />
                        <ReactRouterDOM.Route path="literary-device-finder" element={<LiteraryDeviceFinder />} />
                        <ReactRouterDOM.Route path="internship-email-assistant" element={<InternshipEmailAssistant />} />
                        <ReactRouterDOM.Route path="citation-wizard" element={<CitationWizard />} />
                        <ReactRouterDOM.Route path="focus-sprint-planner" element={<FocusSprintPlanner />} />
                        <ReactRouterDOM.Route path="visual-data-interpreter" element={<VisualDataInterpreter />} />
                        <ReactRouterDOM.Route path="presentation-rehearsal-coach" element={<PresentationRehearsalCoach />} />
                        <ReactRouterDOM.Route path="assignment-deconstructor" element={<AssignmentDeconstructor />} />
                        <ReactRouterDOM.Route path="rubric-builder" element={<RubricBuilder />} />
                        <ReactRouterDOM.Route path="lesson-plan-variator" element={<LessonPlanVariator />} />
                        <ReactRouterDOM.Route path="student-misconception-spotter" element={<StudentMisconceptionSpotter />} />
                        <ReactRouterDOM.Route path="differentiated-text-generator" element={<DifferentiatedTextGenerator />} />
                        <ReactRouterDOM.Route path="parent-communication-assistant" element={<ParentCommunicationAssistant />} />
                    </ReactRouterDOM.Route>
                </ReactRouterDOM.Routes>
            </ReactRouterDOM.HashRouter>
        </ProjectProvider>
    );
};

export default App;