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
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Add Expense</h2>
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 border border-red-200">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        step="0.01"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border transition-colors duration-200"
                        required
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border transition-colors duration-200"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border transition-colors duration-200"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What was this for?"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border transition-colors duration-200"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    {loading ? 'Adding...' : 'Add Expense'}
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
