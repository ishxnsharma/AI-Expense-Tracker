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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-indigo-100/50">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                            AI-Powered Expense Tracker
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Track your spending and get intelligent insights.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <button
                            onClick={handleClearAll}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 hover:text-red-700 transition-colors text-sm border border-red-100 shadow-sm"
                        >
                            Reset Data
                        </button>
                        <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full shadow-inner">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 border-r-0 lg:border-r border-gray-200 pr-0 lg:pr-6">
                        <ExpenseForm onExpenseAdded={handleExpenseAdded} />
                    </div>
                    <div className="lg:col-span-2 pl-0 lg:pl-2">
                        <Dashboard newExpense={newExpense} />
                    </div>
                </main>

                {/* Footer Section */}
                <footer className="mt-16 text-center text-gray-500 pb-8 border-t border-gray-200/60 pt-8">
                    <p className="font-medium text-sm">© {new Date().getFullYear()} AI-Powered Expense Tracker.</p>
                    <p className="text-xs mt-1 text-gray-400">Created for hackers, by hackers.</p>
                    <div className="flex justify-center flex-wrap gap-6 mt-4">
                        <a href="https://github.com/ishxnclicks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-all font-medium flex items-center gap-1">
                            GitHub
                        </a>
                        <a href="https://instagram.com/ishxnclicks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-all font-medium flex items-center gap-1">
                            Instagram
                        </a>
                        <a href="mailto:sharmaishxn@gmail.com" className="text-gray-400 hover:text-indigo-600 transition-all font-medium flex items-center gap-1">
                            Contact
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default App;
