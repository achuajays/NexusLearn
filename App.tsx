

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import SmartNotes from './pages/SmartNotes.tsx';
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
import { Analytics } from "@vercel/analytics/react";
import DataStoryteller from './pages/DataStoryteller.tsx';

const App: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/" element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="smart-notes" element={<SmartNotes />} />
                    <Route path="essay-buddy" element={<EssayBuddy />} />
                    <Route path="concept-cracker" element={<ConceptCracker />} />
                    <Route path="lab-helper" element={<LabHelper />} />
                    <Route path="course-outliner" element={<CourseOutliner />} />
                    <Route path="doubt-bot" element={<DoubtBot />} />
                    <Route path="quiz-whiz" element={<QuizWhiz />} />
                    <Route path="study-plan-ai" element={<StudyPlanAI />} />
                    <Route path="textbook-buddy" element={<TextbookBuddy />} />
                    <Route path="mnemonic-maker" element={<MnemonicMaker />} />
                    <Route path="code-explainer" element={<CodeExplainer />} />
                    <Route path="resume-rewriter" element={<ResumeRewriter />} />
                    <Route path="scholarship-coach" element={<ScholarshipCoach />} />
                    <Route path="presentation-generator" element={<PresentationGenerator />} />
                    <Route path="learning-converter" element={<LearningConverter />} />
                    <Route path="anxiety-coach" element={<AnxietyCoach />} />
                    <Route path="assignment-formatter" element={<AssignmentFormatter />} />
                    <Route path="daily-learner" element={<DailyLearner />} />
                    <Route path="career-mapper" element={<CareerMapper />} />
                    <Route path="debate-assistant" element={<DebateAssistant />} />
                    <Route path="keyword-extractor" element={<KeywordExtractor />} />
                    <Route path="time-estimator" element={<TimeEstimator />} />
                    <Route path="flashcard-generator" element={<FlashcardGenerator />} />
                    <Route path="icebreaker-prompter" element={<IcebreakerPrompter />} />
                    <Route path="discussion-assistant" element={<DiscussionAssistant />} />
                    <Route path="text-simplifier" element={<TextSimplifier />} />
                    <Route path="critical-thinking-booster" element={<CriticalThinkingBooster />} />
                    <Route path="report-card-generator" element={<ReportCardGenerator />} />
                    <Route path="interactive-quiz-builder" element={<InteractiveQuizBuilder />} />
                    <Route path="data-storyteller" element={<DataStoryteller />} />
                </Route>
            </Routes>
            <Analytics/>
        </HashRouter>
    );
};

export default App;
