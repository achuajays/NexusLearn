
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { MaterialIcon } from '../components/Icons.tsx';
import { Button } from '../components/AppComponents.tsx';

// --- Reusable Components for the Homepage ---

const FeatureCard3D: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="[perspective:1000px] group">
        <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 shadow-lg transform-gpu transition-all duration-500 group-hover:scale-105 group-hover:[transform:rotateX(10deg)_rotateY(-5deg)] group-hover:shadow-2xl group-hover:shadow-blue-500/20">
            <div className="flex items-center justify-center bg-white/60 h-14 w-14 rounded-lg mb-5 border border-gray-200/50 group-hover:bg-blue-100 group-hover:border-blue-300 transition-colors duration-300">
                <MaterialIcon iconName={icon} className="text-4xl text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string; }> = ({ number, title, description }) => (
    <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 border-2 border-blue-200 text-blue-600 text-2xl font-bold">
            {number}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-gray-500">{description}</p>
    </div>
);

const BenefitItem: React.FC<{ icon: string; text: string; }> = ({ icon, text }) => (
    <li className="flex items-start">
        <MaterialIcon iconName={icon} className="text-green-500 text-2xl mr-3 mt-1" />
        <span>{text}</span>
    </li>
);

// --- Main Homepage Component ---

const HomePage: React.FC = () => {
    return (
        <div className="bg-gray-50 text-gray-800">
            {/* --- Parallax Background --- */}
            <div className="fixed inset-0 z-0 opacity-20">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2940&auto=format&fit=crop')", backgroundAttachment: 'fixed' }}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" />
            </div>
            
            <div className="relative z-10">
                {/* --- Header --- */}
                <header className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center space-x-2">
                            <MaterialIcon iconName="auto_awesome" className="text-blue-600 text-3xl" />
                            <h1 className="text-2xl font-bold text-gray-800">NexusLearn</h1>
                        </div>
                        <ReactRouterDOM.Link to="/dashboard">
                            <Button className="shadow-sm text-sm px-4 py-2">Go to App</Button>
                        </ReactRouterDOM.Link>
                    </div>
                </header>

                {/* --- Hero Section --- */}
                <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-24 sm:py-32">
                    <div className="max-w-4xl">
                        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full mb-4 border border-blue-200/50">
                            Your Integrated Academic Partner
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Your Academic Co-pilot
                        </h2>
                        <p className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-gray-600">
                           NexusLearn is more than a toolbox—it's an intelligent workspace. From acing your next exam with adaptive quizzes to managing complex research papers in our project hubs, we're here to help you learn smarter, not just harder.
                        </p>
                        <ReactRouterDOM.Link to="/dashboard" className="mt-10 inline-block">
                            <Button className="text-lg px-8 py-4 shadow-xl shadow-blue-500/20 transform-gpu transition-transform hover:scale-105">
                                Start Learning
                                <MaterialIcon iconName="arrow_forward" className="ml-2" />
                            </Button>
                        </ReactRouterDOM.Link>
                    </div>
                </main>

                {/* --- Detailed Features Section --- */}
                <section className="py-24 bg-white/50 backdrop-blur-lg border-t border-b border-gray-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-gray-800">A Tool for Every Task</h3>
                            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                                With over 50 specialized tools, you have everything you need to tackle any academic challenge.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <FeatureCard3D icon="model_training" title="Adaptive Learning" description="Don't just get answers. Our adaptive quizzes diagnose your mistakes, provide micro-lessons, and help you master concepts for good." />
                            <FeatureCard3D icon="edit_document" title="Effortless Writing" description="From outlining your thesis with Essay Buddy to generating perfect citations with the Citation Wizard, we streamline your entire writing process." />
                            <FeatureCard3D icon="hub" title="Deep Understanding" description="Use The Synthesizer to analyze multiple sources at once, or break down complex topics into simple analogies with Concept Cracker." />
                            <FeatureCard3D icon="task" title="Project Management" description="Organize all your notes, outlines, and research into dedicated Project Workspaces. Keep every resource for your big assignments in one place." />
                            <FeatureCard3D icon="school" title="Teacher Superpowers" description="Automate tedious tasks. Build detailed rubrics, create dynamic lesson plans, and draft parent communications in a fraction of the time." />
                            <FeatureCard3D icon="work" title="Career Preparation" description="Translate your academic skills into career success. Improve your resume, draft professional emails, and map potential career paths." />
                        </div>
                    </div>
                </section>
                
                 {/* --- How It Works Section --- */}
                <section className="py-24">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                             <h3 className="text-3xl font-bold text-gray-800">Get Started in Seconds</h3>
                             <p className="mt-4 max-w-2xl mx-auto text-gray-600">Our tools are designed to be simple and intuitive. No learning curve required.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <StepCard number="1" title="Choose a Tool" description="Select from our extensive library of over 50 specialized academic tools." />
                            <StepCard number="2" title="Provide Your Input" description="Paste your notes, type a question, or describe your task to the AI." />
                            <StepCard number="3" title="Get Instant Assistance" description="Receive high-quality outlines, summaries, solutions, and feedback in seconds." />
                        </div>
                    </div>
                </section>
                
                 {/* --- Project Workspace Showcase --- */}
                <section className="py-24 bg-white/50 backdrop-blur-lg border-t border-b border-gray-200/80">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="pr-0 lg:pr-8">
                                <h3 className="text-3xl font-bold text-gray-800">Organize Everything with Projects</h3>
                                <p className="mt-4 text-lg text-gray-600">Stop juggling dozens of documents and browser tabs. Our Project Workspaces let you create a dedicated hub for each major assignment. Save notes from SmartNotes, outlines from Essay Buddy, and sources from the Citation Wizard—all in one place.</p>
                                <ReactRouterDOM.Link to="/projects" className="mt-6 inline-block">
                                    <Button variant="outline">
                                       Learn More About Projects
                                    </Button>
                                </ReactRouterDOM.Link>
                            </div>
                            <div className="bg-white rounded-xl shadow-2xl shadow-gray-900/10 p-2 ring-1 ring-gray-900/5">
                                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="A person writing at a desk, representing organized project work." className="rounded-lg w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- For Who? Section --- */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* For Students */}
                        <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-200/50 shadow-xl">
                             <h3 className="text-2xl font-bold text-gray-800 mb-6">For Students</h3>
                             <ul className="space-y-4 text-lg text-gray-700">
                                <BenefitItem icon="bolt" text="Save dozens of hours on research and writing." />
                                <BenefitItem icon="lightbulb" text="Understand complex topics with ease." />
                                <BenefitItem icon="checklist" text="Stay organized and meet every deadline." />
                                <BenefitItem icon="trending_up" text="Improve your grades and reduce exam anxiety." />
                             </ul>
                        </div>
                        {/* For Teachers */}
                        <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-200/50 shadow-xl">
                             <h3 className="text-2xl font-bold text-gray-800 mb-6">For Teachers</h3>
                             <ul className="space-y-4 text-lg text-gray-700">
                                <BenefitItem icon="schedule" text="Automate tedious tasks like rubric building." />
                                <BenefitItem icon="groups" text="Create engaging and varied lesson plans." />
                                <BenefitItem icon="support" text="Differentiate instruction for all learners." />
                                <BenefitItem icon="email" text="Streamline communication with parents." />
                             </ul>
                        </div>
                    </div>
                </section>

                {/* --- Final CTA --- */}
                 <section className="py-24 text-center">
                    <div className="max-w-2xl mx-auto px-4">
                        <h3 className="text-4xl font-extrabold text-gray-800">Ready to Transform Your Learning?</h3>
                        <p className="mt-4 text-lg text-gray-600">Join thousands of students and educators who are using NexusLearn to achieve their academic goals.</p>
                         <ReactRouterDOM.Link to="/dashboard" className="mt-8 inline-block">
                            <Button className="text-xl px-10 py-5 shadow-2xl shadow-blue-500/20 transform-gpu transition-transform hover:scale-105">
                                Go to the Dashboard
                            </Button>
                        </ReactRouterDOM.Link>
                    </div>
                 </section>

                {/* --- Footer --- */}
                <footer className="text-center py-10 text-gray-500 text-sm border-t border-gray-200/80">
                    <p>&copy; {new Date().getFullYear()} NexusLearn. An AI-powered application.</p>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;
