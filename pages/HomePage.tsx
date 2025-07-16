

import React from 'react';
import { Link } from 'react-router-dom';
import { MaterialIcon } from '../components/Icons.tsx';
import { Button } from '../components/AppComponents.tsx';
import { TOOLS } from '../constants.ts';

const FeaturedCard: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-gray-200/50 shadow-lg transform-gpu transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 group">
        <div className="flex items-center justify-center bg-white/50 h-12 w-12 rounded-lg mb-4 border border-gray-200/50 group-hover:bg-blue-100 group-hover:border-blue-300 transition-colors duration-300">
            <MaterialIcon iconName={icon} className="text-3xl text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
    </div>
);

const HomePage: React.FC = () => {
    const featuredTools = TOOLS.filter(t => ['smart-notes', 'essay-buddy', 'quiz-whiz'].includes(t.id));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Parallax Background Image */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2940&auto=format&fit=crop')",
                    backgroundAttachment: 'fixed'
                }}
            />
            {/* Blur/Tint Overlay */}
            <div className="fixed inset-0 z-0 bg-gray-50/80 backdrop-blur-sm" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center space-x-2">
                            <MaterialIcon iconName="auto_awesome" className="text-blue-600 text-3xl" />
                            <h1 className="text-2xl font-bold text-gray-800">NexusLearn</h1>
                        </div>
                        <Link to="/dashboard">
                            <Button className="shadow-sm text-sm px-4 py-2">Go to App</Button>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 sm:py-24">
                    <div className="max-w-3xl">
                        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full mb-4 border border-blue-200/50">
                            Your All-in-One AI Academic Assistant
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Supercharge Your Studies
                        </h2>
                        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-gray-600">
                            From summarizing notes and planning essays to generating quizzes and preparing for debates, our AI-powered toolkit is designed to help you learn smarter, not harder.
                        </p>
                        <Link to="/dashboard" className="mt-10 inline-block">
                            <Button className="text-lg px-8 py-4 shadow-xl shadow-blue-500/20">
                                Get Started For Free
                                <MaterialIcon iconName="arrow_forward" className="ml-2" />
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-24 w-full max-w-5xl">
                         <h3 className="text-3xl font-bold mb-8 text-gray-800">Explore Popular Tools</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {featuredTools.map(tool => (
                               <FeaturedCard key={tool.id} icon={tool.icon} title={tool.title} description={tool.description} />
                           ))}
                        </div>
                    </div>
                </main>

                <footer className="text-center py-8 text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} NexusLearn. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;