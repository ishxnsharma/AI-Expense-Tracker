import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#0ea5e9'];

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
        <div className="space-y-8 pb-10">
            {/* Chart Section */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:border-white/20 relative group overflow-hidden">
                <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-gradient-to-bl from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white flex items-center gap-3 relative z-10">
                    <span className="w-1.5 h-6 bg-neon-emerald rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] inline-block"></span> Spending by Category
                </h2>
                {expenses.length > 0 ? (
                    <div className="h-72 sm:h-80 mt-6 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={105}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-lg outline-none" style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}80)` }} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `₹${value.toFixed(2)}`}
                                    contentStyle={{ backgroundColor: 'rgba(17, 17, 17, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#ccc', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-48 bg-white/5 rounded-xl border-2 border-dashed border-white/10 mt-6 relative z-10 transition-colors group-hover:border-white/20">
                        <p className="text-gray-400 font-medium">No expenses recorded yet.</p>
                    </div>
                )}
            </div>

            {/* AI Insights Section */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/10 to-neon-purple/10 opacity-40 pointer-events-none"></div>
                <div className="absolute top-[-50%] right-[-10%] w-[150%] h-[150%] bg-gradient-to-bl from-neon-purple/10 to-transparent pointer-events-none group-hover:opacity-100 transition-opacity duration-700 opacity-60"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-neon-purple rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)] inline-block"></span>
                            AI Financial Insights
                            <span className="flex h-3 w-3 relative -ml-1 -mt-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-purple"></span>
                            </span>
                        </h2>
                        <p className="text-indigo-200/60 text-sm mt-1.5 font-medium tracking-wide">Personalized recommendations powered by Gemini.</p>
                    </div>
                    <button
                        onClick={fetchInsights}
                        disabled={loadingInsights || expenses.length === 0}
                        className="bg-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-white/20 disabled:opacity-50 text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap border border-white/10 hover:border-white/30 flex items-center gap-2"
                    >
                        {loadingInsights ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Generate Focus
                            </>
                        )}
                    </button>
                </div>

                {insightsError && (
                    <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-500/20 font-medium relative z-10">
                        {insightsError}
                    </div>
                )}

                {insights ? (
                    <div className="space-y-6 bg-black/40 p-6 sm:p-8 rounded-xl border border-white/10 relative z-10 shadow-inner">
                        <div>
                            <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center tracking-wider uppercase">
                                <span className="bg-neon-indigo/20 border border-neon-indigo/30 text-neon-indigo px-2 py-0.5 rounded shadow-[0_0_10px_rgba(99,102,241,0.2)] mr-2 text-[10px]">SUMMARY</span>
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{insights.summary}</p>
                        </div>
                        <div className="pt-6 border-t border-white/10">
                            <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center tracking-wider uppercase">
                                <span className="bg-neon-emerald/20 border border-neon-emerald/30 text-neon-emerald px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.2)] mr-2 text-[10px]">ACTIONABLE ADVICE</span>
                            </h3>
                            <ul className="space-y-4">
                                {insights.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start bg-white/5 p-4 rounded-xl border border-white/5 hover:border-neon-emerald/30 transition-colors shadow-sm">
                                        <svg className="w-5 h-5 text-neon-emerald mr-3 shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="text-gray-300 text-sm sm:text-base leading-relaxed">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    !loadingInsights && <div className="bg-black/20 p-8 rounded-xl text-center text-gray-400 font-medium border border-white/5 relative z-10">
                        {expenses.length === 0
                            ? 'Add some expenses first to unlock insights.'
                            : 'Click the "Generate Focus" button to analyze your spending pattern.'}
                    </div>
                )}
            </div>

            {/* Recent Expenses List */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white flex items-center gap-3 relative z-10">
                    <span className="w-1.5 h-6 bg-gray-500 rounded-full inline-block shadow-[0_0_10px_rgba(156,163,175,0.5)]"></span> Recent Expenses
                </h2>
                <div className="overflow-hidden relative z-10 rounded-xl bg-black/40 border border-white/10 shadow-inner">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:table-cell">Description</th>
                                    <th className="px-6 py-4 text-right text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {expenses.slice(0, 10).map((exp, i) => (
                                    <tr key={exp.id || i} className="hover:bg-white/5 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400 font-medium">{new Date(exp.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-md bg-white/10 text-gray-200 border border-white/10 shadow-sm">
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400 hidden sm:table-cell">{exp.description || <span className="text-gray-600 italic">None</span>}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base font-bold text-white text-right drop-shadow-sm">₹{parseFloat(exp.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {expenses.length === 0 && (
                        <div className="px-6 py-10 text-center text-gray-500 font-medium border-t border-white/10">
                            No recent expenses. Time to log some!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
