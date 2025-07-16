


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