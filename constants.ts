

import { Tool } from './types.ts';

export const SUPABASE_URL = 'https://tppghsndtbdsdgolpbbh.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcGdoc25kdGJkc2Rnb2xwYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDE4MTAsImV4cCI6MjA2Nzc3NzgxMH0.gOa_df0VrCWHHunbOUuFNh7PESwrIWHTaCG2jEs9U9Y';

export const TOOLS: Tool[] = [
  {
    id: 'smart-notes',
    title: 'SmartNotes',
    description: 'Auto-summarize & explain complex text.',
    icon: 'lightbulb',
    path: '/smart-notes',
  },
  {
    id: 'essay-buddy',
    title: 'Essay Buddy',
    description: 'Plan your thesis, outline, and intro.',
    icon: 'edit',
    path: '/essay-buddy',
  },
  {
    id: 'concept-cracker',
    title: 'Concept Cracker',
    description: 'Simplify topics in multiple styles.',
    icon: 'psychology',
    path: '/concept-cracker',
  },
  {
    id: 'lab-helper',
    title: 'LabHelper',
    description: 'Explain experiments, safety, and purpose.',
    icon: 'science',
    path: '/lab-helper',
  },
  {
    id: 'course-outliner',
    title: 'CourseOutliner',
    description: 'Generate a curriculum from a topic.',
    icon: 'view_list',
    path: '/course-outliner',
  },
  {
    id: 'doubt-bot',
    title: 'DoubtBot',
    description: 'Get instant answers and further reading.',
    icon: 'chat',
    path: '/doubt-bot',
  },
  {
    id: 'quiz-whiz',
    title: 'QuizWhiz',
    description: 'Create quizzes from notes or topics.',
    icon: 'quiz',
    path: '/quiz-whiz',
  },
  {
    id: 'study-plan-ai',
    title: 'StudyPlan AI',
    description: 'Generate a personalized study schedule.',
    icon: 'calendar_today',
    path: '/study-plan-ai',
  },
  {
    id: 'textbook-buddy',
    title: 'Textbook Buddy',
    description: 'Digest and get insights from text excerpts.',
    icon: 'menu_book',
    path: '/textbook-buddy',
  },
  {
    id: 'mnemonic-maker',
    title: 'Mnemonic Maker',
    description: 'Create memory aids for lists or concepts.',
    icon: 'psychology_alt',
    path: '/mnemonic-maker',
  },
  {
    id: 'code-explainer',
    title: 'Code Explainer',
    description: 'Get simple, line-by-line code explanations.',
    icon: 'code',
    path: '/code-explainer',
  },
  {
    id: 'resume-rewriter',
    title: 'Resume Rewriter',
    description: 'Improve your resume for clarity and impact.',
    icon: 'article',
    path: '/resume-rewriter',
  },
  {
    id: 'scholarship-coach',
    title: 'Scholarship Coach',
    description: 'Draft & improve your scholarship essays.',
    icon: 'school',
    path: '/scholarship-coach',
  },
  {
    id: 'presentation-generator',
    title: 'Presentation Generator',
    description: 'Generate slide content for any topic.',
    icon: 'slideshow',
    path: '/presentation-generator',
  },
  {
    id: 'learning-converter',
    title: 'Learning Converter',
    description: 'Adapt explanations to your learning style.',
    icon: 'swap_horiz',
    path: '/learning-converter',
  },
  {
    id: 'anxiety-coach',
    title: 'Exam Anxiety Coach',
    description: 'Get calming techniques for test anxiety.',
    icon: 'self_improvement',
    path: '/anxiety-coach',
  },
  {
    id: 'assignment-formatter',
    title: 'Assignment Formatter',
    description: 'Format your papers in APA, MLA, etc.',
    icon: 'format_align_left',
    path: '/assignment-formatter',
  },
  {
    id: 'daily-learner',
    title: 'Daily 5-Min Learner',
    description: 'Get a bite-sized lesson on any subject.',
    icon: 'local_library',
    path: '/daily-learner',
  },
  {
    id: 'career-mapper',
    title: 'Career Path Mapper',
    description: 'Map career paths from your interests.',
    icon: 'map',
    path: '/career-mapper',
  },
  {
    id: 'debate-assistant',
    title: 'Debate Prep Assistant',
    description: 'Generate pro/con arguments for any topic.',
    icon: 'gavel',
    path: '/debate-assistant',
  },
  {
    id: 'keyword-extractor',
    title: 'Keyword Extractor',
    description: 'Extract keywords & definitions from notes.',
    icon: 'label',
    path: '/keyword-extractor',
  },
  {
    id: 'time-estimator',
    title: 'Time Estimator',
    description: 'Estimate the time required for assignments.',
    icon: 'timer',
    path: '/time-estimator',
  },
  {
    id: 'flashcard-generator',
    title: 'Flashcard Generator',
    description: 'Turn your notes into interactive flashcards.',
    icon: 'style',
    path: '/flashcard-generator',
  },
  {
    id: 'icebreaker-prompter',
    title: 'Icebreaker Prompter',
    description: 'Generate fun icebreakers for any class.',
    icon: 'groups',
    path: '/icebreaker-prompter',
  },
  {
    id: 'discussion-assistant',
    title: 'Discussion Assistant',
    description: 'Get help with discussion board posts.',
    icon: 'forum',
    path: '/discussion-assistant',
  },
  {
    id: 'text-simplifier',
    title: 'Text Simplifier',
    description: 'Rewrite complex text for ESL students.',
    icon: 'translate',
    path: '/text-simplifier',
  },
  {
    id: 'critical-thinking-booster',
    title: 'Critical Thinking Booster',
    description: 'Strengthen your arguments with critique.',
    icon: 'psychology',
    path: '/critical-thinking-booster',
  },
  {
    id: 'report-card-generator',
    title: 'Report Card Generator',
    description: 'Generate formal report card comments.',
    icon: 'grading',
    path: '/report-card-generator',
  },
  {
    id: 'interactive-quiz-builder',
    title: 'Interactive Quiz Builder',
    description: 'Create quizzes with multiple question types.',
    icon: 'extension',
    path: '/interactive-quiz-builder',
  },
  {
    id: 'data-storyteller',
    title: 'Data Storyteller',
    description: 'Get a narrative interpretation of data.',
    icon: 'bar_chart',
    path: '/data-storyteller',
  },
];