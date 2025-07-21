

import React from 'react';

// Enum for Gemini API schema types.
export enum Type {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string; // Changed from React.FC to string for Material Icon names
  path: string;
  role?: 'student' | 'teacher';
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProjectArtifact {
  id: string;
  toolId: string;
  toolTitle: string;
  createdAt: string;
  data: any; // The data can be of any type from our other interfaces
}

export interface AudioNotes {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
}

export interface EssayOutline {
  thesis: string;
  structure: string[];
  introParagraph: string;
}

export interface ConceptStyles {
  simple: string;
  visual: string;
  analogy: string;
}

export interface LabReport {
    procedure: string[];
    safety: string[];
    purpose: string;
    vivaQuestions: { question: string; answer: string; }[];
}

export interface CourseOutline {
  [week: string]: string[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Mnemonic {
    acronym?: string;
    story?: string;
    rhyme?: string;
}

export interface TextbookDigest {
    summary: string;
    definitions: {term: string; definition: string}[];
    highlights: string[];
}

export interface PresentationSlide {
    title: string;
    points: string[];
}

export interface DebatePoint {
    argument: string;
    rebuttal: string;
}

export interface DebatePrep {
    pro: DebatePoint[];
    con: DebatePoint[];
}

export interface StudyNotesDigest {
  keywords: string[];
  definitions: { term: string; definition: string }[];
  highlights: string[];
}

export interface TimeEstimate {
  estimatedTime: string;
  plan: string[];
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface DiscussionStarters {
    starterReply: string;
    followUpAngles: string[];
}

export interface MCQQuizItem {
    type: 'MCQ';
    question: string;
    options: string[];
    answer: string;
}

export interface TFQuizItem {
    type: 'TF';
    question: string;
    answer: 'True' | 'False';
}

export interface FIBQuizItem {
    type: 'FIB';
    question: string; 
    answer: string; 
}

export type InteractiveQuizItem = MCQQuizItem | TFQuizItem | FIBQuizItem;

export interface RemediationPayload {
    diagnosis: string;
    microLesson: string;
    followUpQuestion: QuizQuestion;
}

export interface SynthesizerPayload {
    unifiedSummary: string;
    connections: string[];
    contradictions: string[];
}

export interface GroupProjectFeedback {
    toneAnalysis: string;
    redundancyReport: string[];
    gapAnalysis: string[];
}

export interface HistoricalContext {
    worldEvents: string[];
    keyFigures: string[];
    precedingEvents: string[];
}

export interface BrainstormResult {
    researchQuestions: string[];
    projectIdeas: string[];
}

export interface LiteraryDevice {
    device: string;
    explanation: string;
    quote: string;
}

export interface FocusSprint {
    duration: number;
    activity: string;
    type: 'work' | 'break';
}

export interface FocusPlan {
    sprints: FocusSprint[];
}

export interface AssignmentDeconstruction {
    mainVerb: string;
    coreSubject: string;
    constraints: string[];
}

export interface DifferentiatedText {
    levelA2: string;
    levelB1: string;
    levelB2: string;
}

export interface PresentationRehearsalFeedback {
    transcript: string;
    wordCount: number;
    durationSeconds: number;
    wordsPerMinute: number;
    fillerWords: { word: string; count: number }[];
    qualitativeFeedback: string;
}


declare global {
  // These types are added to the global scope to support the Web Speech API,
  // which is not a standard part of all TypeScript DOM definitions.
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    start: () => void;
    stop: () => void;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: {
      readonly isFinal: boolean;
      readonly [index: number]: {
        readonly transcript: string;
      };
      readonly length: number;
    }[];
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
  }

  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}