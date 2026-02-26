const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize the Gemini API client using your key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateFinancialInsights(expensesArray) {
    try {
        // Use gemini-1.5-flash for faster and cost-effective insights
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Format your PostgreSQL data into a readable string for the AI
        const dataSummary = expensesArray.map(e =>
            `- ${e.date}: ${e.category} (₹${e.amount}) - ${e.description || 'No desc'}`
        ).join('\n');

        const prompt = `
        You are a financial advisor. Analyze these expenses from the last 30 days:
        ${dataSummary}

        Return a JSON object with:
        "summary": A 2-sentence overview of spending habits.
        "recommendations": An array of 3 specific tips to save money.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text());

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("AI service might be unavailable / timed out.");
    }
}

module.exports = { generateFinancialInsights };