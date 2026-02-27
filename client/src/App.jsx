import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import api from './api';

function App() {
    const [newExpense, setNewExpense] = useState(null);

    const handleExpenseAdded = (expense) => {
        setNewExpense(expense);
    };

    const handleClearAll = async () => {
        if (window.confirm("Are you sure you want to permanently delete all expenses and start fresh?")) {
            try {
                await api.delete('/expenses/all');
                window.location.reload();
            } catch (err) {
                console.error("Failed to clear data", err);
                alert("Failed to clear data.");
            }
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-indigo/20 rounded-full blur-[120px] pointer-events-none animate-glow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none animate-glow" style={{ animationDelay: '1.5s' }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between glass-panel rounded-2xl p-6 md:p-8 animate-slide-up">
                    <div className="flex flex-col md:flex-row items-center gap-5 md:gap-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] relative group">
                            <div className="absolute inset-0 bg-neon-indigo/20 blur-xl rounded-2xl group-hover:bg-neon-indigo/40 transition-all duration-500"></div>
                            <svg className="w-10 h-10 text-indigo-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402-2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-gray-400 tracking-tight">
                                AI Expense Tracker
                            </h1>
                            <p className="text-indigo-200/60 mt-2 font-medium text-sm md:text-base tracking-wide">Track spending with intelligent insights.</p>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <button
                            onClick={handleClearAll}
                            className="bg-red-500/10 text-red-400 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        >
                            Reset Data
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <ExpenseForm onExpenseAdded={handleExpenseAdded} />
                    </div>
                    <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Dashboard newExpense={newExpense} />
                    </div>
                </main>

                {/* Footer Section */}
                <footer className="mt-20 text-center text-gray-500 pb-8 border-t border-white/5 pt-8 px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <p className="font-medium text-sm">© {new Date().getFullYear()} AI-Powered Expense Tracker.</p>
                    <p className="text-sm mt-1 text-gray-600">Created by Ishan Sharma</p>
                    <div className="flex justify-center flex-wrap gap-6 mt-4">
                        <a href="https://github.com/ishxnsharma" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all font-medium flex items-center gap-1 group">
                            <span className="group-hover:text-neon-indigo transition-colors">GitHub</span>
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default App;
