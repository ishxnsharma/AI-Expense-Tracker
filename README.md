# 🚀 AI-Powered Expense Tracker

An intelligent, full-stack financial management dashboard designed to do more than just record what you spent—it actively analyzes your financial habits and gives you actionable advice using Google's Gemini AI.

![AI-Powered Expense Tracker Banner](https://via.placeholder.com/1000x300.png?text=AI-Powered+Expense+Tracker)

## 🎯 The Problem We're Solving
Most expense trackers serve as simple digital ledgers. Users input data, see a chart, and then are left to figure out what it all means. 
**Our solution bridges the gap between tracking and financial advisory.** By leveraging the Gemini API, our application processes a user's recent transactions and delivers context-aware, personalized financial insights and cost-saving recommendations.

---

## ✨ Key Features & Architecture

### 1. Intelligent AI Advisor (The "Brain")
Instead of generic advice, our Express backend securely transmits the last 30 days of user spending to the **Gemini 2.5 Flash API**. 
- **Contextual Formatting:** Database rows are parsed into a lightweight string structure to minimize latency and token usage.
- **Structured Output:** The AI guarantees a strict JSON response containing a high-level summary and actionable recommendations.
- **Resilience:** Built-in error handling manages API timeouts and graceful fallbacks if the AI is unreachable.

### 2. Modern, Responsive Frontend
Built with **Vite + React** and styled using **Tailwind CSS**.
- **Instant Visualizations:** We utilize `recharts` to render a dynamic Pie Chart that recalculates category totals on the fly as new expenses are added.
- **Optimized UX:** Smooth, modern UI with micro-animations and loading states to keep users engaged while AI requests process.

### 3. Robust Backend API
A lightweight **Node.js/Express** layer sitting in front of a **PostgreSQL** database.
- Uses `pg` connection pooling for fast dataset retrieval.
- Proper CORS handling and relational database schemas with cascading deletes.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Axios |
| **Backend** | Node.js, Express.js, dotenv, CORS |
| **Database** | PostgreSQL |
| **Artificial Intelligence** | Google Gemini Generative AI (`gemini-2.5-flash`) |

---

## 💡 How the AI Pipeline Works (For Judges)

When a user clicks **"Generate Insights"**, here is the technical flow:
1. **Trigger:** The React client hits `GET /api/expenses/insights`.
2. **Data Aggregation:** The PostgreSQL database runs a query to fetch only the records from `CURRENT_DATE - INTERVAL '30 days'`.
3. **Prompt Engineering:** The Node service loops through the data, formatting it into a tight prompt (e.g., `- 2026-02-26: Food (₹25.00) - Lunch`).
4. **AI Generation:** The Gemini model is instructed via `generationConfig: { responseMimeType: "application/json" }` to guarantee a fixed JSON structure.
5. **Delivery:** The backend parses the AI string into a JSON object and streams it back to the React dashboard, rendering the summary and bullet points.

---

## 🚀 Running the Project Locally

To test this project locally, ensure you have **Node.js** and **PostgreSQL** installed.

### 1. Database Setup
1. Open pgAdmin or your terminal and create a database named `expense_tracker`.
2. Run the SQL commands found in `schema.sql` to generate the `users` and `expenses` tables.

### 2. Environment Variables
You will need two `.env` files.

**Root level (`/.env`):**
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
GEMINI_API_KEY=your_gemini_api_key
```

**Client Level (`/client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install & Run
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```

Open your browser to `http://localhost:5173` to experience the app!
