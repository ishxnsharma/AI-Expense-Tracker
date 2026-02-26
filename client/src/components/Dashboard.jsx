import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Dashboard = ({ newExpense }) => {
    const [expenses, setExpenses] = useState([]);
    const [insights, setInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [insightsError, setInsightsError] = useState('');

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (err) {
            console.error('Failed to fetch expenses', err);
        }
    };

    const fetchInsights = async () => {
        try {
            setLoadingInsights(true);
            setInsightsError('');
            const response = await api.get('/expenses/insights');
            setInsights(response.data);
        } catch (err) {
            console.error('Failed to fetch insights', err);
            setInsightsError(err.response?.data?.error || 'Failed to fetch insights. Please try again later.');
        } finally {
            setLoadingInsights(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        if (newExpense) {
            setExpenses(prev => {
                const updated = [newExpense, ...prev];
                return updated.sort((a, b) => new Date(b.date) - new Date(a.date));
            });
        }
    }, [newExpense]);

    // Aggregate data for Pie Chart
    const categoryData = expenses.reduce((acc, current) => {
        const amount = parseFloat(current.amount);
        const existing = acc.find(item => item.name === current.category);
        if (existing) {
            existing.value += amount;
        } else {
            acc.push({ name: current.category, value: amount });
        }
        return acc;
    }, []);

    return (
        <div className="space-y-6">
            {/* Chart Section */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Spending by Category</h2>
                {expenses.length > 0 ? (
                    <div className="h-72 mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-50 rounded-md border-2 border-dashed border-gray-200 mt-4">
                        <p className="text-gray-500 font-medium">No expenses recorded yet.</p>
                    </div>
                )}
            </div>

            {/* AI Insights Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg shadow-md border border-indigo-100 transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            AI Financial Insights
                        </h2>
                        <p className="text-indigo-700 text-sm mt-1">Get personalized recommendations based on your last 30 days of spending.</p>
                    </div>
                    <button
                        onClick={fetchInsights}
                        disabled={loadingInsights || expenses.length === 0}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-bold shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap"
                    >
                        {loadingInsights ? 'Analyzing...' : 'Generate Insights'}
                    </button>
                </div>

                {insightsError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 text-sm border border-red-200 font-medium">
                        {insightsError}
                    </div>
                )}

                {insights ? (
                    <div className="space-y-5 bg-white p-5 rounded-md shadow-sm border border-indigo-50">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                                <span className="bg-indigo-100 text-indigo-800 p-1 rounded mr-2 text-xs">SUMMARY</span>
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                                <span className="bg-green-100 text-green-800 p-1 rounded mr-2 text-xs">ACTIONABLE ADVICE</span>
                            </h3>
                            <ul className="space-y-3">
                                {insights.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="text-gray-700">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    !loadingInsights && <div className="bg-white/60 p-5 rounded-md text-center text-indigo-800/60 font-medium border border-indigo-100/50">
                        {expenses.length === 0
                            ? 'Add some expenses first to unlock insights.'
                            : 'Click the "Generate Insights" button to analyze your spending.'}
                    </div>
                )}
            </div>

            {/* Recent Expenses List */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Recent Expenses</h2>
                <div className="overflow-x-auto mt-4 ring-1 ring-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {expenses.slice(0, 10).map((exp, i) => (
                                <tr key={exp.id || i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{new Date(exp.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-indigo-100 text-indigo-800">
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exp.description || <span className="text-gray-400 italic">None</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">₹{parseFloat(exp.amount).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {expenses.length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-500 font-medium">
                            No recent expenses. Time to log some!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
