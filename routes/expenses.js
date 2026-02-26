const express = require('express');
const router = express.Router();
const db = require('../db');
const { generateFinancialInsights } = require('../services/aiService');

// GET all expenses
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM expenses ORDER BY date DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error retrieving expenses' });
    }
});

// POST a new expense
router.post('/', async (req, res) => {
    const { user_id, amount, category, date, description } = req.body;
    try {
        const queryText = `
      INSERT INTO expenses (user_id, amount, category, date, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        // using user_id 1 as default for MVP
        const { rows } = await db.query(queryText, [user_id || 1, amount, category, date, description]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating expense' });
    }
});

// GET AI insights based on expenses
router.get('/insights', async (req, res) => {
    try {
        // Fetch last 30 days of expenses
        const queryText = `
      SELECT * FROM expenses 
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY date DESC
    `;
        const { rows } = await db.query(queryText);

        if (rows.length === 0) {
            return res.json({ summary: "No expenses recorded in the last 30 days.", recommendations: [] });
        }

        const insights = await generateFinancialInsights(rows);
        res.json(insights);
    } catch (err) {
        console.error('Insights error:', err);
        res.status(503).json({ error: 'Failed to generate insights. AI service might be unavailable / timed out.' });
    }
});

module.exports = router;
