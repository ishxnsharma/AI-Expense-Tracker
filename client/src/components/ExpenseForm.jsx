import React, { useState } from 'react';
import api from '../api';

const ExpenseForm = ({ onExpenseAdded }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Housing', 'Other'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReset = (e) => {
        e?.preventDefault();
        setFormData({
            amount: '',
            category: 'Food',
            date: new Date().toISOString().split('T')[0],
            description: ''
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (parseFloat(formData.amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        if (!formData.date || !formData.amount) {
            setError('Please fill out all required fields');
            return;
        }

        try {
            setLoading(true);
            // Sending user_id = 1 for MVP purposes
            const response = await api.post('/expenses', { ...formData, user_id: 1 });
            onExpenseAdded(response.data);
            // Reset amount and description, keep date and category
            setFormData({ ...formData, amount: '', description: '' });
        } catch (err) {
            console.error(err);
            setError('Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl mb-6 transition-all duration-300 hover:border-white/20 group animate-slide-up relative overflow-hidden">
            {/* Subtle glow behind the card */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 relative z-10">
                <span className="w-1.5 h-6 bg-neon-indigo rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] inline-block"></span> Add Expense
            </h2>
            {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-5 border border-red-500/20 font-medium text-sm relative z-10">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="relative group/input">
                    <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        step="0.01"
                        className="block w-full rounded-xl glass-input p-3.5 pl-9 transition-shadow"
                        required
                        placeholder="0.00"
                    />
                    <span className="absolute left-3.5 top-[32px] text-gray-400 font-medium pointer-events-none">₹</span>
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">Category</label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="block w-full rounded-xl glass-input p-3.5 appearance-none cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-dark-card text-gray-200 py-2">{cat}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="block w-full rounded-xl glass-input p-3.5 cursor-pointer"
                        required
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">Description (Optional)</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What was this for?"
                        className="block w-full rounded-xl glass-input p-3.5"
                    />
                </div>
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="w-1/3 flex justify-center items-center py-3.5 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-bold text-gray-300 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-base focus:ring-gray-500 disabled:opacity-50 transition-all duration-200"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-2/3 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.25)] text-sm font-bold text-white bg-gradient-to-r from-neon-indigo to-neon-purple hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-base focus:ring-neon-indigo disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    >
                        {loading ? 'Adding...' : 'Add Expense'}
                        {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;
