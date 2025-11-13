import React from 'react';
// FIX: Changed named import to default import for the Quiz component, as it is exported as a default.
import Quiz from './Quiz';
import { LadybugIcon } from './icons';

interface DashboardProps {
  onSearch: (query: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSearch }) => {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-bold text-green-900">Welcome to the InsectVerse!</h2>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    A world of tiny wonders awaits. Search for any insect to begin your journey of discovery, powered by AI.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                        <LadybugIcon className="text-amber-500" /> Insect of the Day
                    </h3>
                    <div className="flex items-center gap-4">
                        <img src="https://picsum.photos/seed/ladybug/200/200" alt="Ladybug" className="w-32 h-32 object-cover rounded-lg" />
                        <div>
                            <h4 className="text-xl font-semibold">Ladybug</h4>
                            <p className="text-gray-600 mt-1">A beneficial predator known for eating aphids. Its bright colors warn predators of its foul taste.</p>
                            <button onClick={() => onSearch('Ladybug')} className="mt-3 px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-green-900 mb-4">Quick Quiz</h3>
                    <Quiz />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;