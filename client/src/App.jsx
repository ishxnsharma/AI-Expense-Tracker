import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';

function App() {
    const [newExpense, setNewExpense] = useState(null);

    const handleExpenseAdded = (expense) => {
        setNewExpense(expense);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                            AI-Powered Expense Tracker
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Track your spending and get intelligent insights.</p>
                    </div>
                    <div className="mt-4 md:mt-0 p-3 bg-indigo-50 rounded-full">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
            </div>
        </div>
    );
}

export default App;
